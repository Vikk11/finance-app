package com.savvy.userservice.config

import org.apache.kafka.clients.admin.AdminClientConfig
import org.apache.kafka.clients.admin.NewTopic
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.core.KafkaAdmin

@Configuration
class KafkaTopicConfig {
    @Bean
    fun kafkaAdmin(): KafkaAdmin {
        return KafkaAdmin(mapOf(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG to "kafka.kafka.svc.cluster.local:9092"))
    }

    @Bean
    fun paymentTopic(): NewTopic {
        return NewTopic("payment", 1, 1.toShort())
    }

    @Bean
    fun paymentRequestTopic(): NewTopic {
        return NewTopic("payment-request", 1, 1.toShort())
    }

    @Bean
    fun dltTopic(): NewTopic {
        return NewTopic("transaction-events.DLT", 1, 1.toShort())
    }
}