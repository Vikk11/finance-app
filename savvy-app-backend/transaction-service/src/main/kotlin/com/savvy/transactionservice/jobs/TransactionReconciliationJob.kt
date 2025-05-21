package com.savvy.transactionservice.jobs

import com.savvy.transactionservice.repository.TransactionRepository
import com.savvy.transactionservice.service.UserServiceClient
import org.springframework.scheduling.annotation.Scheduled

class TransactionReconciliationJob(
        private val transactionRepository: TransactionRepository,
        private val userServiceClient: UserServiceClient
) {

    @Scheduled(cron = "0 0 3 * * *")
    fun reconcileBalances() {
        val userIds = transactionRepository.findAllUserIdsWithTransactions()

        for(userId in userIds){
            val sum = transactionRepository.sumByUserId(userId)
            try {
                userServiceClient.reconcileBalance(userId, sum)
                println("Reconciled user $userId")
            } catch (e: Exception) {
                println("Failed to reconcile user $userId: ${e.message}")
            }
        }

    }
}