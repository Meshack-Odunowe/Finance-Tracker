export type TransactionType = "income" | "expense";
export type RecurrenceType = "weekly" | "monthly" | "yearly";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string; // ISO string format
  isRecurring?: boolean;
  recurrenceType?: RecurrenceType | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: TransactionType;
}

export interface DashboardWidget {
  id: string;
  userId: string;
  name: string;
  isVisible: boolean;
  order: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: string;
  description: string;
  metadata?: any;
  createdAt: string;
}

export interface UserPreferences {
  preferredCurrency: string;
  themePreference: string;
}
