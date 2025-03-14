package com.savvy.userservice.repository

import com.savvy.userservice.model.User
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface UserRepository : JpaRepository<User, Int> {
    fun findByUserUid(userUid: String): User?
    fun findById(userId: Int?): Optional<User>
}