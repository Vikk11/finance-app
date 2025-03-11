package com.savvy.userservice.service

import com.savvy.userservice.model.User
import com.savvy.userservice.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.lang.IllegalArgumentException
import java.math.BigDecimal

@Service
class UserService(private val userRepository: UserRepository) {

    fun updateBalance(userId: Int, amount: BigDecimal, type: String) {
        val user = userRepository.findById(userId)
                .orElseThrow { RuntimeException("User not found") }

        when (type.uppercase()){
            "INCOME" -> user.currentBalance += amount
            "EXPENSE" -> user.currentBalance -= amount
            else -> throw IllegalArgumentException("Invalid transaction type")
        }
        userRepository.save(user)
    }

    fun getUserIdByFirebaseUid(userUid: String): Int? {
        return userRepository.findByUserUid(userUid)?.id
    }
}