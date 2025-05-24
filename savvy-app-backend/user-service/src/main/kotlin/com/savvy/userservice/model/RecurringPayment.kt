package com.savvy.userservice.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "recurring_payments")
data class RecurringPayment (
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long? = null,

        @OneToOne
        @JoinColumn(name = "payment_request_id", nullable = false)
        val paymentRequest: PaymentRequest,

        @Column(nullable = false)
        val nextDueDate: LocalDateTime,

        @Column(nullable = false)
        @Enumerated(EnumType.STRING)
        val recurrenceInterval: IntervalType?,

        @Column(nullable = false)
        val createdAt: LocalDateTime = LocalDateTime.now(),

        @Column(nullable = false)
        val updatedAt: LocalDateTime = LocalDateTime.now()
)

enum class IntervalType {
    DAILY, WEEKLY, MONTHLY, YEARLY
}