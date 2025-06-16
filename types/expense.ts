export interface Expense {
  id: string;
  amount: string;
  description?: string;
  date: string;
  time: string;
  category: string;
}

export interface ValidationErrors {
  amount?: string;
  description?: string;
}

export const CATEGORIES = [
  "Food & Dining",
  "Groceries",
  "Shopping",
  "Entertainment & Leisure",
  "Transportation & Fuel",
  "Bills & Utilities",
  "Rent",
  "EMI",
  "Investments",
  "Direct Transfer",
  "Credit Card",
  "Health & Fitness",
  "Education",
  "Travel",
  "Other",
] as const;
