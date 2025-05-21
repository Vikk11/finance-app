package com.savvy.userservice.repository

import com.savvy.userservice.model.PaymentRequest
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface PaymentRequestRepository : JpaRepository<PaymentRequest, Long> {
    @Query("""
        SELECT p FROM PaymentRequest p
        WHERE p.requesterId.id = :userId OR p.payerId.id = :userId
    """)
    fun findAllByUserInvolved(userId: Long): List<PaymentRequest>
}