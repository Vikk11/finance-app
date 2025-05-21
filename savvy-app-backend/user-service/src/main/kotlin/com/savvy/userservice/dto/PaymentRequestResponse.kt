package com.savvy.userservice.dto

import com.savvy.userservice.model.Group
import com.savvy.userservice.model.PaymentRequest
import com.savvy.userservice.model.RequestStatus
import com.savvy.userservice.model.User
import java.math.BigDecimal
import java.time.LocalDateTime

data class PaymentRequestResponse (
        val id: Long?,
        val requesterId: UserResponse,
        val groupId: GroupResponse?,
        val payerId: UserResponse,
        val amount: BigDecimal,
        val description: String?,
        val isRecurring: Boolean,
        val status: RequestStatus,
        val createdAt: LocalDateTime,
        val updatedAt: LocalDateTime,
        val currentUser: UserResponse
){
    companion object {
        fun from(paymentRequest: PaymentRequest, currentUser: User): PaymentRequestResponse {
            return PaymentRequestResponse(
                    id = paymentRequest.id,
                    requesterId = UserResponse(
                            id = paymentRequest.requesterId.id,
                            userUid = paymentRequest.requesterId.userUid
                    ),
                    groupId = paymentRequest.groupId?.let {
                        GroupResponse(
                                id = it.id!!,
                                groupName = it.groupName,
                                members = it.members,
                                createdBy = UserResponse(
                                        id = it.createdBy.id!!,
                                        userUid = it.createdBy.userUid
                                ),
                                createdAt = it.createdAt,
                                updatedAt = it.updatedAt
                        )
                    },
                    payerId = UserResponse(
                                id = paymentRequest.payerId.id,
                                userUid = paymentRequest.payerId.userUid
                    ),
                    amount = paymentRequest.amount,
                    description = paymentRequest.description,
                    isRecurring = paymentRequest.isRecurring,
                    status = paymentRequest.status,
                    createdAt = paymentRequest.createdAt,
                    updatedAt = paymentRequest.updatedAt,
                    currentUser = UserResponse(
                            id = currentUser.id!!,
                            userUid = currentUser.userUid
                    )
            )
        }
    }
}