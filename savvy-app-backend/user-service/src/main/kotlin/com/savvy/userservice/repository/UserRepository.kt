package com.savvy.userservice.repository

import com.savvy.userservice.model.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository : JpaRepository<User, Int> {
    fun findByUserUid(userUid: String): User?
}