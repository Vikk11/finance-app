package com.savvy.budgetingservice.kafka

import com.savvy.budgetingservice.service.BudgetsService
import com.savvy.commonmodels.TransactionEvent
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Service

@Service
class TransactionEventConsumer(
        private val budgetsService: BudgetsService
) {

    @KafkaListener(topics = ["\${kafka.topic.transaction}"], groupId = "budgeting-service-group")
    fun handleTransactionEvent(event: TransactionEvent) {
        if(event.type == "expense") {
            budgetsService.updateBudget(event.userId, event.categoryId, event.amount)
        }
    }
}