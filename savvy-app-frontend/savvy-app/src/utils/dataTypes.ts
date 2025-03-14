export type TransactionRequest = {
    amount: number;
    type: "INCOME" | "EXPENSE";
    categoryId?: number | null;
    relatedUserId?: number | null;
    name: string;
    date?: string | null;
};

export type TransactionResponse = {
    id: number;
    userId: number;
    amount: number;
    type: "INCOME" | "EXPENSE";
    categoryId?: number | null;
    relatedUserId?: number | null;
    name?: string;
    date: string;
    createdAt: string;
    updatedAt: string;
};
