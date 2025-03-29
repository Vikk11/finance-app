package com.savvy.transactionservice.service

import com.savvy.commonmodels.TransactionEvent
import com.savvy.transactionservice.dto.TransactionRequest
import com.savvy.transactionservice.kafka.TransactionEventProducer
import com.savvy.transactionservice.model.Transaction
import com.savvy.transactionservice.model.TransactionType
import com.savvy.transactionservice.repository.TransactionRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal
import java.time.DayOfWeek
import java.time.LocalDateTime

@Service
class TransactionService(
        private val transactionRepository: TransactionRepository,
        private val transactionEventProducer: TransactionEventProducer,
        private val userServiceClient: UserServiceClient
) {
    @Transactional
    fun addTransaction(firebaseUid: String, request: TransactionRequest): Transaction {
        val userId = getUserId(firebaseUid)
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
                type = request.type.toString(),
                amount = request.amount,
                categoryId = request.categoryId
        )

        transactionEventProducer.publishTransactionEvent(transactionEvent)
        return savedTransaction
    }

    private fun getUserId(firebaseUid: String): Long {
        return userServiceClient.getUserIdFromFirebaseUid(firebaseUid)
                ?: throw ResponseStatusException(HttpStatus.NOT_FOUND, "User with UID $firebaseUid not found")
    }

    fun getRecentTransactionsByUser(firebaseUid: String, limit: Int): List<Transaction> {
        return transactionRepository.findRecentByUserId(getUserId(firebaseUid), PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "date")))
    }

    fun transactionsSum(userId: Long, categoryId: Long, period: String, createdAt: LocalDateTime): BigDecimal {
        val startDate = getStartDate(period, createdAt)
        val totalSpent = transactionRepository.sumTransactions(userId, categoryId, startDate, createdAt)

        return totalSpent.max(BigDecimal.ZERO)
    }

    private fun getStartDate(period: String, createdAt: LocalDateTime): LocalDateTime {
        return when (period.lowercase()) {
            "weekly" -> createdAt.with(DayOfWeek.MONDAY).toLocalDate().atStartOfDay()
            "monthly" -> createdAt.withDayOfMonth(1).toLocalDate().atStartOfDay()
            "yearly" -> createdAt.withDayOfYear(1).toLocalDate().atStartOfDay()
            else ->  throw IllegalArgumentException("Invalid period: $period")
        }
    }
}