package com.phoneaccessories.favorites;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * Main application class for the Favorites Service.
 *
 * This microservice manages user favorites for phone accessories e-commerce platform.
 * It uses MongoDB for persistence and Redis for caching.
 */
@SpringBootApplication
@EnableCaching
@EnableMongoRepositories
public class FavoritesServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(FavoritesServiceApplication.class, args);
	}
}