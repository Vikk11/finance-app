package com.savvy.transactionservice.service

import com.savvy.commonmodels.PaymentEvent
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

    fun getAllTransactions(firebaseUid: String): List<Transaction> {
        return transactionRepository.findAllByUserId(getUserId(firebaseUid))
    }

    fun transactionsSum(userId: Long, categoryId: Long, period: String, date: LocalDateTime): BigDecimal {
        val startDate = getStartDate(period, date)
        val totalSpent = transactionRepository.sumTransactions(userId, categoryId, startDate, date)

        return totalSpent.max(BigDecimal.ZERO)
    }

    private fun getStartDate(period: String, date: LocalDateTime): LocalDateTime {
        return when (period.lowercase()) {
            "weekly" -> date.with(DayOfWeek.MONDAY).toLocalDate().atStartOfDay()
            "monthly" -> date.withDayOfMonth(1).toLocalDate().atStartOfDay()
            "yearly" -> date.withDayOfYear(1).toLocalDate().atStartOfDay()
            else ->  throw IllegalArgumentException("Invalid period: $period")
        }
    }

    fun handlePayment(event: PaymentEvent){
        val senderId = event.requesterId
        val receiverId = event.payerId ?: throw IllegalArgumentException("payerId cannot be null")

        val expenseTransaction = Transaction(
                userId = senderId,
                type = TransactionType.EXPENSE,
                amount = event.amount,
                categoryId = 13L,
                relatedUserId = receiverId,
                name = event.description ?: "Sent money to user $receiverId",
                date = LocalDateTime.now(),
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
        )

        transactionRepository.save(expenseTransaction)

        val transactionEventSender = TransactionEvent(
                userId = senderId,
                type = TransactionType.EXPENSE.toString(),
                amount = event.amount,
                categoryId = 13L
        )

        transactionEventProducer.publishTransactionEvent(transactionEventSender)

        val incomeTransaction = Transaction(
                userId = receiverId,
                type = TransactionType.INCOME,
                amount = event.amount,
                categoryId = 13L,
                relatedUserId = senderId,
                name = event.description ?: "Received money from user $senderId",
                date = LocalDateTime.now(),
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
        )

        transactionRepository.save(incomeTransaction)

        val transactionEventReceiver = TransactionEvent(
                userId = receiverId,
                type = TransactionType.INCOME.toString(),
                amount = event.amount,
                categoryId = 13L
        )

        transactionEventProducer.publishTransactionEvent(transactionEventReceiver)
    }

    fun getTransactionSum(){

    }

    fun getPaginatedTransactions(userUid: String, page: Int, size: Int): List<Transaction> {
        val pageable = PageRequest.of(page, size, Sort.by("date").descending())
        val pageResult = transactionRepository.findAllByUserId(getUserId(userUid), pageable)

        return pageResult.toList()
    }
}