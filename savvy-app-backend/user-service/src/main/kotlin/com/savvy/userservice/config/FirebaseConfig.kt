package com.savvy.userservice.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.FileInputStream

@Configuration
class FirebaseConfig {
    @Bean
    fun initializeFirebase(): FirebaseApp {
        val firebasePath = System.getenv("FIREBASE_CREDENTIALS_PATH")
                ?: throw IllegalStateException("Missing FIREBASE_CREDENTIALS_PATH env var")

        val serviceAccount = FileInputStream(firebasePath)

        val options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build()

        println("Firebase successfully initialized!")
        return FirebaseApp.initializeApp(options)
    }
}