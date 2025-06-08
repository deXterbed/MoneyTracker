import { StatusBar } from "expo-status-bar";
import { StyleSheet, SafeAreaView, ScrollView, Button } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseSummary from "./components/ExpenseSummary";
import { Expense, CATEGORIES } from "./types/expense";

const STORAGE_KEY = "expenses";

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Load expenses from AsyncStorage on mount
  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setExpenses(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load expenses", e);
      }
    };
    loadExpenses();
  }, []);

  // Save expenses to AsyncStorage whenever they change
  useEffect(() => {
    const saveExpenses = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
      } catch (e) {
        console.error("Failed to save expenses", e);
      }
    };
    saveExpenses();
  }, [expenses]);

  const handleAddExpense = (newExpense: Expense) => {
    setExpenses([...expenses, newExpense]);
  };

  const handleUpdateExpense = (updatedExpense: Expense) => {
    setExpenses(
      expenses.map((exp) =>
        exp.id === updatedExpense.id ? updatedExpense : exp
      )
    );
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ExpenseForm
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            editingExpense={editingExpense}
            onCancelEdit={handleCancelEdit}
            categories={CATEGORIES}
          />
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
            onEditExpense={handleEditExpense}
            editingExpense={editingExpense}
          />
          <Button
            title={
              showSummary ? "Hide Monthly Summary" : "Show Monthly Summary"
            }
            onPress={() => setShowSummary((prev) => !prev)}
          />
          {showSummary && <ExpenseSummary expenses={expenses} />}
        </ScrollView>
        <StatusBar style="auto" />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
});
