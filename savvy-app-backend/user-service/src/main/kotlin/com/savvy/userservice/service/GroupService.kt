package com.savvy.userservice.service

import com.savvy.userservice.dto.GroupRequest
import com.savvy.userservice.dto.UserResponse
import com.savvy.userservice.model.Group
import com.savvy.userservice.model.User
import com.savvy.userservice.model.UserGroup
import com.savvy.userservice.repository.GroupRepository
import com.savvy.userservice.repository.UserGroupRepository
import com.savvy.userservice.repository.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.lang.IllegalArgumentException

@Service
class GroupService(
        private val groupRepository: GroupRepository,
        private val userGroupRepository: UserGroupRepository,
        private val userRepository: UserRepository
){

    @Transactional
    fun createGroup(request: GroupRequest): Group {
        val createdBy = userRepository.findById(request.createdById)
                .orElseThrow { IllegalArgumentException("User with ID ${request.createdById} not found") }

        val memberIds = if (request.memberUserIds.contains(request.createdById)) {
            request.memberUserIds
        } else {
            request.memberUserIds + request.createdById
        }

        val members = userRepository.findAllById(memberIds)

        val group = Group(
                groupName = request.groupName,
                members = members.size,
                createdBy = createdBy
        )

        val savedGroup = groupRepository.save(group)

        val userGroups = members.map { member ->
            UserGroup(
                    group = savedGroup,
                    user = member
            )
        }

        userGroupRepository.saveAll(userGroups)

        return savedGroup
    }

    @Transactional
    fun removePersonFromGroup(groupId: Long, userId: Long) {
        val group = groupRepository.findById(groupId)
                .orElseThrow{IllegalArgumentException("Group not found")}

        val user = userRepository.findById(userId)
                .orElseThrow { IllegalArgumentException("User not found") }

        val userGroup = userGroupRepository.findByGroupAndUser(group, user)
                ?: throw IllegalArgumentException("User is not a member of the group")

        userGroupRepository.delete(userGroup)

        group.members -= 1
        groupRepository.save(group)
    }

    @Transactional
    fun leaveGroup(groupId: Long, userId: Long){
        val group = groupRepository.findById(groupId)
                .orElseThrow { IllegalArgumentException("Group not found") }

        val user = userRepository.findById(userId)
                .orElseThrow { IllegalArgumentException("User not found") }

        if (group.createdBy.id == userId) {
            throw IllegalStateException("Group owner cannot leave the group. Consider deleting the group or transferring ownership.")
        }

        val userGroup = userGroupRepository.findByGroupAndUser(group, user)
                ?: throw IllegalArgumentException("User is not a member of the group")

        userGroupRepository.delete(userGroup)

        group.members -= 1
        groupRepository.save(group)
    }

    @Transactional(readOnly = true)
    fun getGroupMembers(groupId: Long): List<UserResponse>{
        val group = groupRepository.findById(groupId)
                .orElseThrow { IllegalArgumentException("Group not found") }

        val userGroups = userGroupRepository.findAllByGroupId(groupId)

        return userGroups.map { userGroup ->
            val user = userGroup.user
            UserResponse(
                    id = user.id!!,
                    userUid = user.userUid
            )
        }
    }

    fun getGroupExpenses(){}
    fun getGroupRequestStatus(){}
}