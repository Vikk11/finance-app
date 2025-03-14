package com.savvy.transactionservice.service

import com.savvy.transactionservice.dto.CategoryDTO
import com.savvy.transactionservice.repository.CategoryRepository
import org.springframework.stereotype.Service

@Service
class CategoryService(private val categoryRepository: CategoryRepository){

    fun getAllCategories(): List<CategoryDTO> {
        val categories = categoryRepository.findAll()
        return categories.map { CategoryDTO(it.id, it.name) }
    }
}