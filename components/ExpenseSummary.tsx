import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Expense } from "../types/expense";

interface ExpenseSummaryProps {
  expenses: Expense[];
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ expenses }) => {
  const { total, monthName, hasExpenses } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filtered = expenses.filter((expense) => {
      const [year, month, day] = expense.date.split("-").map(Number);
      const expenseDate = new Date(year, month - 1, day);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });
    const total = filtered.reduce(
      (total, expense) => total + parseFloat(expense.amount),
      0
    );
    return {
      total,
      monthName: now.toLocaleString("default", { month: "long" }),
      hasExpenses: filtered.length > 0,
    };
  }, [expenses]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.summaryIcon}>📊</Text>
        <View>
          <Text style={styles.title}>Monthly Summary</Text>
          <Text style={styles.monthText}>{monthName}</Text>
        </View>
      </View>
      <View style={styles.summaryBox}>
        <Text style={styles.label}>Total Expenses</Text>
        <Text style={[styles.amountText, !hasExpenses && styles.emptyAmount]}>
          ₹{total.toLocaleString()}
        </Text>
        {!hasExpenses && (
          <Text style={styles.emptyText}>No expenses yet this month!</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "white",
    borderRadius: 18,
    margin: 14,
    marginTop: 28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  summaryIcon: {
    fontSize: 32,
    marginRight: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  monthText: {
    fontSize: 15,
    color: "#666",
    marginTop: 2,
  },
  summaryBox: {
    backgroundColor: "#f8f9fa",
    padding: 24,
    borderRadius: 14,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  amountText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 6,
  },
  emptyAmount: {
    color: "#bbb",
  },
  emptyText: {
    color: "#aaa",
    fontSize: 15,
    fontStyle: "italic",
    marginTop: 6,
  },
});

export default ExpenseSummary;
