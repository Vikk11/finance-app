package com.savvy.budgetingservice.repository

import com.savvy.budgetingservice.model.Budget
import com.savvy.budgetingservice.model.BudgetPeriod
import org.springframework.data.jpa.repository.JpaRepository

interface BudgetsRepository : JpaRepository<Budget, Long>{


    fun findBudgetsByUserIdAndPeriod(userId: Long, period: BudgetPeriod): List<Budget>
    fun findByUserIdAndCategoryId(userId: Long, categoryId: Long?): Budget
}
