package com.savvy.userservice.controller

import com.savvy.userservice.dto.UserRequest
import com.savvy.userservice.dto.UserResponse
import com.savvy.userservice.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {

    @GetMapping("/firebase/{firebaseUid}")
    fun getUserIdByFirebaseUid(@PathVariable firebaseUid: String): ResponseEntity<Long?> {
        val userId = userService.getUserIdByFirebaseUid(firebaseUid)
        return if (userId != null) {
            ResponseEntity.ok(userId)
        } else {
            ResponseEntity.status(HttpStatus.NOT_FOUND).build()
        }
    }

    @GetMapping("/getBalance")
    fun getUserBalance(): ResponseEntity<BigDecimal> {
        val authentication = SecurityContextHolder.getContext().authentication
        println("Security context authentication: $authentication")

        val firebaseUid = authentication.principal as String
        val userId = userService.getUserIdByFirebaseUid(firebaseUid) ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).build()

        val user = userService.getUserById(userId) ?: return ResponseEntity.status(HttpStatus.NOT_FOUND).build()

        return ResponseEntity.ok(user.currentBalance ?: BigDecimal.ZERO)
    }

    @PostMapping("/add")
    fun addUser(@RequestBody request: UserRequest): ResponseEntity<UserResponse>{
        val authentication = SecurityContextHolder.getContext().authentication
        println("Security context authentication: $authentication")

        val user = userService.addUser(request)
        return ResponseEntity.ok(UserResponse.from(user))
    }

    @GetMapping("/contacts")
    fun getUserContacts(): List<UserResponse>{
        val authentication = SecurityContextHolder.getContext().authentication
        println("Security context authentication: $authentication")

        val firebaseUid = authentication.principal as String
        return userService.getUserContacts(firebaseUid)
    }

    @PostMapping("/sendMoney")
    fun sendMoneyToUser(@RequestBody request: SendMoneyRequest){
        val authentication = SecurityContextHolder.getContext().authentication
        println("Security context authentication: $authentication")

        val firebaseUid = authentication.principal as String

        userService.sendMoneyToUser(firebaseUid, request.receiverUid, request.amount)
    }

    @PatchMapping("/{userId}/reconcile-balance")
    fun reconcileBalance(
            @PathVariable userId: Long,
            @RequestParam sum: BigDecimal
    ): ResponseEntity<Void> {
        val user = userService.getUserById(userId) ?: return ResponseEntity.notFound().build()

        if (user.currentBalance != sum) {
            userService.updateUserBalance(userId, sum)
            println("Updated balance for user $userId")
        } else {
            println("Balance already correct for user $userId")
        }

        return ResponseEntity.ok().build()
    }
}

data class SendMoneyRequest(
        val receiverUid: String,
        val amount: BigDecimal
)