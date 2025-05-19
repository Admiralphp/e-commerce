package com.phoneaccessories.favorites.integration;

import com.phoneaccessories.favorites.FavoritesServiceApplication;
import com.phoneaccessories.favorites.dto.AddFavoriteRequest;
import com.phoneaccessories.favorites.dto.FavoriteResponse;
import com.phoneaccessories.favorites.dto.UserFavoritesResponse;
import com.phoneaccessories.favorites.model.Favorite;
import com.phoneaccessories.favorites.repository.FavoriteRepository;
import com.phoneaccessories.favorites.service.CacheService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(
    classes = FavoritesServiceApplication.class,
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@Testcontainers
class FavoriteIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private CacheService cacheService;

    private String baseUrl;

    private static final String USER_ID = "test-user-id";
    private static final String PRODUCT_ID = "test-product-id";
    private static final String PRODUCT_NAME = "Test Product";
    private static final double PRODUCT_PRICE = 99.99;
    private static final String PRODUCT_IMAGE = "http://example.com/image.jpg";
    private static final String CATEGORY = "Test Category";

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer(DockerImageName.parse("mongo:6.0.8"));

    @Container
    static GenericContainer<?> redisContainer = new GenericContainer<>(DockerImageName.parse("redis:7.0.12-alpine"))
            .withExposedPorts(6379);

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
        registry.add("spring.data.redis.host", redisContainer::getHost);
        registry.add("spring.data.redis.port", redisContainer::getFirstMappedPort);
    }

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/favorites";
        favoriteRepository.deleteAll();
        cacheService.evictAllUserCache(USER_ID);
    }

    @Test
    void addFavorite_Success() {
        // Create request
        AddFavoriteRequest request = new AddFavoriteRequest();
        request.setProductId(PRODUCT_ID);
        request.setProductName(PRODUCT_NAME);
        request.setProductPrice(PRODUCT_PRICE);
        request.setProductImageUrl(PRODUCT_IMAGE);
        request.setCategory(CATEGORY);

        // Make request
        ResponseEntity<FavoriteResponse> response = restTemplate.postForEntity(
            baseUrl + "/" + USER_ID,
            request,
            FavoriteResponse.class
        );

        // Verify response
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(PRODUCT_ID, response.getBody().getProductId());
        assertEquals(USER_ID, response.getBody().getUserId());
        assertEquals(PRODUCT_NAME, response.getBody().getProductName());

        // Verify database
        assertTrue(favoriteRepository.existsByUserIdAndProductId(USER_ID, PRODUCT_ID));

        // Verify cache was invalidated (next get should hit database)
        assertFalse(cacheService.getCachedUserFavorites(USER_ID).isPresent());
    }

    @Test
    void addFavorite_Duplicate() {
        // Add initial favorite
        Favorite favorite = new Favorite(USER_ID, PRODUCT_ID, PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_IMAGE, CATEGORY);
        favoriteRepository.save(favorite);

        // Try to add duplicate
        AddFavoriteRequest request = new AddFavoriteRequest();
        request.setProductId(PRODUCT_ID);
        request.setProductName(PRODUCT_NAME);
        request.setProductPrice(PRODUCT_PRICE);
        request.setProductImageUrl(PRODUCT_IMAGE);
        request.setCategory(CATEGORY);

        ResponseEntity<FavoriteResponse> response = restTemplate.postForEntity(
            baseUrl + "/" + USER_ID,
            request,
            FavoriteResponse.class
        );

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    }

    @Test
    void removeFavorite_Success() {
        // Add favorite to remove
        Favorite favorite = new Favorite(USER_ID, PRODUCT_ID, PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_IMAGE, CATEGORY);
        favoriteRepository.save(favorite);

        // Cache the favorites
        Optional<UserFavoritesResponse> cachedBefore = cacheService.getCachedUserFavorites(USER_ID);

        // Make delete request
        restTemplate.delete(baseUrl + "/" + USER_ID + "/" + PRODUCT_ID);

        // Verify deletion from database
        assertFalse(favoriteRepository.existsByUserIdAndProductId(USER_ID, PRODUCT_ID));
        
        // Verify cache was invalidated
        Optional<UserFavoritesResponse> cachedAfter = cacheService.getCachedUserFavorites(USER_ID);
        assertTrue(cachedBefore.isPresent(), "Cache should have been populated");
        assertFalse(cachedAfter.isPresent(), "Cache should have been invalidated");
    }

    @Test
    void removeFavorite_NotFound() {
        ResponseEntity<Void> response = restTemplate.exchange(
            baseUrl + "/" + USER_ID + "/" + PRODUCT_ID,
            org.springframework.http.HttpMethod.DELETE,
            null,
            Void.class
        );

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getUserFavorites_Success() {
        // Add test favorite
        Favorite favorite = new Favorite(USER_ID, PRODUCT_ID, PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_IMAGE, CATEGORY);
        favoriteRepository.save(favorite);

        // First request - should hit database and cache result
        ResponseEntity<UserFavoritesResponse> response1 = restTemplate.getForEntity(
            baseUrl + "/" + USER_ID,
            UserFavoritesResponse.class
        );

        // Verify first response
        assertEquals(HttpStatus.OK, response1.getStatusCode());
        assertNotNull(response1.getBody());
        assertEquals(USER_ID, response1.getBody().getUserId());
        assertEquals(1, response1.getBody().getFavorites().size());

        // Verify data was cached
        Optional<UserFavoritesResponse> cachedResponse = cacheService.getCachedUserFavorites(USER_ID);
        assertTrue(cachedResponse.isPresent(), "Response should be cached");
        assertEquals(1, cachedResponse.get().getFavorites().size());

        // Second request - should hit cache
        ResponseEntity<UserFavoritesResponse> response2 = restTemplate.getForEntity(
            baseUrl + "/" + USER_ID,
            UserFavoritesResponse.class
        );

        // Verify second response matches first
        assertEquals(HttpStatus.OK, response2.getStatusCode());
        assertEquals(response1.getBody().getFavorites().size(), response2.getBody().getFavorites().size());
        assertEquals(
            response1.getBody().getFavorites().get(0).getProductId(),
            response2.getBody().getFavorites().get(0).getProductId()
        );
    }

    @Test
    void getUserFavorites_EmptyList() {
        ResponseEntity<UserFavoritesResponse> response = restTemplate.getForEntity(
            baseUrl + "/" + USER_ID,
            UserFavoritesResponse.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(USER_ID, response.getBody().getUserId());
        assertTrue(response.getBody().getFavorites().isEmpty());
    }

    @Test
    void isFavorite_True() {
        // Add favorite
        Favorite favorite = new Favorite(USER_ID, PRODUCT_ID, PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_IMAGE, CATEGORY);
        favoriteRepository.save(favorite);

        ResponseEntity<Map> response = restTemplate.getForEntity(
            baseUrl + "/" + USER_ID + "/" + PRODUCT_ID + "/exists",
            Map.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue((Boolean) response.getBody().get("isFavorite"));
    }

    @Test
    void isFavorite_False() {
        ResponseEntity<Map> response = restTemplate.getForEntity(
            baseUrl + "/" + USER_ID + "/" + PRODUCT_ID + "/exists",
            Map.class
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse((Boolean) response.getBody().get("isFavorite"));
    }
}
