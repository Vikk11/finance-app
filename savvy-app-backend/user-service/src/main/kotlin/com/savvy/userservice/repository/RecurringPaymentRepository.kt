package com.savvy.userservice.repository

import com.savvy.userservice.model.RecurringPayment
import org.springframework.data.jpa.repository.JpaRepository

interface RecurringPaymentRepository : JpaRepository<RecurringPayment, Long> {
}