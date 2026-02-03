export interface Transaction {
    id: string;
    amount: number;
    category: 'Food' | 'Tech' | 'Transport' | 'Entertainment';
    type: 'income' | 'expense';
    date: string;
    description: string;
}

export interface BudgetStats {
    totalBalance: number;
    monthlyExpenses: number;
    aiAdvice: string;
}