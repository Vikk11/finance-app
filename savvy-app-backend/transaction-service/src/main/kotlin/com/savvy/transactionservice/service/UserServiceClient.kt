package com.savvy.transactionservice.service

import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestParam
import java.math.BigDecimal


@FeignClient(name="user-service", url="http://user-service:8080")
interface UserServiceClient {
    @GetMapping("/api/users/firebase/{firebaseUid}")
    fun getUserIdFromFirebaseUid(@PathVariable firebaseUid: String): Long?

    @PatchMapping("/api/users/{userId}/reconcile-balance")
    fun reconcileBalance(
            @PathVariable userId: Long,
            @RequestParam sum: BigDecimal
    )
}