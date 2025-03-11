package com.savvy.userservice.service

import org.springframework.stereotype.Service
import com.google.firebase.auth.FirebaseAuth

@Service
class FirebaseAuthService {
    fun verifyTokenAndGetUid(token: String): String? {
        return try {
            val decodedToken = FirebaseAuth.getInstance().verifyIdToken(token)
            decodedToken.uid
        } catch (e: Exception) {
            null
        }
    }
}