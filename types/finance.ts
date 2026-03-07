export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string; // ISO string format
  createdAt?: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: string;
  limit: number;
}

