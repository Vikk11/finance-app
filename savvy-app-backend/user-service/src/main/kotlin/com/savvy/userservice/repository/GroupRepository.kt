package com.savvy.userservice.repository

import com.savvy.userservice.model.Group
import org.springframework.data.jpa.repository.JpaRepository

interface GroupRepository : JpaRepository<Group, Long> {
}