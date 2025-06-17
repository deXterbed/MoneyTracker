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
  "Instamart",
  "Shopping",
  "Entertainment",
  "Fuel",
  "Rent",
  "Maintenance",
  "Bills & Utilities",
  "EMI",
  "Deposit",
  "Investment",
  "Direct Transfer",
  "Credit Card",
  "Health & Fitness",
  "Education",
  "Travel",
  "Other",
] as const;
