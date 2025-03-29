package com.savvy.budgetingservice.dto

import com.savvy.budgetingservice.model.Budget
import com.savvy.budgetingservice.model.BudgetPeriod
import java.math.BigDecimal
import java.time.LocalDateTime

data class BudgetResponse(
        val id: Long?,
        val userId: Long,
        val categoryId: Long?,
        val amountLimit: BigDecimal,
        val period: BudgetPeriod,
        val alertThreshold: BigDecimal,
        val createdAt: LocalDateTime,
        val updatedAt: LocalDateTime,
        val currentAmount: BigDecimal
) {
    companion object {
        fun from(budget: Budget): BudgetResponse {
            return BudgetResponse(
                    id = budget.id,
                    userId = budget.userId,
                    categoryId = budget.categoryId,
                    amountLimit = budget.amountLimit,
                    period = budget.period,
                    alertThreshold = budget.alertThreshold,
                    createdAt = budget.createdAt,
                    updatedAt = budget.updatedAt,
                    currentAmount = budget.currentAmount
            )
        }
    }
}