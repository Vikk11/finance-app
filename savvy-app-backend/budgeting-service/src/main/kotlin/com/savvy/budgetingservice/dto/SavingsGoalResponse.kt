package com.savvy.budgetingservice.dto

import com.savvy.budgetingservice.model.SavingsGoal
import java.math.BigDecimal
import java.time.LocalDateTime

data class SavingsGoalResponse (
        val id: Long?,
        val userId: Long,
        val goalName: String,
        val targetAmount: BigDecimal,
        val currentAmount: BigDecimal,
        val deadline: LocalDateTime,
        val createdAt: LocalDateTime,
        val updatedAt: LocalDateTime
) {
    companion object {
        fun from(savingsGoal: SavingsGoal): SavingsGoalResponse {
            return SavingsGoalResponse(
                    id = savingsGoal.id,
                    userId = savingsGoal.userId,
                    goalName = savingsGoal.goalName,
                    targetAmount = savingsGoal.targetAmount,
                    currentAmount = savingsGoal.currentAmount,
                    deadline = savingsGoal.deadline,
                    createdAt = savingsGoal.createdAt,
                    updatedAt = savingsGoal.updatedAt
            )
        }
    }
}