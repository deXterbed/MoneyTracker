import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Button,
  Text,
  View,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  State as GestureState,
} from "react-native-gesture-handler";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import ExpenseSummary from "./components/ExpenseSummary";
import { Expense, CATEGORIES } from "./types/expense";
import { db } from "./firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  syncExpensesWithCloud,
  addExpenseCloudSynced,
  updateExpenseCloudSynced,
  deleteExpenseCloudSynced,
} from "./storageSync";

const STORAGE_KEY = "expenses";

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  // Month/year state
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth()); // 0-based
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  // Animation state
  const slideAnim = useRef(new Animated.Value(0)).current;
  const directionRef = useRef(0); // -1 for left, 1 for right

  // At app start, sync both storages and set state
  useEffect(() => {
    const doSync = async () => {
      try {
        const merged = await syncExpensesWithCloud();
        setExpenses(merged);
      } catch (e) {
        console.error("Failed to sync expenses", e);
      }
    };
    doSync();
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

  // Add expense and sync to Firestore/AsyncStorage
  const handleAddExpense = async (newExpense: Expense) => {
    try {
      const updated = await addExpenseCloudSynced(newExpense);
      setExpenses(updated);
    } catch (e) {
      console.error("Failed to add expense", e);
    }
  };

  // Update expense and sync to Firestore/AsyncStorage
  const handleUpdateExpense = async (updatedExpense: Expense) => {
    try {
      const updated = await updateExpenseCloudSynced(updatedExpense);
      setExpenses(updated);
    } catch (e) {
      console.error("Failed to update expense", e);
    }
  };

  // Delete expense and sync to Firestore/AsyncStorage
  const handleDeleteExpense = async (id: string) => {
    try {
      const updated = await deleteExpenseCloudSynced(id);
      setExpenses(updated);
    } catch (e) {
      console.error("Failed to delete expense", e);
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  // Animate slide
  const animateSlide = (dir: number, onComplete: () => void) => {
    directionRef.current = dir;
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: dir * 400, // slide out (reverse direction)
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: dir * -400, // jump to other side (reverse direction)
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, // slide in
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(onComplete);
  };

  // Handle swipe left/right to change month
  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    const { translationX, velocityX, state } = event.nativeEvent;
    if (state === GestureState.END) {
      if (translationX < -50 && Math.abs(velocityX) > 200) {
        // Swipe left: next month
        animateSlide(-1, () => {
          setCurrentMonth((prev) => {
            if (prev === 11) {
              setCurrentYear((y) => y + 1);
              return 0;
            }
            return prev + 1;
          });
        });
      } else if (translationX > 50 && Math.abs(velocityX) > 200) {
        // Swipe right: previous month
        animateSlide(1, () => {
          setCurrentMonth((prev) => {
            if (prev === 0) {
              setCurrentYear((y) => y - 1);
              return 11;
            }
            return prev - 1;
          });
        });
      }
    }
  };

  // Filter expenses for the selected month/year
  let filteredExpenses = expenses.filter((expense) => {
    const [year, month] = expense.date.split("-");
    return (
      parseInt(year) === currentYear && parseInt(month) - 1 === currentMonth
    );
  });

  // Sort by date and time descending
  filteredExpenses = filteredExpenses.sort((a, b) => {
    // Compare date first
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    // If dates are equal, compare time
    if (a.time && b.time) {
      return b.time.localeCompare(a.time);
    }
    return 0;
  });

  // Month name for header
  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long", year: "numeric" }
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
          <Animated.View
            style={{ flex: 1, transform: [{ translateX: slideAnim }] }}
          >
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <ExpenseForm
                onAddExpense={handleAddExpense}
                onUpdateExpense={handleUpdateExpense}
                editingExpense={editingExpense}
                onCancelEdit={handleCancelEdit}
                categories={CATEGORIES}
                currentMonth={currentMonth}
                currentYear={currentYear}
              />
              <View style={styles.monthHeaderRow}>
                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={() => {
                    setCurrentMonth((prev) => {
                      if (prev === 0) {
                        setCurrentYear((y) => y - 1);
                        return 11;
                      }
                      return prev - 1;
                    });
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.arrowIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.monthHeader}>{monthName}</Text>
                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={() => {
                    setCurrentMonth((prev) => {
                      if (prev === 11) {
                        setCurrentYear((y) => y + 1);
                        return 0;
                      }
                      return prev + 1;
                    });
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.arrowIcon}>→</Text>
                </TouchableOpacity>
              </View>
              <ExpenseList
                expenses={filteredExpenses}
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
              {showSummary && (
                <ExpenseSummary
                  expenses={filteredExpenses}
                  month={currentMonth}
                  year={currentYear}
                />
              )}
            </ScrollView>
            <StatusBar style="auto" />
          </Animated.View>
        </PanGestureHandler>
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
  monthHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 6,
    gap: 10,
  },
  monthHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginHorizontal: 16,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#eaf6fb",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  arrowIcon: {
    fontSize: 22,
    color: "#3498db",
    fontWeight: "bold",
  },
});
