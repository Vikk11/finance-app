package com.savvy.budgetingservice.repository

import org.springframework.data.jpa.repository.JpaRepository
import com.savvy.budgetingservice.model.SavingsGoal

interface SavingsRepository: JpaRepository<SavingsGoal, Long>{

}