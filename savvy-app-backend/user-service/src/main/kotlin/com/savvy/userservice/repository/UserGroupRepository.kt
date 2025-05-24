package com.savvy.userservice.repository

import com.savvy.userservice.model.Group
import com.savvy.userservice.model.User
import com.savvy.userservice.model.UserGroup
import org.springframework.data.jpa.repository.JpaRepository

interface UserGroupRepository : JpaRepository<UserGroup, Long>{
    fun findByGroupAndUser(group: Group, user: User): UserGroup?
    fun findAllByGroupId(groupId: Long): List<UserGroup>
}