export type TransactionRequest = {
    amount: number;
    type: "INCOME" | "EXPENSE";
    categoryId: number;
    relatedUserId?: number | null;
    name: string;
    date?: string | null;
};

export type TransactionResponse = {
    id: number;
    userId: number;
    amount: number;
    type: "INCOME" | "EXPENSE";
    categoryId: number;
    relatedUserId?: number | null;
    name?: string;
    date: string;
    createdAt: string;
    updatedAt: string;
};

export type BudgetRequest = {
    categoryId?: number | null;
    amountLimit: number;
    period: string;
};

export type BudgetResponse = {
    id: number;
    userId: number;
    categoryId?: number | null;
    amountLimit: number;
    period: string;
    alertThreshold: number;
    createdAt: string;
    updatedAt: string;
    currentAmount: number;
};

export type UserRequest = {
    userUid: string;
    currentBalance: number;
}
