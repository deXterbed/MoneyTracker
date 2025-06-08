import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Expense } from "../types/expense";
import { Swipeable } from "react-native-gesture-handler";

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onEditExpense: (expense: Expense) => void;
  editingExpense?: Expense | null;
}

function formatDate(dateStr: string): string {
  const today = new Date();
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString();
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onDeleteExpense,
  onEditExpense,
  editingExpense,
}) => {
  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDeleteExpense(id),
        },
      ]
    );
  };

  if (expenses.length === 0) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateText}>
          No expenses yet. Start tracking!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.expenseList}>
      {expenses.map((expense, idx) => (
        <View key={expense.id}>
          {editingExpense ? (
            <View style={styles.expenseItem}>
              <View style={styles.expenseInfo}>
                {expense.description ? (
                  <Text style={styles.expenseDescription}>
                    {expense.description}
                  </Text>
                ) : (
                  <Text style={styles.noDescription}>No description</Text>
                )}
                <View style={styles.expenseDetails}>
                  <Text style={styles.expenseCategory}>{expense.category}</Text>
                  <View style={styles.dateTimeWrapper}>
                    <Text style={styles.expenseDate}>
                      {formatDate(expense.date)}
                    </Text>
                    {expense.time ? (
                      <Text style={styles.expenseTime}>{expense.time}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
              <View style={styles.expenseActions}>
                <Text style={styles.expenseAmount}>₹{expense.amount}</Text>
              </View>
            </View>
          ) : (
            <Swipeable
              renderRightActions={() => (
                <View style={styles.swipeActions}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => onEditExpense(expense)}
                    accessibilityLabel="Edit expense"
                    accessibilityHint="Edit this expense entry"
                  >
                    <Text style={styles.editButtonText}>✎</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(expense.id)}
                    accessibilityLabel="Delete expense"
                    accessibilityHint="Delete this expense entry"
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                </View>
              )}
            >
              <View style={styles.expenseItem}>
                <View style={styles.expenseInfo}>
                  {expense.description ? (
                    <Text style={styles.expenseDescription}>
                      {expense.description}
                    </Text>
                  ) : (
                    <Text style={styles.noDescription}>No description</Text>
                  )}
                  <View style={styles.expenseDetails}>
                    <Text style={styles.expenseCategory}>
                      {expense.category}
                    </Text>
                    <View style={styles.dateTimeWrapper}>
                      <Text style={styles.expenseDate}>
                        {formatDate(expense.date)}
                      </Text>
                      {expense.time ? (
                        <Text style={styles.expenseTime}>{expense.time}</Text>
                      ) : null}
                    </View>
                  </View>
                </View>
                <View style={styles.expenseActions}>
                  <Text style={styles.expenseAmount}>₹{expense.amount}</Text>
                </View>
              </View>
            </Swipeable>
          )}
          {idx !== expenses.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  expenseList: {
    flex: 1,
    padding: 10,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyStateText: {
    color: "#aaa",
    fontSize: 16,
    fontStyle: "italic",
  },
  expenseItem: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.13,
    shadowRadius: 1.41,
    elevation: 2,
  },
  divider: {
    height: 8,
    backgroundColor: "transparent",
  },
  expenseInfo: {
    flex: 1,
    marginRight: 10,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: "500",
    color: "#222",
  },
  noDescription: {
    fontSize: 14,
    color: "#bbb",
    fontStyle: "italic",
  },
  expenseDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dateTimeWrapper: {
    flexDirection: "column",
    justifyContent: "center",
  },
  expenseDate: {
    fontSize: 12,
    color: "#666",
  },
  expenseTime: {
    fontSize: 11,
    color: "#bbb",
    marginTop: 2,
  },
  expenseCategory: {
    fontSize: 12,
    color: "#219150",
    backgroundColor: "#e8f8f5",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 10,
    fontWeight: "bold",
    overflow: "hidden",
  },
  expenseActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  expenseAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2ecc71",
    marginRight: 8,
  },
  swipeActions: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  editButton: {
    backgroundColor: "#3498db",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff6b6b",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 20,
  },
});

export default ExpenseList;
