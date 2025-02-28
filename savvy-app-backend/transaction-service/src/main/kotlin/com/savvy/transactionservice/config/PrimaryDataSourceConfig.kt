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
        basePackages = ["com.savvy.transactionservice.repository.primary"],
        entityManagerFactoryRef = "primaryEntityManagerFactory",
        transactionManagerRef = "primaryTransactionManager"
)
class PrimaryDataSourceConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.primary")
    fun primaryDataSource(): DataSource {
        return DataSourceBuilder.create().build()
    }

    @Bean
    fun primaryEntityManagerFactory(
            primaryDataSource: DataSource
    ): LocalContainerEntityManagerFactoryBean {
        val factory = LocalContainerEntityManagerFactoryBean()
        factory.dataSource = primaryDataSource
        factory.setPackagesToScan("com.savvy.transactionservice.model.primary")
        factory.persistenceUnitName = "primary"
        factory.jpaVendorAdapter = HibernateJpaVendorAdapter()
        return factory
    }

    @Bean
    fun primaryTransactionManager(
            primaryEntityManagerFactory: EntityManagerFactory
    ): PlatformTransactionManager {
        return JpaTransactionManager(primaryEntityManagerFactory)
    }
}