package com.savvy.userservice.repository

import com.savvy.userservice.model.UserContact
import org.springframework.data.jpa.repository.JpaRepository

interface UserContactRepository : JpaRepository<UserContact, Long> {
    fun existsByUserIdAndContactId(userId: Long, contactId: Long): Boolean
    fun findAllByUserId(userId: Long): List<UserContact>
}