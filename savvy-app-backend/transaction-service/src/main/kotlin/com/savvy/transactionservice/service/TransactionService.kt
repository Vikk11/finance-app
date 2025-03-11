package com.savvy.transactionservice.service

import com.savvy.transactionservice.dto.TransactionRequest
import com.savvy.transactionservice.kafka.TransactionEventProducer
import com.savvy.transactionservice.model.Transaction
import com.savvy.transactionservice.model.TransactionEvent
import com.savvy.transactionservice.model.TransactionType
import com.savvy.transactionservice.repository.TransactionRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class TransactionService(
        private val transactionRepository: TransactionRepository,
        private val transactionEventProducer: TransactionEventProducer
) {
    @Transactional
    fun addTransaction(userId: Int, request: TransactionRequest): Transaction {
        val transaction = Transaction(
                userId = userId,
                type = TransactionType.valueOf(request.type.toString()),
                amount = request.amount,
                categoryId = request.categoryId,
                relatedUserId = request.relatedUserId,
                name = request.name,
                date = request.date ?: LocalDateTime.now(),
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
        )

        val savedTransaction = transactionRepository.save(transaction)

        val transactionEvent = TransactionEvent(
                userId = userId,
                amount = request.amount,
                type = request.type.toString()
        )

        transactionEventProducer.publishTransactionEvent(transactionEvent)
        return savedTransaction
    }
}