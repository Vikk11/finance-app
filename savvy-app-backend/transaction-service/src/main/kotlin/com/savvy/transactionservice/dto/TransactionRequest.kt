package com.savvy.transactionservice.dto

import com.savvy.transactionservice.model.TransactionType
import java.math.BigDecimal
import java.time.LocalDateTime

data class TransactionRequest(
        val amount: BigDecimal,
        val type: TransactionType,
        val categoryId: Long,
        val relatedUserId: Long? = null,
        val name: String? = null,
        val date: LocalDateTime? = LocalDateTime.now()
        )