package com.savvy.budgetingservice.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name="savings_goals")
data class SavingsGoal (
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        val id: Long? = null,

        @Column(nullable = false)
        val userId: Long,

        @Column(nullable = false)
        val goalName: String,

        @Column(nullable = false)
        val targetAmount: BigDecimal,

        @Column(nullable = false)
        val currentAmount: BigDecimal,

        @Column(nullable = false)
        val deadline: LocalDateTime,

        @Column(nullable = false)
        val createdAt: LocalDateTime = LocalDateTime.now(),

        @Column(nullable = false)
        val updatedAt: LocalDateTime = LocalDateTime.now()
)