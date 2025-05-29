package com.savvy.transactionservice.config

import com.savvy.commonmodels.PaymentEvent
import com.savvy.commonmodels.TransactionEvent
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.common.serialization.StringDeserializer
import org.apache.kafka.common.serialization.StringSerializer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.annotation.EnableKafka
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory
import org.springframework.kafka.core.*
import org.springframework.kafka.support.serializer.JsonDeserializer
import org.springframework.kafka.support.serializer.JsonSerializer

@Configuration
@EnableKafka
class KafkaConfig {

    @Bean
    fun producerFactory(): ProducerFactory<String, TransactionEvent> {
        val configs = mapOf(
                ProducerConfig.BOOTSTRAP_SERVERS_CONFIG to "kafka-0.kafka-headless.kafka.svc.cluster.local:9092",
                ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG to StringSerializer::class.java,
                ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG to JsonSerializer::class.java
        )
        return DefaultKafkaProducerFactory(configs)
    }

    @Bean
    fun kafkaTemplate(): KafkaTemplate<String, TransactionEvent> {
        return KafkaTemplate(producerFactory())
    }

    @Bean
    fun consumerFactory(): ConsumerFactory<String, PaymentEvent> {
        val configs = mutableMapOf<String, Any>(
                ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG to "kafka-0.kafka-headless.kafka.svc.cluster.local:9092",
                ConsumerConfig.GROUP_ID_CONFIG to "transaction-service-group",
                JsonDeserializer.TRUSTED_PACKAGES to "*"
        )

        val jsonDeserializer = JsonDeserializer(PaymentEvent::class.java)

        return DefaultKafkaConsumerFactory(configs, StringDeserializer(), jsonDeserializer)
    }

    @Bean
    fun kafkaListenerContainerFactory(
            consumerFactory: ConsumerFactory<String, PaymentEvent>
    ): ConcurrentKafkaListenerContainerFactory<String, PaymentEvent> {
        val factory = ConcurrentKafkaListenerContainerFactory<String, PaymentEvent>()
        factory.consumerFactory = consumerFactory
        return factory
    }
}