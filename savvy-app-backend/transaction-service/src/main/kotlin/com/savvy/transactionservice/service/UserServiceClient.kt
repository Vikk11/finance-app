package com.savvy.transactionservice.service

import org.springframework.cloud.openfeign.FeignClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable


@FeignClient(name="user-service", url="http://user-service:8080")
interface UserServiceClient {
    @GetMapping("/api/users/firebase/{firebaseUid}")
    fun getUserIdFromFirebaseUid(@PathVariable firebaseUid: String): Long?
}