package com.savvy.userservice.kafka

import com.savvy.commonmodels.PaymentEvent
import com.savvy.commonmodels.TransactionEvent
import org.springframework.beans.factory.annotation.Value
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Service
import javax.annotation.PostConstruct

@Service
class PaymentEventProducer(
        private val kafkaTemplate: KafkaTemplate<String, PaymentEvent>,
        @Value("\${kafka.topic.payment}") private val paymentTopic: String,
        @Value("\${kafka.topic.payment-request}") private val paymentRequestTopic: String
) {
    @PostConstruct
    fun init() {
        println("PaymentEvenProducer initialized with topics: $paymentTopic, $paymentRequestTopic")
    }

    fun publishPayment(event: PaymentEvent){
        println("Publishing payment event: $event to topic: $paymentTopic")
        val future = kafkaTemplate.send(paymentTopic, event)

        future.whenComplete { result, ex ->
            if (ex != null){
                println("Failed to send event, error: ${ex.message}")
            } else {
                println("Successfully sent event, partition: ${result?.recordMetadata?.partition()}, offset: ${result?.recordMetadata?.offset()}")
            }
        }
    }

    fun publishPaymentRequest(event: PaymentEvent){
        println("Publishing payment event: $event to topic: $paymentTopic")
        val future = kafkaTemplate.send(paymentRequestTopic, event)

        future.whenComplete { result, ex ->
            if (ex != null){
                println("Failed to send event: $event, error: ${ex.message}")
            } else {
                println("Successfully sent event: $event, partition: ${result?.recordMetadata?.partition()}, offset: ${result?.recordMetadata?.offset()}")
            }
        }
    }
}