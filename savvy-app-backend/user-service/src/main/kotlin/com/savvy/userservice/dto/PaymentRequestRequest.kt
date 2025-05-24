package com.savvy.userservice.dto

import com.savvy.userservice.model.Group
import com.savvy.userservice.model.RequestStatus
import com.savvy.userservice.model.User
import java.math.BigDecimal

data class PaymentRequestRequest (
        val groupId: Long?,
        val payerId: String,
        val amount: BigDecimal,
        val description: String?,
        val isRecurring: Boolean,
        val status: RequestStatus
)