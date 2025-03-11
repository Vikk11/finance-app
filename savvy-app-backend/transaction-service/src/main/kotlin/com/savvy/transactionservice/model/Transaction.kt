package com.savvy.transactionservice.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "transactions")
data class Transaction(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        val id: Int? = null,

        val userId: Int,

        @Enumerated(EnumType.STRING)
        val type: TransactionType,

        @Column(nullable = false)
        val amount: BigDecimal,

        val categoryId: Long? = null,
        val relatedUserId: Long? = null,
        val name: String? = null,

        @Column(nullable = false)
        val date: LocalDateTime = LocalDateTime.now(),

        @Column(nullable = false)
        val createdAt: LocalDateTime = LocalDateTime.now(),

        @Column(nullable = false)
        val updatedAt: LocalDateTime = LocalDateTime.now()
)

enum class TransactionType {
        INCOME, EXPENSE
}

