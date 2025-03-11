package com.savvy.transactionservice.repository

import com.savvy.transactionservice.model.Transaction
import org.springframework.data.jpa.repository.JpaRepository

interface TransactionRepository : JpaRepository<Transaction, Int>{
}