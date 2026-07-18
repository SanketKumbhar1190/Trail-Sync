package com.trailsync.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.trailsync.dto.ExpenseSplitRequest;
import com.trailsync.model.Event;
import com.trailsync.model.Expense;
import com.trailsync.service.ExpenseService;

import jakarta.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

	private final ExpenseService expenseService;

	@Autowired
	public ExpenseController(ExpenseService expenseService) {
		this.expenseService = expenseService;
	}

	// Add a new expense to an event
	@PostMapping("/add/{eventId}")
	public ResponseEntity<Expense> addExpense(@PathVariable Long eventId, @Valid @RequestBody Expense expense) {
		expense.setEvent(null); // Ensure no invalid event association at this point
		expense.setEvent(new Event(eventId)); // Assuming the eventId exists
		Expense createdExpense = expenseService.addExpense(expense,eventId);
		return ResponseEntity.ok(createdExpense);
	}


	// Get all expenses associated with an event
	@GetMapping("/event/{eventId}")
	public ResponseEntity<List<Expense>> getExpensesForEvent(@PathVariable Long eventId) {
		List<Expense> expenses = expenseService.getExpensesForEvent(eventId);
		return ResponseEntity.ok(expenses);
	}

	// Split the expense for an event based on given criteria
	@PostMapping("/split/{eventId}")
	public ResponseEntity<List<Expense>> addExpenseAndSplit(@PathVariable Long eventId,
			@RequestBody ExpenseSplitRequest request, @RequestParam String splitType) {

		Expense expense = new Expense();
		expense.setName(request.getName());
		expense.setAmount(request.getAmount());
		expense.setDescription(request.getDescription());

		Map<Long, Double> participantShares = null;
		if (request.getShares() != null) {
			participantShares = new HashMap<>();
			for (Map.Entry<String, Double> entry : request.getShares().entrySet()) {
				participantShares.put(Long.parseLong(entry.getKey()), entry.getValue());
			}
		}

		List<Expense> expenses = expenseService.addExpenseAndSplit(eventId, expense, splitType, participantShares);
		return ResponseEntity.ok(expenses);
	}

	// Calculate the total expense for a given event
	@GetMapping("/total/{eventId}")
	public ResponseEntity<Double> calculateTotalExpensesForEvent(@PathVariable Long eventId) {
		double totalAmount = expenseService.calculateTotalExpensesForEvent(eventId);
		return ResponseEntity.ok(totalAmount);
	}

	// Update an existing expense
	@PutMapping("/{expenseId}")
	public ResponseEntity<Expense> updateExpense(@PathVariable Long expenseId, @Valid @RequestBody Expense updatedExpense) {

		Expense updated = expenseService.updateExpense(expenseId, updatedExpense);
		return ResponseEntity.ok(updated);
	}

	// Delete an existing expense by its ID
	@DeleteMapping("/{expenseId}")
	public ResponseEntity<String> deleteExpense(@PathVariable Long expenseId) {
		expenseService.deleteExpense(expenseId);
		return ResponseEntity.ok("Expense deleted successfully.");
	}
}
