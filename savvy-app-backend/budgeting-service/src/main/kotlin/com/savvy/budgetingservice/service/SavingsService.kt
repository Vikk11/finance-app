package com.savvy.budgetingservice.service

import com.savvy.budgetingservice.dto.SavingsGoalRequest
import com.savvy.budgetingservice.model.SavingsGoal
import com.savvy.budgetingservice.repository.SavingsRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.LocalDateTime

@Service
class SavingsService (
        private val savingsRepository: SavingsRepository
) {

    @Transactional
    fun addSavingsGoal(userId: Long, request: SavingsGoalRequest): SavingsGoal {
        val savingsGoal = SavingsGoal(
                userId = userId,
                goalName = request.goalName,
                targetAmount = request.targetAmount,
                currentAmount = BigDecimal.ZERO,
                deadline = request.deadline,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
        )

        return savingsRepository.save(savingsGoal)
    }
}