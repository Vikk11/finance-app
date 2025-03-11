package com.savvy.userservice.kafka

import com.savvy.userservice.model.TransactionEvent
import com.savvy.userservice.service.UserService
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Service
import java.math.BigDecimal

@Service
class TransactionEventConsumer(private val userService: UserService) {

    @KafkaListener(topics = ["\${kafka.topic.transaction}"], groupId = "user-service-group")
    fun handleTransactionEvent(event: TransactionEvent) {
        userService.updateBalance(event.userId, event.amount, event.type)
    }
}
