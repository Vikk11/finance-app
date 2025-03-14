package com.savvy.transactionservice.controller

import com.savvy.transactionservice.dto.CategoryDTO
import com.savvy.transactionservice.dto.TransactionRequest
import com.savvy.transactionservice.dto.TransactionResponse
import com.savvy.transactionservice.model.Transaction
import com.savvy.transactionservice.service.CategoryService
import com.savvy.transactionservice.service.TransactionService
import com.savvy.transactionservice.service.UserServiceClient
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/transactions")
class TransactionController(
        private val transactionService: TransactionService,
        private val userServiceClient: UserServiceClient,
        private val categoryService: CategoryService
){

    @PostMapping("/add")
    fun addTransaction(@RequestBody request: TransactionRequest): ResponseEntity<TransactionResponse>{
        val authentication = SecurityContextHolder.getContext().authentication
        println("Security context authentication: $authentication")

        val firebaseUid = authentication?.principal as? String
                ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        println("Firebase UID from authentication: $firebaseUid")

        val userId = userServiceClient.getUserIdFromFirebaseUid(firebaseUid)
                ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).build()

        val transaction = transactionService.addTransaction(userId, request)
        return ResponseEntity.ok(TransactionResponse.from(transaction))
    }

    @GetMapping("/categories")
    fun getCategories(): ResponseEntity<List<CategoryDTO>>{
        val categories = categoryService.getAllCategories()
        return ResponseEntity.ok(categories)
    }

    @GetMapping("/recentTransactions")
    fun getRecentTransactions(): List<Transaction> {
        val authentication = SecurityContextHolder.getContext().authentication
        val firebaseUid = authentication.principal as String
        val userId = userServiceClient.getUserIdFromFirebaseUid(firebaseUid)
                ?: return emptyList()

        return transactionService.getRecentTransactionsByUser(userId, 2)
    }
}