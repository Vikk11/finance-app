package com.savvy.transactionservice.repository

import com.savvy.transactionservice.model.Transaction
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query


interface TransactionRepository : JpaRepository<Transaction, Int>{

    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId ORDER BY t.date DESC")
    fun findRecentByUserId(userId: Int, pageable: Pageable): List<Transaction>
}