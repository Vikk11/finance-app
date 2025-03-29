package com.savvy.transactionservice.service

import com.google.firebase.auth.FirebaseAuth
import org.springframework.stereotype.Service

@Service
class FirebaseAuthService {
    fun verifyTokenAndGetUid(token: String): String? {
        println("Verifying token: $token")

        return runCatching {
            FirebaseAuth.getInstance().verifyIdToken(token).uid
        }.onSuccess { uid ->
            println("Decoded token UID: $uid")
        }.onFailure { e ->
            println("Error verifying token: ${e.message}")
        }.getOrNull()
    }
}