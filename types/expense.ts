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
  "Transportation",
  "Shopping",
  "Bills & Utilities",
  "Entertainment",
  "Health",
  "Education",
  "Travel",
  "Other",
] as const;
