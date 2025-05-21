package com.savvy.userservice.model

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDateTime

@Entity
@Table(name = "payment_requests")
data class PaymentRequest (
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        val id: Long? = null,

        @ManyToOne
        @JoinColumn(name = "requester_id")
        val requesterId: User,

        @ManyToOne
        @JoinColumn(name = "group_id")
        val groupId: Group?,

        @ManyToOne
        @JoinColumn(name = "payer_id")
        val payerId: User,

        @Column(nullable = false)
        val amount: BigDecimal,

        val description: String?,
        val isRecurring: Boolean,
        val status: RequestStatus,

        @Column(nullable = false)
        val createdAt: LocalDateTime = LocalDateTime.now(),

        @Column(nullable = false)
        val updatedAt: LocalDateTime = LocalDateTime.now()
)

enum class RequestStatus {
    PENDING, PAID, DECLINED
}