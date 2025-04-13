package com.savvy.transactionservice.controller

import com.savvy.transactionservice.dto.CategoryDTO
import com.savvy.transactionservice.dto.TransactionRequest
import com.savvy.transactionservice.dto.TransactionResponse
import com.savvy.transactionservice.service.CategoryService
import com.savvy.transactionservice.service.TransactionService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal
import java.time.LocalDateTime

@RestController
@RequestMapping("/api/transactions")
class TransactionController(
        private val transactionService: TransactionService,
        private val categoryService: CategoryService
){

    @PostMapping("/add")
    fun addTransaction(@RequestBody request: TransactionRequest): ResponseEntity<TransactionResponse>{
        val authentication = SecurityContextHolder.getContext().authentication
        println("Security context authentication: $authentication")

        val firebaseUid = authentication?.principal as? String
                ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        println("Firebase UID from authentication: $firebaseUid")

        val transaction = transactionService.addTransaction(firebaseUid, request)
        return ResponseEntity.ok(TransactionResponse.from(transaction))
    }

    @GetMapping("/categories")
    fun getCategories(): ResponseEntity<List<CategoryDTO>>{
        val categories = categoryService.getAllCategories()
        return ResponseEntity.ok(categories)
    }

    @GetMapping("/recentTransactions")
    fun getRecentTransactions(): List<TransactionResponse> {
        val authentication = SecurityContextHolder.getContext().authentication
        val firebaseUid = authentication.principal as String

        return transactionService.getRecentTransactionsByUser(firebaseUid, 2)
                .map(TransactionResponse::from)
    }

    @GetMapping("/list")
    fun getAllTransactions(): List<TransactionResponse> {
        val authentication = SecurityContextHolder.getContext().authentication
        val firebaseUid = authentication.principal as String

        return transactionService.getAllTransactions(firebaseUid)
                .map(TransactionResponse::from)
    }

    @GetMapping("/summary")
    fun getTransactionSummary(
            @RequestParam userId: Long,
            @RequestParam categoryId: Long,
            @RequestParam period: String,
            @RequestParam createdAt: LocalDateTime
    ): ResponseEntity<BigDecimal> {
        val totalSpent = transactionService.transactionsSum(userId, categoryId, period, createdAt)

        return ResponseEntity.ok(totalSpent)
    }
}