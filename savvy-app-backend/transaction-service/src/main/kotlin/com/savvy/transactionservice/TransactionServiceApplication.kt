package com.savvy.transactionservice

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableFeignClients
class TransactionServiceApplication

fun main(args: Array<String>) {
    runApplication<TransactionServiceApplication>(*args)
}
