package com.savvy.userservice.repository

import com.savvy.userservice.model.User
import com.savvy.userservice.model.UserContact
import org.springframework.data.jpa.repository.JpaRepository

interface UserContactRepository : JpaRepository<UserContact, Long> {
    fun existsByUserAndContact(user: User, contact: User): Boolean
    fun findAllByUser(user: User): List<UserContact>
}