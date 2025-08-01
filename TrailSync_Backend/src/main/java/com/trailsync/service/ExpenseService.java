package com.trailsync.service;

import java.util.List;

import com.trailsync.model.Expense;

public interface ExpenseService {

    Expense addExpense(Expense expense,Long EventId);

   
    List<Expense> getExpensesForEvent(Long eventId);

   
    List<Expense> addExpenseAndSplit(Long eventId, Expense expense, String splitType);

  
    double calculateTotalExpensesForEvent(Long eventId);

   
    Expense updateExpense(Long expenseId, Expense updatedExpense);

    
    void deleteExpense(Long expenseId);
}
