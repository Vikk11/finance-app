package com.savvy.transactionservice

import com.savvy.transactionservice.dto.TransactionRequest
import com.savvy.transactionservice.kafka.TransactionEventProducer
import com.savvy.transactionservice.model.Transaction
import com.savvy.transactionservice.model.TransactionType
import com.savvy.transactionservice.repository.TransactionRepository
import com.savvy.transactionservice.service.TransactionService
import com.savvy.transactionservice.service.UserServiceClient
import io.mockk.*
import io.mockk.impl.annotations.InjectMockKs
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal
import java.time.LocalDateTime
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@ExtendWith(MockKExtension::class)
class TransactionServiceTest {
    @MockK lateinit var transactionRepository: TransactionRepository
    @MockK lateinit var transactionEventProducer: TransactionEventProducer
    @MockK lateinit var userServiceClient: UserServiceClient
    @InjectMockKs lateinit var transactionService: TransactionService

    val firebaseUid = "Ej3fXhcV4ngw2Hu6HqOPtZdwoZl1"
    val userId = 1L

    @Test
    fun `addTransaction should save transaction and publish event`() {
        val request = TransactionRequest(
                type = TransactionType.EXPENSE,
                amount = BigDecimal("50.00"),
                categoryId = 7L,
                relatedUserId = null,
                name = "Groceries",
                date = LocalDateTime.now()
        )

        val transactionSlot = slot<Transaction>()
        val transaction = Transaction (
                id = 1L,
                userId = userId,
                type = request.type,
                amount = request.amount,
                categoryId = request.categoryId,
                relatedUserId = null,
                name = request.name,
                date = request.date ?: LocalDateTime.now(),
                createdAt = LocalDateTime.now(),
                updatedAt = LocalDateTime.now()
        )

        every { userServiceClient.getUserIdFromFirebaseUid(firebaseUid) } returns userId
        every { transactionRepository.save(capture(transactionSlot)) } returns transaction
        every { transactionEventProducer.publishTransactionEvent(any()) } just Runs

        val result = transactionService.addTransaction(firebaseUid, request)

        assertEquals(transaction, result)
        assertEquals(userId, transactionSlot.captured.userId)
        verify { transactionRepository.save(any()) }
        verify { transactionEventProducer.publishTransactionEvent(any()) }
    }

    @Test
    fun `getRecentTransactionsByUser should return list from repo`() {
        val transactions = listOf(Transaction(
                userId = userId,
                type = TransactionType.EXPENSE,
                amount = BigDecimal("20.00"),
                categoryId = 7L
        ))

        every { userServiceClient.getUserIdFromFirebaseUid(firebaseUid) } returns userId
        every {
            transactionRepository.findRecentByUserId(eq(userId), any())
        } returns transactions

        val result = transactionService.getRecentTransactionsByUser(firebaseUid, 3)

        assertEquals(transactions, result)
    }

    @Test
    fun `transactionsSum should return positive sum`() {
        val categoryId = 7L
        val createdAt = LocalDateTime.now()
        val expectedSum = BigDecimal("123.45")
        val period = "monthly"

        every {
            transactionRepository.sumTransactions(userId, categoryId, any(), createdAt)
        } returns expectedSum

        val result = transactionService.transactionsSum(userId, categoryId, period, createdAt)

        assertEquals(expectedSum, result)
    }

    @Test
    fun `transactionsSum should return zero when sum is negative`() {
        val categoryId = 7L
        val createdAt = LocalDateTime.now()
        val period = "monthly"

        every {
            transactionRepository.sumTransactions(userId, categoryId, any(), createdAt)
        } returns BigDecimal("-100.00")

        val result = transactionService.transactionsSum(userId, categoryId, period, createdAt)

        assertEquals(BigDecimal.ZERO, result)
    }

    @Test
    fun `getUserId should throw when user not found`() {
        every { userServiceClient.getUserIdFromFirebaseUid(firebaseUid) } returns null

        val exception = assertThrows<ResponseStatusException> {
            transactionService.getAllTransactions(firebaseUid)
        }

        assertEquals(HttpStatus.NOT_FOUND, exception.statusCode)
        assertTrue(exception.reason?.contains(firebaseUid) == true)
    }
}