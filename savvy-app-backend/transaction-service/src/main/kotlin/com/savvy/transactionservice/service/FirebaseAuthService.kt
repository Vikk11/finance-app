package com.savvy.transactionservice.service

import com.google.firebase.auth.FirebaseAuth
import org.springframework.stereotype.Service

@Service
class FirebaseAuthService {
    fun verifyTokenAndGetUid(token: String): String? {
        println("Verifying token: $token")

        return try {
            val decodedToken = FirebaseAuth.getInstance().verifyIdToken(token)
            println("Decoded token UID: ${decodedToken.uid}")
            println("Decoded token claims: ${decodedToken.claims}")
            decodedToken.uid
        } catch (e: Exception) {
            println("Error verifying token: ${e.message}")
            null
        }
    }
}