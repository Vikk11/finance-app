package com.savvy.budgetingservice.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "budgets")
data class Budget(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        val id: Long? = null,

        @Column(nullable = false)
        val userId: Long,

        val categoryId: Long? = null,

        @Column(nullable = false)
        val amountLimit: BigDecimal,

        @Enumerated(EnumType.STRING)
        val period: BudgetPeriod,

        val alertThreshold: BigDecimal,

        @Column(nullable = false)
        val createdAt: LocalDateTime = LocalDateTime.now(),

        @Column(nullable = false)
        val updatedAt: LocalDateTime = LocalDateTime.now(),

        @Column(nullable = false)
        var currentAmount: BigDecimal
)

enum class BudgetPeriod {
    WEEKLY, MONTHLY, YEARLY
}