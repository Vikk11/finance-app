export type TransactionRequest = {
    amount: number;
    type: "INCOME" | "EXPENSE";
    categoryId?: number | null;
    relatedUserId?: number | null;
    name: string;
    date?: string | null;
};
