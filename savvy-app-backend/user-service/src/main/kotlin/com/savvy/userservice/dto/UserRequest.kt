package com.savvy.userservice.dto

import java.math.BigDecimal

data class UserRequest (
        val userUid: String,
        val currentBalance: BigDecimal
)