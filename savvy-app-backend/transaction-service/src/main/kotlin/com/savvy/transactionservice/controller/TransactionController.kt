package com.savvy.transactionservice.controller

import com.savvy.transactionservice.dto.TransactionRequest
import com.savvy.transactionservice.dto.TransactionResponse
import com.savvy.transactionservice.service.FirebaseAuthService
import com.savvy.transactionservice.service.TransactionService
import com.savvy.transactionservice.service.UserServiceClient
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/transactions")
class TransactionController(
        private val transactionService: TransactionService,
        private val userServiceClient: UserServiceClient,
        private val firebaseAuthService: FirebaseAuthService
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
}