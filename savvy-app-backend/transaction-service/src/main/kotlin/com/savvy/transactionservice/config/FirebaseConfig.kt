package com.savvy.transactionservice.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.io.FileNotFoundException

@Configuration
class FirebaseConfig {
    @Bean
    fun initializeFirebase(): FirebaseApp {
        val resource = this::class.java.classLoader.getResourceAsStream("firebase/firebase-service-account.json")
                ?: throw FileNotFoundException("Firebase service account JSON file not found!")

        val options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(resource))
                .build()

        println("Firebase successfully initialized!")
        return FirebaseApp.initializeApp(options)
    }
}