package com.savvy.userservice.dto

import com.savvy.userservice.model.Group
import java.time.LocalDateTime

data class GroupResponse (
        val id: Long?,
        val groupName: String,
        val members: Int,
        val createdBy: UserResponse,
        val createdAt: LocalDateTime,
        val updatedAt: LocalDateTime
){
    companion object {
        fun from(group: Group): GroupResponse {
            return GroupResponse(
                    id = group.id,
                    groupName = group.groupName,
                    members = group.members,
                    createdBy = UserResponse(
                            id = group.createdBy.id!!,
                            userUid = group.createdBy.userUid
                    ),
                    createdAt = group.createdAt,
                    updatedAt = group.updatedAt
            )
        }
    }
}