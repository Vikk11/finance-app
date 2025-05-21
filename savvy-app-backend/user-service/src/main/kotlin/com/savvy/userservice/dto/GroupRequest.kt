package com.savvy.userservice.dto

import com.savvy.userservice.model.User

data class GroupRequest (
        val groupName: String,
        val createdById: Long,
        val memberUserIds: List<Long>
)