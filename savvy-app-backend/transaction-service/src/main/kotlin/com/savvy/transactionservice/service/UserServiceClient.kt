package com.savvy.transactionservice.service

import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class UserServiceClient(private val restTemplate: RestTemplate){

    fun getUserIdFromFirebaseUid(firebaseUid: String): Int? {
        val url = "http://user-service:8080/api/users/firebase/$firebaseUid"
        println("Fetching user ID from: $url")

        return try {
            val userId = restTemplate.getForObject(url, Int::class.java)
            println("Received user ID: $userId")
            userId
        } catch (e: Exception) {
            println("Error fetching user ID: ${e.message}")
            null
        }
    }
}