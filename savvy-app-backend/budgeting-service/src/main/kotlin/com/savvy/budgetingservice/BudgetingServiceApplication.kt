package com.savvy.budgetingservice

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BudgetingServiceApplication

fun main(args: Array<String>) {
    runApplication<BudgetingServiceApplication>(*args)
}
