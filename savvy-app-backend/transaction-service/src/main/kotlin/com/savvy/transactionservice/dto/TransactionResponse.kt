package com.savvy.transactionservice.dto

import com.fasterxml.jackson.annotation.JsonFormat
import com.savvy.transactionservice.model.Transaction
import com.savvy.transactionservice.model.TransactionType
import java.math.BigDecimal
import java.time.LocalDateTime

data class TransactionResponse(
        val id: Int?,
        val userId: Int,
        val amount: BigDecimal,
        val type: TransactionType,
        val categoryId: Long?,
        val relatedUserId: Long?,
        val name: String?,

        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        val date: LocalDateTime,

        val createdAt: LocalDateTime,
        val updatedAt: LocalDateTime
) {
    companion object {
        fun from(transaction: Transaction): TransactionResponse {
            return TransactionResponse(
                    id = transaction.id,
                    userId = transaction.userId,
                    amount = transaction.amount,
                    type = transaction.type,
                    categoryId = transaction.categoryId,
                    relatedUserId = transaction.relatedUserId,
                    name = transaction.name,
                    date = transaction.date,
                    createdAt = transaction.createdAt,
                    updatedAt = transaction.updatedAt
            )
        }
    }
}

