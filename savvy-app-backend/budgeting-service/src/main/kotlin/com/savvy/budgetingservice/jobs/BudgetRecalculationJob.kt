package com.savvy.budgetingservice.jobs

import com.savvy.budgetingservice.service.BudgetsService
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class BudgetRecalculationJob(private val budgetsService: BudgetsService) {

    @Scheduled(cron = "0 0 1 * * *")
    fun recalculateBudgets() {
        budgetsService.recalculateAllBudgets()
    }
}