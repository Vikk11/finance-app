package com.savvy.userservice.kafka

import com.savvy.commonmodels.TransactionEvent
import com.savvy.userservice.service.UserService
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Service

@Service
class TransactionEventConsumer(private val userService: UserService) {

    @KafkaListener(
            topics = ["\${kafka.topic.transaction}"],
            groupId = "user-service-group",
            containerFactory = "kafkaListenerContainerFactory")
    fun handleTransactionEvent(event: TransactionEvent) {
        println("Received transaction from ${event.userId} type: ${event.type}")
        userService.updateBalance(event.userId, event.amount, event.type)
    }
}
