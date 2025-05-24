package com.savvy.budgetingservice.config

import com.savvy.commonmodels.TransactionEvent
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.common.serialization.StringDeserializer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.annotation.EnableKafka
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory
import org.springframework.kafka.core.ConsumerFactory
import org.springframework.kafka.core.DefaultKafkaConsumerFactory
import org.springframework.kafka.support.serializer.JsonDeserializer

@Configuration
@EnableKafka
class KafkaConfig {

    @Bean
    fun consumerFactory(): ConsumerFactory<String, TransactionEvent> {
        val configs = mutableMapOf<String, Any>(
                ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG to "kafka.kafka.svc.cluster.local:9092",
                ConsumerConfig.GROUP_ID_CONFIG to "budgeting-service-group",
                JsonDeserializer.TRUSTED_PACKAGES to "*"
        )

        val jsonDeserializer = JsonDeserializer(TransactionEvent::class.java)

        return DefaultKafkaConsumerFactory(configs, StringDeserializer(), jsonDeserializer)
    }

    @Bean
    fun kafkaListenerContainerFactory(
            consumerFactory: ConsumerFactory<String, TransactionEvent   >
    ): ConcurrentKafkaListenerContainerFactory<String, TransactionEvent> {
        val factory = ConcurrentKafkaListenerContainerFactory<String, TransactionEvent>()
        factory.consumerFactory = consumerFactory
        return factory
    }
}