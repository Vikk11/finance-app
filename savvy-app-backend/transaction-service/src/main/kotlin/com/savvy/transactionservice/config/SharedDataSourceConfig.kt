package com.savvy.transactionservice.config

import jakarta.persistence.EntityManagerFactory
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.jdbc.DataSourceBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.orm.jpa.JpaTransactionManager
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter
import org.springframework.transaction.PlatformTransactionManager
import javax.sql.DataSource

@Configuration
@EnableJpaRepositories(
        basePackages = ["com.savvy.transactionservice.repository.shared"],
        entityManagerFactoryRef = "sharedEntityManagerFactory",
        transactionManagerRef = "sharedTransactionManager"
)
class SharedDataSourceConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.shared")
    fun sharedDataSource(): DataSource {
        return DataSourceBuilder.create().build()
    }

    @Bean
    fun sharedEntityManagerFactory(
            sharedDataSource: DataSource
    ): LocalContainerEntityManagerFactoryBean {
        val factory = LocalContainerEntityManagerFactoryBean()
        factory.dataSource = sharedDataSource
        factory.setPackagesToScan("com.savvy.transactionservice.model.shared")
        factory.persistenceUnitName = "shared"
        factory.jpaVendorAdapter = HibernateJpaVendorAdapter()
        return factory
    }

    @Bean
    fun sharedTransactionManager(
            sharedEntityManagerFactory: EntityManagerFactory
    ): PlatformTransactionManager {
        return JpaTransactionManager(sharedEntityManagerFactory)
    }
}