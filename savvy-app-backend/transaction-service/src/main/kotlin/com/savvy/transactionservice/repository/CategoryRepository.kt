package com.savvy.transactionservice.repository

import com.savvy.transactionservice.model.Category
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CategoryRepository : JpaRepository<Category, Int> {
}