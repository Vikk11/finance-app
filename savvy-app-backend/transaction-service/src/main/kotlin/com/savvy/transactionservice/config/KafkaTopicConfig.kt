package com.savvy.transactionservice.config

import org.apache.kafka.clients.admin.AdminClientConfig
import org.apache.kafka.clients.admin.NewTopic
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.core.KafkaAdmin

@Configuration
class KafkaTopicConfig {
    @Bean
    fun kafkaAdmin(): KafkaAdmin {
        return KafkaAdmin(mapOf(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG to "kafka-0.kafka-headless.kafka.svc.cluster.local:9092"))
    }

    @Bean
    fun transactionTopic(): NewTopic {
        return NewTopic("transaction", 1, 1.toShort())
    }

    @Bean
    fun transactionTestTopic(): NewTopic {
        return NewTopic("transaction-test", 1, 1.toShort())
    }
}