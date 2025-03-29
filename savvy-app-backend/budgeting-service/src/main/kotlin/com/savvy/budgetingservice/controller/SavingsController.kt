package com.savvy.budgetingservice.controller

import com.savvy.budgetingservice.dto.SavingsGoalRequest
import com.savvy.budgetingservice.dto.SavingsGoalResponse
import com.savvy.budgetingservice.service.SavingsService
import com.savvy.budgetingservice.service.UserServiceClient
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/savings")
class SavingsController(
        private val savingsService: SavingsService,
        private val userServiceClient: UserServiceClient
) {

    @PostMapping("/add")
    fun addSavingsGoal(@RequestBody request: SavingsGoalRequest): ResponseEntity<SavingsGoalResponse> {
        val authentication = SecurityContextHolder.getContext().authentication
        println("Security context authentication: $authentication")

        val firebaseUid = authentication?.principal as? String
                ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        println("Firebase UID from authentication: $firebaseUid")
        
        val userId = userServiceClient.getUserIdFromFirebaseUid(firebaseUid)
                ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).build()

        val savingsGoal = savingsService.addSavingsGoal(userId, request)
        return ResponseEntity.ok(SavingsGoalResponse.from(savingsGoal))
    }
}