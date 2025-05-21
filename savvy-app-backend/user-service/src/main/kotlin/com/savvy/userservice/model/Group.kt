package com.savvy.userservice.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "groups")
data class Group (
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        val id: Long? = null,

        val groupName: String,
        var members: Int,

        @ManyToOne
        @JoinColumn(name = "created_by")
        val createdBy: User,

        @Column(nullable = false)
        val createdAt: LocalDateTime = LocalDateTime.now(),

        @Column(nullable = false)
        val updatedAt: LocalDateTime = LocalDateTime.now(),

        @OneToMany(mappedBy = "groupId", cascade = [CascadeType.ALL], orphanRemoval = true)
        val users: MutableList<UserGroup> = mutableListOf(),

        @OneToMany(mappedBy = "groupId", cascade = [CascadeType.ALL], orphanRemoval = true)
        val paymentRequests: MutableList<PaymentRequest> = mutableListOf()
)