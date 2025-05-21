package com.savvy.budgetingservice.service

import com.savvy.budgetingservice.dto.BudgetRequest
import com.savvy.budgetingservice.model.Budget
import com.savvy.budgetingservice.model.BudgetPeriod
import com.savvy.budgetingservice.repository.BudgetsRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal
import java.time.LocalDateTime

@Service
class BudgetsService(
        private val budgetsRepository: BudgetsRepository,
        private val userServiceClient: UserServiceClient,
        private val transactionServiceClient: TransactionServiceClient
) {

    @Transactional
    fun addBudget(firebaseUid: String, request: BudgetRequest): Budget {
        val userId = getUserId(firebaseUid)
        val budget = Budget(
                userId = userId,
                categoryId = request.categoryId,
                amountLimit = request.amountLimit,
                period = request.period,
                alertThreshold = setAlertThreshold(request.amountLimit),
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
                currentAmount = calculateCurrentAmount(userId, request.period, request.categoryId, LocalDateTime.now())
        )

        return budgetsRepository.save(budget)
    }

    private fun getUserId(firebaseUid: String): Long {
        return userServiceClient.getUserIdFromFirebaseUid(firebaseUid)
                ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "User with UID $firebaseUid not found")
    }

    fun setAlertThreshold(amount: BigDecimal): BigDecimal {
        return amount
    }

    fun getBudgetsByPeriod(firebaseUid: String, period: BudgetPeriod): List<Budget>{
        return budgetsRepository.findBudgetsByUserIdAndPeriod(getUserId(firebaseUid), period)
    }

    fun calculateCurrentAmount(userId: Long, period: BudgetPeriod, categoryId: Long?, createdAt: LocalDateTime): BigDecimal {
        return transactionServiceClient.getTransactionSummary(userId, categoryId, period.toString(), createdAt)
    }

    fun updateBudget(userId: Long, categoryId: Long?, amount: BigDecimal){
        val budget = budgetsRepository.findByUserIdAndCategoryId(userId, categoryId)

        if (budget != null) {
            budget.currentAmount += amount
        }

        budgetsRepository.save(budget)
    }

    fun recalculateAllBudgets() {
        val budgets = budgetsRepository.findAll()

        for (budget in budgets) {
            val totalSpent = transactionServiceClient.getTransactionSummary(budget.userId, budget.categoryId, budget.period.toString(), LocalDateTime.now())
            budget.currentAmount = totalSpent
            budgetsRepository.save(budget)
        }
    }
}