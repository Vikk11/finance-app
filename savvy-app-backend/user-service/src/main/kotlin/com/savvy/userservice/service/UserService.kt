package com.savvy.userservice.service

import com.savvy.userservice.model.User
import com.savvy.userservice.repository.UserRepository
import org.springframework.stereotype.Service
import java.lang.IllegalArgumentException
import java.math.BigDecimal

@Service
class UserService(private val userRepository: UserRepository) {

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
}