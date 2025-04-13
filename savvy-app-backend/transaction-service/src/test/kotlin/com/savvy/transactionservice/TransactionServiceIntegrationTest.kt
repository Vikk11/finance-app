package com.savvy.transactionservice

import com.ninjasquad.springmockk.MockkBean
import com.savvy.transactionservice.dto.TransactionRequest
import com.savvy.transactionservice.kafka.TransactionEventProducer
import com.savvy.transactionservice.model.Transaction
import com.savvy.transactionservice.model.TransactionType
import com.savvy.transactionservice.repository.TransactionRepository
import com.savvy.transactionservice.service.TransactionService
import com.savvy.transactionservice.service.UserServiceClient
import io.mockk.Runs
import io.mockk.clearAllMocks
import io.mockk.every
import io.mockk.just
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.LocalDateTime
import kotlin.test.assertEquals

@SpringBootTest(properties = ["spring.profiles.active=test"])
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Transactional
class TransactionServiceIntegrationTest @Autowired constructor(
        val transactionRepository: TransactionRepository,
        val transactionService: TransactionService,
){

    @MockkBean
    lateinit var transactionEventProducer: TransactionEventProducer

    @MockkBean
    lateinit var userServiceClient: UserServiceClient

    @BeforeEach
    fun setup() {
        clearAllMocks()
        transactionRepository.deleteAll()
    }

    @Test
    fun `should save transaction and store in DB`() {
        val firebaseUid = "Ej3fXhcV4ngw2Hu6HqOPtZdwoZl1"
        every { userServiceClient.getUserIdFromFirebaseUid(firebaseUid) } returns 1L

        val request = TransactionRequest(
                type = TransactionType.EXPENSE,
                amount = BigDecimal("50.00"),
                categoryId = 1L,
                relatedUserId = null,
                name = "Bakery",
                date = null
        )

        every { transactionEventProducer.publishTransactionEvent(any()) } just Runs

        val saved = transactionService.addTransaction(firebaseUid, request)

        val fromDb = transactionRepository.findById(saved.id!!)
        assertTrue(fromDb.isPresent)
        assertEquals("Bakery", fromDb.get().name)
    }

    @Test
    fun `should retrieve recent transactions`() {
        val firebaseUid = "Ej3fXhcV4ngw2Hu6HqOPtZdwoZl1"
        val userId = 1L
        every { userServiceClient.getUserIdFromFirebaseUid(firebaseUid) } returns userId

        val now = LocalDateTime.now()
        val t1 = transactionRepository.save(Transaction(userId = userId, amount= BigDecimal("70.00"), type = TransactionType.INCOME, categoryId = 15L, date = now.minusDays(1)))
        val t2 = transactionRepository.save(Transaction(userId = userId, amount= BigDecimal("10.00"), type = TransactionType.EXPENSE, categoryId = 1L, date = now))

        val result = transactionService.getRecentTransactionsByUser(firebaseUid, 2)
        assertEquals(2, result.size)
        assertEquals(t2.id, result[0].id)
    }
}