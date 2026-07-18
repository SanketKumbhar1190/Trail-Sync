package com.trailsync.dto;

import java.util.Map;

public class ExpenseSplitRequest {

    private String name;
    private Double amount;
    private String description;
    private Map<String, Double> shares;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Map<String, Double> getShares() {
        return shares;
    }

    public void setShares(Map<String, Double> shares) {
        this.shares = shares;
    }
}
