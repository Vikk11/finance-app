package com.savvy.budgetingservice.controller

import com.savvy.budgetingservice.dto.BudgetRequest
import com.savvy.budgetingservice.dto.BudgetResponse
import com.savvy.budgetingservice.model.BudgetPeriod
import com.savvy.budgetingservice.service.BudgetsService
import com.savvy.budgetingservice.service.UserServiceClient
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/budgeting")
class BudgetsController(
        private val budgetsService: BudgetsService
) {

    @PostMapping("/add")
    fun addBudget(@RequestBody request: BudgetRequest): ResponseEntity<BudgetResponse> {
        val authentication = SecurityContextHolder.getContext().authentication
        println("Security context authentication: $authentication")

        val firebaseUid = authentication?.principal as? String
                ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        println("Firebase UID from authentication: $firebaseUid")

        val budget = budgetsService.addBudget(firebaseUid, request)
        return ResponseEntity.ok(BudgetResponse.from(budget))
    }

    @GetMapping("/budgets")
    fun getBudgets(@RequestParam period: BudgetPeriod): List<BudgetResponse> {
        val authentication = SecurityContextHolder.getContext().authentication
        val firebaseUid = authentication.principal as String

        return budgetsService.getBudgetsByPeriod(firebaseUid, period)
                .map(BudgetResponse::from)
    }
}