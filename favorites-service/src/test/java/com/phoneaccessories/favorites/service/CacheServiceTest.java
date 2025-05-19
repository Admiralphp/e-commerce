package com.phoneaccessories.favorites.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.phoneaccessories.favorites.dto.FavoriteResponse;
import com.phoneaccessories.favorites.dto.UserFavoritesResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CacheServiceTest {

    @Mock
    private RedisTemplate<String, String> redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    private CacheService cacheService;
    private ObjectMapper objectMapper;
    private static final String USER_ID = "test-user-id";

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.findAndRegisterModules(); // For LocalDateTime serialization
        
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        
        cacheService = new CacheService(
            redisTemplate,
            objectMapper,
            "test:",
            300 // 5 minutes TTL
        );
    }

    @Test
    void cacheUserFavorites_Success() throws Exception {
        // Prepare test data
        FavoriteResponse favorite = new FavoriteResponse(
            "test-id",
            USER_ID,
            "test-product",
            "Test Product",
            99.99,
            "http://example.com/image.jpg",
            "Test Category",
            LocalDateTime.now()
        );
        UserFavoritesResponse favoritesResponse = new UserFavoritesResponse(
            USER_ID,
            Arrays.asList(favorite)
        );

        // Cache the favorites
        cacheService.cacheUserFavorites(USER_ID, favoritesResponse);

        // Verify that Redis operations were called
        verify(valueOperations).set(
            eq("test:user:" + USER_ID + ":favorites"),
            any(String.class),
            any()
        );
    }

    @Test
    void getUserFavorites_CacheHit() throws Exception {
        // Prepare test data
        FavoriteResponse favorite = new FavoriteResponse(
            "test-id",
            USER_ID,
            "test-product",
            "Test Product",
            99.99,
            "http://example.com/image.jpg",
            "Test Category",
            LocalDateTime.now()
        );
        UserFavoritesResponse expectedResponse = new UserFavoritesResponse(
            USER_ID,
            Arrays.asList(favorite)
        );

        // Mock Redis response
        when(valueOperations.get(anyString()))
            .thenReturn(objectMapper.writeValueAsString(expectedResponse));

        // Get from cache
        Optional<UserFavoritesResponse> result = cacheService.getUserFavorites(USER_ID);

        // Verify
        assertTrue(result.isPresent());
        assertEquals(USER_ID, result.get().getUserId());
        assertEquals(1, result.get().getFavorites().size());
        assertEquals("test-product", result.get().getFavorites().get(0).getProductId());
    }

    @Test
    void getUserFavorites_CacheMiss() {
        // Mock Redis response
        when(valueOperations.get(anyString())).thenReturn(null);

        // Get from cache
        Optional<UserFavoritesResponse> result = cacheService.getUserFavorites(USER_ID);

        // Verify
        assertFalse(result.isPresent());
    }

    @Test
    void invalidateUserFavorites_Success() {
        // Invalidate cache
        cacheService.invalidateUserFavorites(USER_ID);

        // Verify that Redis delete operation was called
        verify(redisTemplate).delete("test:user:" + USER_ID + ":favorites");
    }

    @Test
    void cacheUserFavorites_HandlesJsonProcessingException() throws Exception {
        // Prepare test data that will cause serialization to fail
        UserFavoritesResponse response = mock(UserFavoritesResponse.class);
        when(response.getUserId()).thenThrow(new RuntimeException("Test exception"));

        // Cache the favorites
        cacheService.cacheUserFavorites(USER_ID, response);

        // Verify that no Redis operations were performed
        verify(valueOperations, never()).set(any(), any(), any());
    }
}
