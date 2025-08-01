package com.trailsync.serviceimpl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trailsync.model.Event;
import com.trailsync.model.Expense;
import com.trailsync.model.User;
import com.trailsync.repository.EventRepository;
import com.trailsync.repository.ExpenseRepository;
import com.trailsync.service.ExpenseService;

import java.util.List;

@Service
public class ExpenseServiceImpl implements ExpenseService {

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
    public List<Expense> addExpenseAndSplit(Long eventId, Expense expense, String splitType) {
        // Fetch the event associated with the given eventId
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        double totalAmount = expense.getAmount();
        int participantsCount = event.getParticipants().size();

        // Validate that there are participants in the event
        if (participantsCount == 0) {
            throw new IllegalArgumentException("Cannot split expense. No participants found.");
        }

        // Logic for dividing the expense among participants
        if ("equal".equals(splitType)) {
            double amountPerParticipant = totalAmount / participantsCount;
            expense.setDescription("Expense split equally among " + participantsCount + " participants.");
            expenseRepository.save(expense);

            // Assuming each participant gets an equal amount
            event.getParticipants().forEach(participant -> {
                Expense participantExpense = new Expense();
                participantExpense.setEvent(event);
                participantExpense.setAmount(amountPerParticipant);
                participantExpense.setDescription("Expense for participant " + participant.getUsername());
                expenseRepository.save(participantExpense);
            });

        } else if ("percentage".equals(splitType)) {
            double percentagePerParticipant = totalAmount / participantsCount;

            // Percentage-based split for each participant
            event.getParticipants().forEach(participant -> {
                double participantAmount = (percentagePerParticipant / 100) * totalAmount;
                Expense participantExpense = new Expense();
                participantExpense.setEvent(event);
                participantExpense.setAmount(participantAmount);
                participantExpense.setDescription("Percentage-based expense for participant " + participant.getUsername());
                expenseRepository.save(participantExpense);
            });

        } else if ("individual".equals(splitType)) {
            // Individual share input logic for each participant
            event.getParticipants().forEach(participant -> {
                double participantShare = getIndividualShareFromUser(participant);
                Expense participantExpense = new Expense();
                participantExpense.setEvent(event);
                participantExpense.setAmount(participantShare);
                participantExpense.setDescription("Individual expense for participant " + participant.getUsername());
                expenseRepository.save(participantExpense);
            });
        }

        // Return the list of expenses associated with the event after updates
        return expenseRepository.findByEventId(eventId);
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

    // Utility method for simulating individual share logic
    private double getIndividualShareFromUser(User participant) {
        // Placeholder for custom logic, could be based on user input or specific share calculation
        return Math.round(Math.random() * 1000.0) / 100.0;  // Simulating a random value.
    }
}
