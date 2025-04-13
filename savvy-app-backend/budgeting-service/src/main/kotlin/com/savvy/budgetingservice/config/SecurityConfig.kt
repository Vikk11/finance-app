package com.savvy.budgetingservice.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.HttpStatusEntryPoint
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter

@Configuration
@EnableWebSecurity
class SecurityConfig(private val firebaseAuthenticationFilter: FirebaseAuthenticationFilter) {
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
                .csrf { it.disable() }
                .authorizeHttpRequests { auth ->
                    auth.requestMatchers("/actuator/**").permitAll()
                    auth.anyRequest().authenticated()
                }
                .addFilterBefore(firebaseAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)
                .exceptionHandling { it.authenticationEntryPoint(HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))}
                .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS)}
        return http.build()
    }
}