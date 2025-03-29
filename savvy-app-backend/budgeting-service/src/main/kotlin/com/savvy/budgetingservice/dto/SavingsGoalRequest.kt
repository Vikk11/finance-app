package com.savvy.budgetingservice.dto

import java.math.BigDecimal
import java.time.LocalDateTime

data class SavingsGoalRequest (
        val goalName: String,
        val targetAmount: BigDecimal,
        val deadline: LocalDateTime
)