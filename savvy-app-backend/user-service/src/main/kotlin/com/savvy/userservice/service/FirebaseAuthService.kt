package com.savvy.userservice.service

import org.springframework.stereotype.Service
import com.google.firebase.auth.FirebaseAuth

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