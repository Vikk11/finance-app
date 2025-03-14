package com.savvy.userservice.controller

import com.savvy.userservice.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.math.BigDecimal

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {

    @GetMapping("/firebase/{firebaseUid}")
    fun getUserIdByFirebaseUid(@PathVariable firebaseUid: String): ResponseEntity<Int?> {
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
}