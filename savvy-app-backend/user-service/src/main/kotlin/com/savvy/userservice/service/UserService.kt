package com.savvy.userservice.service

import com.savvy.commonmodels.PaymentEvent
import com.savvy.userservice.dto.UserRequest
import com.savvy.userservice.dto.UserResponse
import com.savvy.userservice.kafka.PaymentEventProducer
import com.savvy.userservice.model.User
import com.savvy.userservice.model.UserContact
import com.savvy.userservice.repository.UserContactRepository
import com.savvy.userservice.repository.UserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.lang.IllegalArgumentException
import java.math.BigDecimal

@Service
class UserService(
        private val userRepository: UserRepository,
        private val paymentEventProducer: PaymentEventProducer,
        private val userContactRepository: UserContactRepository
) {

    @Transactional
    fun addUser(request: UserRequest): User {
        userRepository.findByUserUid(request.userUid)?.let {
            throw IllegalArgumentException("User already exists")
        }
        val user = User (
                userUid = request.userUid,
                currentBalance = request.currentBalance
        )

        return userRepository.save(user)
    }

    fun updateBalance(userId: Long, amount: BigDecimal, type: String) {
        val user = userRepository.findById(userId)
                .orElseThrow { RuntimeException("User not found") }

        when (type.lowercase()){
            "income" -> user.currentBalance += amount
            "expense" -> user.currentBalance -= amount
            else -> throw IllegalArgumentException("Invalid transaction type")
        }
        userRepository.save(user)
    }

    fun getUserIdByFirebaseUid(userUid: String): Long? {
        return userRepository.findByUserUid(userUid)?.id
    }

    fun getUserById(userId: Long?): User? {
        return userId?.let { userRepository.findById(it).orElse(null)}
    }

    fun sendMoneyToUser(senderId: String, receiverId: String, amount: BigDecimal) {
        val senderIdL = getUserIdByFirebaseUid(senderId)
        val receiverIdL = getUserIdByFirebaseUid(receiverId)

        val paymentEvent = PaymentEvent(
                requesterId = senderIdL!!,
                payerId = receiverIdL!!,
                groupId = null,
                amount = amount,
                description = null,
                isRecurring = false
        )

        paymentEventProducer.publishPayment(paymentEvent)

        if(!userContactRepository.existsByUserIdAndContactId(senderIdL, receiverIdL)){
            addUserToContacts(senderIdL, receiverIdL)
        }

        if(!userContactRepository.existsByUserIdAndContactId(receiverIdL, senderIdL)){
            addUserToContacts(receiverIdL, senderIdL)
        }
    }

    fun addUserToContacts(userId: Long, contactId: Long) {
        val user = userRepository.findById(userId)
                .orElseThrow { IllegalArgumentException("User with ID $userId not found")}

        val contact = userRepository.findById(contactId)
                .orElseThrow { IllegalArgumentException("User with ID $contactId not found")}

        val userContact = UserContact(user = user, contact = contact)
        userContactRepository.save(userContact)
    }

    fun getUserContacts(userUid: String): List<UserResponse>{
        val userId = getUserIdByFirebaseUid(userUid) ?: return emptyList()

        return userContactRepository.findAllByUserId(userId)
                .mapNotNull { it.contact.id }
                .mapNotNull { contactId -> getUserById(contactId) }
                .map { user -> UserResponse.from(user) }
    }

    fun getUserGroups(){}
    
    fun updateUserBalance(userId: Long, newBalance: BigDecimal){
        val user = userRepository.findByIdOrNull(userId) ?: return
        user.currentBalance = newBalance
        userRepository.save(user)
    }
}