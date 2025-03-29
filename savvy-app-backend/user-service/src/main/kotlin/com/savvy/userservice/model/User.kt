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
        var currentBalance: BigDecimal
)
