package com.savvy.budgetingservice

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients

@SpringBootApplication
@EnableFeignClients
class BudgetingServiceApplication

fun main(args: Array<String>) {
    runApplication<BudgetingServiceApplication>(*args)
}
