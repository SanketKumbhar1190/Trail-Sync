package com.trailsync.serviceimpl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trailsync.model.Event;
import com.trailsync.model.Expense;
import com.trailsync.model.User;
import com.trailsync.repository.EventRepository;
import com.trailsync.repository.ExpenseRepository;
import com.trailsync.service.ExpenseService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private static final double ROUNDING_TOLERANCE = 0.01;

    private final ExpenseRepository expenseRepository;
    private final EventRepository eventRepository;

    // Constructor for dependency injection
    public ExpenseServiceImpl(ExpenseRepository expenseRepository, EventRepository eventRepository) {
        this.expenseRepository = expenseRepository;
        this.eventRepository = eventRepository;
    }


    @Override
    public Expense addExpense(Expense expense, Long eventId) {
        // Fetch the event associated with the given eventId
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        // Set the event for the expense
        expense.setEvent(event);
        
        // Save and return the new expense
        return expenseRepository.save(expense);
    }

    @Override
    public List<Expense> getExpensesForEvent(Long eventId) {
        // Find expenses based on eventId
        return expenseRepository.findByEventId(eventId);
    }

    @Override
    @Transactional
    public List<Expense> addExpenseAndSplit(Long eventId, Expense expense, String splitType,
            Map<Long, Double> participantShares) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        double totalAmount = expense.getAmount();
        List<User> participants = event.getParticipants();
        int participantsCount = participants.size();

        if (participantsCount == 0) {
            throw new IllegalArgumentException("Cannot split expense. No participants found.");
        }

        List<Expense> splitExpenses = new ArrayList<>();

        if ("equal".equals(splitType)) {
            double amountPerParticipant = totalAmount / participantsCount;
            double allocated = 0;

            for (int i = 0; i < participantsCount; i++) {
                User participant = participants.get(i);
                double share = (i == participantsCount - 1)
                        ? Math.round((totalAmount - allocated) * 100.0) / 100.0
                        : Math.round(amountPerParticipant * 100.0) / 100.0;
                allocated += share;

                Expense participantExpense = buildParticipantExpense(event, expense, participant, share,
                        "Equal share for " + participant.getUsername());
                splitExpenses.add(expenseRepository.save(participantExpense));
            }

        } else if ("percentage".equals(splitType)) {
            Map<Long, Double> percentages = requireShares(participantShares, "percentage");
            double percentageSum = percentages.values().stream().mapToDouble(Double::doubleValue).sum();
            if (Math.abs(percentageSum - 100.0) > ROUNDING_TOLERANCE) {
                throw new IllegalArgumentException("Percentages must sum to 100.");
            }

            for (User participant : participants) {
                Double percentage = percentages.get(participant.getId());
                if (percentage == null) {
                    throw new IllegalArgumentException(
                            "Missing percentage for participant " + participant.getUsername());
                }
                double share = Math.round((percentage / 100.0) * totalAmount * 100.0) / 100.0;
                Expense participantExpense = buildParticipantExpense(event, expense, participant, share,
                        percentage + "% share for " + participant.getUsername());
                splitExpenses.add(expenseRepository.save(participantExpense));
            }

        } else if ("individual".equals(splitType)) {
            Map<Long, Double> amounts = requireShares(participantShares, "individual");
            double amountsSum = amounts.values().stream().mapToDouble(Double::doubleValue).sum();
            if (Math.abs(amountsSum - totalAmount) > ROUNDING_TOLERANCE) {
                throw new IllegalArgumentException("Individual amounts must sum to the total expense amount.");
            }

            for (User participant : participants) {
                Double share = amounts.get(participant.getId());
                if (share == null) {
                    throw new IllegalArgumentException(
                            "Missing amount for participant " + participant.getUsername());
                }
                Expense participantExpense = buildParticipantExpense(event, expense, participant, share,
                        "Individual share for " + participant.getUsername());
                splitExpenses.add(expenseRepository.save(participantExpense));
            }

        } else {
            throw new IllegalArgumentException("Unsupported split type: " + splitType);
        }

        return expenseRepository.findByEventId(eventId);
    }

    private Map<Long, Double> requireShares(Map<Long, Double> participantShares, String splitType) {
        if (participantShares == null || participantShares.isEmpty()) {
            throw new IllegalArgumentException("Participant shares are required for " + splitType + " split.");
        }
        return participantShares;
    }

    private Expense buildParticipantExpense(Event event, Expense source, User participant, double amount,
            String description) {
        Expense participantExpense = new Expense();
        participantExpense.setEvent(event);
        participantExpense.setName(source.getName());
        participantExpense.setAmount(amount);
        participantExpense.setDescription(
                source.getDescription() != null && !source.getDescription().isBlank()
                        ? source.getDescription() + " (" + description + ")"
                        : description);
        return participantExpense;
    }

    @Override
    public double calculateTotalExpensesForEvent(Long eventId) {
        // Calculate the total expense for a given event based on eventId
        List<Expense> expenses = expenseRepository.findByEventId(eventId);
        return expenses.stream().mapToDouble(Expense::getAmount).sum();
    }

    @Override
    public Expense updateExpense(Long expenseId, Expense updatedExpense) {
    //	System.out.println("Updating expense with ID: " + expenseId);
        // Fetch the existing expense and update details
        Expense existingExpense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));

        existingExpense.setDescription(updatedExpense.getDescription());
        existingExpense.setAmount(updatedExpense.getAmount());

        // Save and return the updated expense
        return expenseRepository.save(existingExpense);
    }

    @Override
    public void deleteExpense(Long expenseId) {
        // Delete an expense by its id
        expenseRepository.deleteById(expenseId);
    }
}
