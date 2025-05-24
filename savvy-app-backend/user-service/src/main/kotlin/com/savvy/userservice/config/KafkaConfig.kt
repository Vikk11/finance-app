package com.savvy.userservice.config

import com.savvy.commonmodels.PaymentEvent
import com.savvy.commonmodels.TransactionEvent
import org.apache.kafka.clients.consumer.ConsumerConfig
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.common.serialization.StringDeserializer
import org.apache.kafka.common.serialization.StringSerializer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.annotation.EnableKafka
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory
import org.springframework.kafka.core.ConsumerFactory
import org.springframework.kafka.core.DefaultKafkaConsumerFactory
import org.springframework.kafka.core.DefaultKafkaProducerFactory
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.core.ProducerFactory
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer
import org.springframework.kafka.listener.DefaultErrorHandler
import org.springframework.kafka.support.serializer.JsonDeserializer
import org.springframework.kafka.support.serializer.JsonSerializer
import org.springframework.util.backoff.FixedBackOff

@Configuration
@EnableKafka
class KafkaConfig {

    @Bean
    fun consumerFactory(): ConsumerFactory<String, TransactionEvent> {
        val configs = mutableMapOf<String, Any>(
                ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG to "kafka.kafka.svc.cluster.local:9092",
                ConsumerConfig.GROUP_ID_CONFIG to "user-service-group",
                JsonDeserializer.TRUSTED_PACKAGES to "*"
        )

        val jsonDeserializer = JsonDeserializer(TransactionEvent::class.java)

        return DefaultKafkaConsumerFactory(configs, StringDeserializer(), jsonDeserializer)
    }

    @Bean
    fun kafkaListenerContainerFactory(
            consumerFactory: ConsumerFactory<String, TransactionEvent>,
            errorHandler: DefaultErrorHandler
    ): ConcurrentKafkaListenerContainerFactory<String, TransactionEvent> {
        val factory = ConcurrentKafkaListenerContainerFactory<String, TransactionEvent>()
        factory.consumerFactory = consumerFactory
        factory.setCommonErrorHandler(errorHandler)
        return factory
    }

    @Bean
    fun transactionEventProducerFactory(): ProducerFactory<String, TransactionEvent> {
        val configs = mapOf(
                ProducerConfig.BOOTSTRAP_SERVERS_CONFIG to "kafka.kafka.svc.cluster.local:9092",
                ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG to StringSerializer::class.java,
                ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG to JsonSerializer::class.java
        )
        return DefaultKafkaProducerFactory(configs)
    }

    @Bean
    fun transactionEventKafkaTemplate(): KafkaTemplate<String, TransactionEvent> {
        return KafkaTemplate(transactionEventProducerFactory())
    }

    @Bean
    fun errorHandler(kafkaTemplate: KafkaTemplate<String, TransactionEvent>): DefaultErrorHandler {
        val recoverer = DeadLetterPublishingRecoverer(kafkaTemplate) { record, _ ->
            TopicPartition("${record.topic()}.DLT", record.partition())
        }

        val backOff = FixedBackOff(1000L, 3)

        return DefaultErrorHandler(recoverer, backOff)
    }

    @Bean
    fun producerFactory(): ProducerFactory<String, PaymentEvent>{
        val configs = mapOf(
                ProducerConfig.BOOTSTRAP_SERVERS_CONFIG to "kafka.kafka.svc.cluster.local:9092",
                ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG to StringSerializer::class.java,
                ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG to JsonSerializer::class.java
        )
        return DefaultKafkaProducerFactory(configs)
    }

    @Bean
    fun kafkaTemplate(): KafkaTemplate<String, PaymentEvent> {
        return KafkaTemplate(producerFactory())
    }
}