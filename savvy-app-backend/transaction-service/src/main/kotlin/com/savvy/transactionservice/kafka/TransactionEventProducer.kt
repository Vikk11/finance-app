package com.savvy.transactionservice.kafka

import com.savvy.transactionservice.model.TransactionEvent
import org.springframework.beans.factory.annotation.Value
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Service

@Service
class TransactionEventProducer(
        private val kafkaTemplate: KafkaTemplate<String, TransactionEvent>
){

    @Value("\${kafka.topic.transaction}")
    private lateinit var topic: String

    fun publishTransactionEvent(event: TransactionEvent) {
        kafkaTemplate.send(topic, event)
    }
}