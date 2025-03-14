package com.savvy.userservice.config

import com.savvy.userservice.service.FirebaseAuthService
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class FirebaseAuthenticationFilter(
        private val firebaseAuthService: FirebaseAuthService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
            request: HttpServletRequest,
            response: HttpServletResponse,
            filterChain: FilterChain
    ) {
        val header = request.getHeader("Authorization")
        println("Received Authorization header: $header")

        if (header == null || !header.startsWith("Bearer ")) {
            println("Missing or invalid Authorization header")
            filterChain.doFilter(request, response)
            return
        }

        val token = header.substring(7)
        println("Extracted token: $token")

        val uid = firebaseAuthService.verifyTokenAndGetUid(token)

        if (uid == null) {
            println("Invalid Firebase token")
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token")
            return
        }

        println("Successfully authenticated user with UID: $uid")

        val authentication = UsernamePasswordAuthenticationToken(uid, null, emptyList())
        SecurityContextHolder.getContext().authentication = authentication

        filterChain.doFilter(request, response)
    }
}