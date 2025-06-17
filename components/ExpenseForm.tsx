import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Expense, ValidationErrors, CATEGORIES } from "../types/expense";

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void;
  onUpdateExpense: (expense: Expense) => void;
  editingExpense: Expense | null;
  onCancelEdit: () => void;
  categories: readonly string[];
  currentMonth: number;
  currentYear: number;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onAddExpense,
  onUpdateExpense,
  editingExpense,
  onCancelEdit,
  categories,
  currentMonth,
  currentYear,
}) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showDescription, setShowDescription] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const formRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount);
      setDescription(editingExpense.description || "");
      setShowDescription(!!editingExpense.description);
      setCategory(editingExpense.category);
      formRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      setShowDescription(false);
    }
  }, [editingExpense]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = currentYear;
    const month = currentMonth + 1;
    const day = now.getDate();
    const date = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
    const time = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { date, time };
  };

  const validateInputs = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum)) {
        newErrors.amount = "Please enter a valid number";
      } else if (amountNum <= 0) {
        newErrors.amount = "Amount must be greater than 0";
      } else if (amountNum > 1000000) {
        newErrors.amount = "Amount cannot exceed ₹10,00,000";
      }
    }

    if (description.length > 100) {
      newErrors.description = "Description cannot exceed 100 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setShowDescription(false);
    setCategory(categories[0]);
    setErrors({});
    onCancelEdit();
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      if (editingExpense) {
        onUpdateExpense({
          ...editingExpense,
          amount: parseFloat(amount).toString(),
          description: description.trim(),
          category,
          date: editingExpense.date,
          time: editingExpense.time,
        });
      } else {
        const { date, time } = getCurrentDateTime();
        onAddExpense({
          id: Date.now().toString(),
          amount: parseFloat(amount).toString(),
          description: description.trim(),
          date,
          time,
          category,
        });
      }
      resetForm();
    }
  };

  const isAmountValid = () => {
    const amountNum = parseFloat(amount);
    return (
      amount.trim() &&
      !isNaN(amountNum) &&
      amountNum > 0 &&
      amountNum <= 1000000
    );
  };

  return (
    <ScrollView ref={formRef} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Money Tracker</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputIcon}>₹</Text>
          <TextInput
            style={[styles.input, errors.amount && styles.inputError]}
            placeholder="Amount"
            value={amount}
            onChangeText={(text) => {
              setAmount(text);
              if (errors.amount) {
                setErrors({ ...errors, amount: undefined });
              }
            }}
            keyboardType="numeric"
            autoFocus
          />
        </View>
        {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

        {!showDescription && (
          <TouchableOpacity
            style={styles.addNoteButton}
            onPress={() => setShowDescription(true)}
          >
            <Text style={styles.addNoteText}>+ Add note (optional)</Text>
          </TouchableOpacity>
        )}

        {showDescription && (
          <View style={styles.inputWrapper}>
            <Text style={styles.inputIcon}>📝</Text>
            <TextInput
              style={[styles.input, errors.description && styles.inputError]}
              placeholder="Description (optional)"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) {
                  setErrors({ ...errors, description: undefined });
                }
              }}
              maxLength={100}
              multiline
            />
          </View>
        )}
        {errors.description && (
          <Text style={styles.errorText}>{errors.description}</Text>
        )}

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setShowCategoryPicker(!showCategoryPicker)}
        >
          <Text style={styles.categoryButtonText}>📂 Category: {category}</Text>
        </TouchableOpacity>

        {showCategoryPicker && (
          <View style={styles.categoryList}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryItem,
                  category === cat && styles.selectedCategory,
                ]}
                onPress={() => {
                  setCategory(cat);
                  setShowCategoryPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.categoryItemText,
                    category === cat && styles.selectedCategoryText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.formButtons}>
          <TouchableOpacity
            style={[
              styles.button,
              editingExpense && styles.cancelButton,
              !isAmountValid() && !editingExpense && styles.buttonDisabled,
            ]}
            onPress={editingExpense ? resetForm : handleSubmit}
            disabled={!isAmountValid() && !editingExpense}
          >
            <Text style={styles.buttonText}>
              {editingExpense ? "Cancel" : "Add Expense"}
            </Text>
          </TouchableOpacity>

          {editingExpense && (
            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    paddingBottom: 10,
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#2ecc71",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  form: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fafbfc",
  },
  inputError: {
    borderColor: "#ff6b6b",
    borderWidth: 1,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  addNoteButton: {
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  addNoteText: {
    color: "#2ecc71",
    fontSize: 14,
  },
  categoryButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryButtonText: {
    color: "#2c3e50",
    fontSize: 15,
  },
  categoryList: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 10,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryItem: {
    padding: 8,
    borderRadius: 5,
  },
  selectedCategory: {
    backgroundColor: "#2ecc71",
  },
  categoryItemText: {
    fontSize: 15,
    color: "#2c3e50",
  },
  selectedCategoryText: {
    color: "white",
    fontWeight: "bold",
  },
  formButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#2ecc71",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonDisabled: {
    backgroundColor: "#b2f0d6",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
  },
  updateButton: {
    backgroundColor: "#3498db",
  },
});

export default ExpenseForm;
