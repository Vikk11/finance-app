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
    categoryId: number;
    amountLimit: number;
    period: string;
};

export type BudgetResponse = {
    id: number;
    userId: number;
    categoryId: number;
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
};

export type UserResponse = {
    id: number;
    userUid: string;
};

export type UserDisplayInfo = {
    id: string;
    name: string;
    username: string;
    isContact: boolean;
};

export type GroupResponse = {
    id: number;
    groupName: string;
    members: number;
    createdBy: UserResponse;
    createdAt: string;
    updatedAt: string;
}

export type PaymentRequest = {
    id: number;
    requesterId: UserResponse;
    payerId?: UserResponse;
    groupId?: GroupResponse;
    amount: number;
    description?: string;
    status: "PENDING" | "PAID" | "DECLINED";
    isRecurring: boolean;
    createdAt: string;
    updatedAt: string;
    currentUser: UserResponse;
};
