package com.savvy.transactionservice.model

import jakarta.persistence.*

@Entity
@Table(name = "categories")
data class Category(
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "id")
        val id: Int,
        val name: String,
)