package com.savvy.userservice.model

import jakarta.persistence.*
import java.math.BigDecimal

@Entity
@Table(name= "users")
data class User(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        val id: Long? = null,

        @Column(unique = true, nullable = false)
        val userUid: String,

        @Column(nullable = false)
        var currentBalance: BigDecimal,

        @OneToMany(mappedBy = "userId", cascade = [CascadeType.ALL], orphanRemoval = true)
        val contacts: MutableList<UserContact> = mutableListOf(),

        @OneToMany(mappedBy = "userId", cascade = [CascadeType.ALL], orphanRemoval = true)
        val groups: MutableList<UserGroup> = mutableListOf(),

        @OneToMany(mappedBy = "requesterId", cascade = [CascadeType.ALL], orphanRemoval = true)
        val createdRequests: MutableList<PaymentRequest> = mutableListOf(),

        @OneToMany(mappedBy = "payerId", cascade = [CascadeType.ALL], orphanRemoval = true)
        val receivedRequests: MutableList<PaymentRequest> = mutableListOf()
)
