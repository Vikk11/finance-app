package com.savvy.transactionservice.kafka

import com.savvy.commonmodels.TransactionEvent
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Value
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Service

@Service
class TransactionEventProducer(
        private val kafkaTemplate: KafkaTemplate<String, TransactionEvent>,
        @Value("\${kafka.topic.transaction}") private val topic: String
){
    @PostConstruct
    fun init() {
        println("TransactionEventProducer initialized with topic: $topic")
    }

    fun publishTransactionEvent(event: TransactionEvent) {
        println("Publishing transaction event: $event to topic: $topic")
        val future = kafkaTemplate.send(topic, event)

        future.whenComplete { result, ex ->
            if (ex != null){
                println("Failed to send event: $event, error: ${ex.message}")
            } else {
                println("Successfully sent event: $event, partition: ${result?.recordMetadata?.partition()}, offset: ${result?.recordMetadata?.offset()}")
            }
        }
    }
}