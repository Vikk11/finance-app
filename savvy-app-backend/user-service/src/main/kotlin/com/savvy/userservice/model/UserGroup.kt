package com.savvy.userservice.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "user_groups")
data class UserGroup (
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        val id: Long? = null,

        @ManyToOne
        @JoinColumn(name = "group_id")
        val groupId: Group,

        @ManyToOne
        @JoinColumn(name = "user_id")
        val userId: User,

        @Column(nullable = false)
        val joinedAt: LocalDateTime = LocalDateTime.now()
)