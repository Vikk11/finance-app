package com.savvy.budgetingservice.dto

import com.savvy.budgetingservice.model.BudgetPeriod
import java.math.BigDecimal

data class BudgetRequest(
        val categoryId: Long? = null,
        val amountLimit: BigDecimal,
        val period: BudgetPeriod
)