package com.savvy.userservice.kafka

import com.savvy.commonmodels.TransactionEvent
import com.savvy.userservice.service.UserService
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.retry.annotation.Backoff
import org.springframework.retry.annotation.Retryable
import org.springframework.stereotype.Service

@Service
class TransactionEventConsumer(private val userService: UserService) {

    @Retryable(value = [Exception::class], maxAttempts = 5, backoff = Backoff(delay = 5000))
    @KafkaListener(
            topics = ["\${kafka.topic.transaction}"],
            groupId = "user-service-group",
            containerFactory = "kafkaListenerContainerFactory")
    fun handleTransactionEvent(event: TransactionEvent) {
        println("Received transaction event: $event")
        userService.updateBalance(event.userId, event.amount, event.type)
    }
}
