package com.savvy.userservice.model

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name="user_contacts")
data class UserContact (
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        val id: Long? = null,

        @ManyToOne
        @JoinColumn(name = "user_id")
        val user: User,

        @ManyToOne
        @JoinColumn(name = "contact_id")
        val contact: User,

        val addedAd: LocalDateTime = LocalDateTime.now()
)