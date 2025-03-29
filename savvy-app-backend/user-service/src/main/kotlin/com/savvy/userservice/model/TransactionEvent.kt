package com.savvy.userservice.model

import java.math.BigDecimal

data class TransactionEvent(
        val userId: Long,
        val type: String,
        val amount: BigDecimal,
        val categoryId: Long?
)