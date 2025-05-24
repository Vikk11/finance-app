package com.savvy.userservice.controller

import com.savvy.userservice.dto.PaymentRequestRequest
import com.savvy.userservice.dto.PaymentRequestResponse
import com.savvy.userservice.model.RequestStatus
import com.savvy.userservice.service.PaymentRequestService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/payment_requests")
class PaymentRequestController (private val paymentRequestService: PaymentRequestService){

    @PostMapping("/createRequest")
    fun create(@RequestBody request: PaymentRequestRequest): ResponseEntity<Void> {
        val authentication = SecurityContextHolder.getContext().authentication
        println("Security context authentication: $authentication")

        val firebaseUid = authentication.principal as String
        paymentRequestService.createPaymentRequest(request, firebaseUid)

        return ResponseEntity.ok().build()
    }

    @PutMapping("/{id}/status")
    fun updateStatus(
            @PathVariable id: Long,
            @RequestParam status: RequestStatus
    ): ResponseEntity<String> {
        paymentRequestService.updatePaymentStatus(id, status)
        return ResponseEntity.ok("Status updated to $status")
    }

    @GetMapping("/allRequests")
    fun getAllRequestsForUser(): ResponseEntity<List<PaymentRequestResponse>> {
        val authentication = SecurityContextHolder.getContext().authentication
        println("Security context authentication: $authentication")

        val firebaseUid = authentication.principal as String

        return ResponseEntity.ok(paymentRequestService.getAllRequestsForUser(firebaseUid))
    }
}