package com.phoneaccessories.favorites.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.phoneaccessories.favorites.dto.FavoriteResponse;
import com.phoneaccessories.favorites.dto.UserFavoritesResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

/**
 * Service for Redis caching operations.
 */
@Service
public class CacheService {

    private static final Logger logger = LoggerFactory.getLogger(CacheService.class);

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    private final String keyPrefix;
    private final Duration ttl;

    public CacheService(RedisTemplate<String, String> redisTemplate,
                        ObjectMapper objectMapper,
                        @Value("${cache.redis.key-prefix}") String keyPrefix,
                        @Value("${cache.redis.ttl}") long ttlSeconds) {
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
        this.keyPrefix = keyPrefix;
        this.ttl = Duration.ofSeconds(ttlSeconds);
    }

    /**
     * Cache user favorites.
     *
     * @param userId the user ID
     * @param favorites list of user favorites
     */
    public void cacheUserFavorites(String userId, List<FavoriteResponse> favorites) {
        try {
            String key = buildKey("user", userId, "favorites");
            UserFavoritesResponse response = new UserFavoritesResponse(userId, favorites.size(), favorites);
            String value = objectMapper.writeValueAsString(response);
            redisTemplate.opsForValue().set(key, value, ttl);
            logger.debug("Cached favorites for user: {}", userId);
        } catch (JsonProcessingException e) {
            logger.error("Error serializing favorites for caching: {}", e.getMessage());
        }
    }

    /**
     * Get cached user favorites.
     *
     * @param userId the user ID
     * @return cached user favorites or null if not found
     */
    public UserFavoritesResponse getCachedUserFavorites(String userId) {
        try {
            String key = buildKey("user", userId, "favorites");
            String value = redisTemplate.opsForValue().get(key);

            if (value != null) {
                logger.debug("Cache hit for user favorites: {}", userId);
                return objectMapper.readValue(value, UserFavoritesResponse.class);
            }

            logger.debug("Cache miss for user favorites: {}", userId);
            return null;
        } catch (JsonProcessingException e) {
            logger.error("Error deserializing cached favorites: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Cache favorite existence check.
     *
     * @param userId the user ID
     * @param productId the product ID
     * @param exists whether the favorite exists
     */
    public void cacheFavoriteExists(String userId, String productId, boolean exists) {
        String key = buildKey("favorite", "exists", userId, productId);
        redisTemplate.opsForValue().set(key, String.valueOf(exists), ttl);
        logger.debug("Cached favorite existence for user {} and product {}: {}", userId, productId, exists);
    }

    /**
     * Get cached favorite existence.
     *
     * @param userId the user ID
     * @param productId the product ID
     * @return cached favorite existence or null if not found
     */
    public Boolean getCachedFavoriteExists(String userId, String productId) {
        String key = buildKey("favorite", "exists", userId, productId);
        String value = redisTemplate.opsForValue().get(key);

        if (value != null) {
            logger.debug("Cache hit for favorite exists: user {} product {}", userId, productId);
            return Boolean.valueOf(value);
        }

        logger.debug("Cache miss for favorite exists: user {} product {}", userId, productId);
        return null;
    }

    /**
     * Evict user favorites cache.
     *
     * @param userId the user ID
     */
    public void evictUserFavoritesCache(String userId) {
        String key = buildKey("user", userId, "favorites");
        redisTemplate.delete(key);
        logger.debug("Evicted favorites cache for user: {}", userId);
    }

    /**
     * Evict favorite existence cache.
     *
     * @param userId the user ID
     * @param productId the product ID
     */
    public void evictFavoriteExistsCache(String userId, String productId) {
        String key = buildKey("favorite", "exists", userId, productId);
        redisTemplate.delete(key);
        logger.debug("Evicted favorite exists cache for user {} and product {}", userId, productId);
    }

    /**
     * Evict all cache entries for a user.
     *
     * @param userId the user ID
     */
    public void evictAllUserCache(String userId) {
        String pattern = buildKey("*", userId, "*");
        redisTemplate.delete(redisTemplate.keys(pattern));
        logger.debug("Evicted all cache entries for user: {}", userId);
    }

    /**
     * Build cache key.
     *
     * @param parts key parts
     * @return formatted cache key
     */
    private String buildKey(String... parts) {
        return keyPrefix + ":" + String.join(":", parts);
    }

    /**
     * Check if Redis is available.
     *
     * @return true if Redis is available, false otherwise
     */
    public boolean isRedisAvailable() {
        try {
            redisTemplate.opsForValue().get("health-check");
            return true;
        } catch (Exception e) {
            logger.warn("Redis is not available: {}", e.getMessage());
            return false;
        }
    }
}