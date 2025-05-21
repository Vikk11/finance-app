package com.savvy.budgetingservice.service

import com.savvy.budgetingservice.model.BudgetPeriod
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import java.math.BigDecimal
import java.time.LocalDateTime

@FeignClient(name="transaction-service", url="http://transaction-service:8081")
interface TransactionServiceClient {

    @GetMapping("/api/transactions/summary")
    fun getTransactionSummary(
            @RequestParam userId: Long,
            @RequestParam categoryId: Long?,
            @RequestParam period: String,
            @RequestParam date: LocalDateTime
    ): BigDecimal
}