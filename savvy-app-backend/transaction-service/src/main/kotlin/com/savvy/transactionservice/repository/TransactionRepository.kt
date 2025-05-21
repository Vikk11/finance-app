package com.savvy.transactionservice.repository

import com.savvy.transactionservice.model.Transaction
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Page
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.math.BigDecimal
import java.time.LocalDateTime


interface TransactionRepository : JpaRepository<Transaction, Long>{

    @Query("SELECT t FROM Transaction t WHERE t.userId = :userId ORDER BY t.date DESC")
    fun findRecentByUserId(userId: Long, pageable: Pageable): List<Transaction>

    @Query(
            "SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.userId = :userId " +
            "AND t.categoryId = :categoryId " +
            "AND t.type = 'expense' " +
            "AND t.createdAt BETWEEN :startDate AND :endDate"
    )
    fun sumTransactions(
            @Param("userId") userId: Long,
            @Param("categoryId") categoryId: Long,
            @Param("startDate") startDate: LocalDateTime,
            @Param("endDate") endDate: LocalDateTime
    ): BigDecimal

    fun findAllByUserId(userId: Long): List<Transaction>

    @Query("SELECT DISTINCT t.userId FROM Transaction t")
    fun findAllUserIdsWithTransactions(): List<Long>

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.userId = :userId")
    fun sumByUserId(@Param("userId") userId: Long): BigDecimal

    fun findAllByUserId(userId: Long, pageable: Pageable): Page<Transaction>
}