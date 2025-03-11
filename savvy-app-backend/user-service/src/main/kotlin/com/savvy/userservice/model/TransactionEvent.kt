package com.savvy.userservice.model

import java.math.BigDecimal

data class TransactionEvent(
        val userId: Int,
        val amount: BigDecimal,
        val type: String
)