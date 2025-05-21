package com.savvy.transactionservice.kafka

import com.savvy.commonmodels.PaymentEvent
import com.savvy.transactionservice.service.TransactionService
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.retry.annotation.Backoff
import org.springframework.retry.annotation.Retryable
import org.springframework.stereotype.Service

@Service
class PaymentEventConsumer (
        private val transactionService: TransactionService
){

    @Retryable(value = [Exception::class], maxAttempts = 5, backoff = Backoff(delay = 5000))
    @KafkaListener(
            topics = ["\${kafka.topic.payment}"],
            groupId = "transaction-service-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    fun handlePaymentEvent(event: PaymentEvent) {
        println("Received payment event")
        transactionService.handlePayment(event)
    }
}