package com.savvy.userservice.kafka

import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Service

@Service
class DeadLetterConsumer {
    @KafkaListener(topics = ["transaction-events.DLT"], groupId= "dlt-group")
    fun handleDLT(message: String){
        println("Received message in DLT: $message")
    }
}