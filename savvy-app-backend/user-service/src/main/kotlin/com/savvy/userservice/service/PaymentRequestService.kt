package com.savvy.userservice.service

import com.savvy.commonmodels.PaymentEvent
import com.savvy.userservice.dto.GroupResponse
import com.savvy.userservice.dto.PaymentRequestRequest
import com.savvy.userservice.dto.PaymentRequestResponse
import com.savvy.userservice.dto.UserResponse
import com.savvy.userservice.kafka.PaymentEventProducer
import com.savvy.userservice.model.IntervalType
import com.savvy.userservice.model.PaymentRequest
import com.savvy.userservice.model.RequestStatus
import com.savvy.userservice.repository.GroupRepository
import com.savvy.userservice.repository.PaymentRequestRepository
import com.savvy.userservice.repository.RecurringPaymentRepository
import com.savvy.userservice.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class PaymentRequestService(
        private val paymentRequestRepository: PaymentRequestRepository,
        private val userRepository: UserRepository,
        private val groupRepository: GroupRepository,
        private val recurringPaymentRepository: RecurringPaymentRepository,
        private val paymentEventProducer: PaymentEventProducer,
        private val userService: UserService
) {
    @Transactional
    fun createPaymentRequest(request: PaymentRequestRequest, firebaseUid: String): PaymentRequestResponse {
        val requester = userRepository.findById(request.requesterId)
                .orElseThrow { IllegalArgumentException("Requester not found") }

        val payer = userRepository.findById(request.payerId)
                .orElseThrow { IllegalArgumentException("Payer not found") }

        val group = request.groupId?.let {
            groupRepository.findById(it).orElseThrow { IllegalArgumentException("Group not found") }
        }

        val paymentRequest = PaymentRequest(
                requesterId = requester,
                groupId = group,
                payerId = payer,
                amount = request.amount,
                description = request.description,
                isRecurring = request.isRecurring,
                status = RequestStatus.PENDING,
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now(),
        )

        val savedRequest = paymentRequestRepository.save(paymentRequest)

        val currentUserId = userService.getUserIdByFirebaseUid(firebaseUid)
        val currentUser = userService.getUserById(currentUserId)
                ?: throw IllegalArgumentException("Current user not found")

        return PaymentRequestResponse(
                id = savedRequest.id,
                requesterId = UserResponse.from(requester),
                groupId = group?.let { GroupResponse.from(it) },
                payerId = UserResponse.from(payer),
                amount = savedRequest.amount,
                description = savedRequest.description,
                isRecurring = savedRequest.isRecurring,
                status = savedRequest.status,
                createdAt = savedRequest.createdAt,
                updatedAt = savedRequest.updatedAt,
                currentUser = UserResponse.from(currentUser)
        )
    }

    @Transactional
    fun updatePaymentStatus(requestId: Long, newStatus: RequestStatus){
        val paymentRequest = paymentRequestRepository.findById(requestId)
                .orElseThrow { IllegalArgumentException("Payment request not found") }

        if (paymentRequest.status == RequestStatus.PAID || paymentRequest.status == RequestStatus.DECLINED) {
            throw IllegalStateException("Cannot update status of a completed request")
        }

        val updatedRequest = paymentRequest.copy(
                status = newStatus,
                updatedAt = LocalDateTime.now()
        )

        paymentRequestRepository.save(updatedRequest)

        if (newStatus == RequestStatus.PAID) {
            val paymentEvent = PaymentEvent(
                    requesterId = updatedRequest.requesterId.id!!,
                    payerId = updatedRequest.payerId.id,
                    groupId = updatedRequest.groupId?.id,
                    amount = updatedRequest.amount,
                    description = updatedRequest.description,
                    isRecurring = updatedRequest.isRecurring
            )
            paymentEventProducer.publishPayment(paymentEvent)
        }
    }

    fun scheduleRecurringPayment(event: PaymentEvent, interval: IntervalType){
    }

    fun calculateNextDueDate(date: LocalDateTime): LocalDateTime {
        return LocalDateTime.now()
    }

    fun getAllRequestsForUser(userUid: String): List<PaymentRequestResponse> {
        val userId = userService.getUserIdByFirebaseUid(userUid)
                ?: throw IllegalArgumentException("User id not found")

        val user = userService.getUserById(userId)
                ?: throw IllegalArgumentException("User not found")

        val requests = paymentRequestRepository.findAllByUserInvolved(userId)

        return requests.map { request ->
            PaymentRequestResponse(
                    id = request.id,
                    requesterId = UserResponse.from(request.requesterId),
                    payerId = UserResponse.from(request.payerId),
                    groupId = request.groupId?.let { GroupResponse.from(it) },
                    amount = request.amount,
                    description = request.description,
                    isRecurring = request.isRecurring,
                    status = request.status,
                    createdAt = request.createdAt,
                    updatedAt = request.updatedAt,
                    currentUser = UserResponse.from(user)
            )
        }
    }

    fun executeDuePayments(){}

    fun getGroupPaymentStatus(){}
    fun getUserPaymentHistory(){}
    fun getGroupPaymentHistory(){}
}