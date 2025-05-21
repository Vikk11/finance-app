package com.savvy.userservice.dto

import com.savvy.userservice.model.User
import java.math.BigDecimal

data class UserResponse(
        val id: Long?,
        val userUid: String
) {
    companion object {
        fun from(user: User): UserResponse {
            return UserResponse(
                    id = user.id,
                    userUid = user.userUid
            )
        }
    }
}