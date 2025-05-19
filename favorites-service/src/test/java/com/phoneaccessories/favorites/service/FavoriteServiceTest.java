package com.phoneaccessories.favorites.service;

import com.phoneaccessories.favorites.dto.AddFavoriteRequest;
import com.phoneaccessories.favorites.dto.FavoriteResponse;
import com.phoneaccessories.favorites.dto.UserFavoritesResponse;
import com.phoneaccessories.favorites.exception.DuplicateFavoriteException;
import com.phoneaccessories.favorites.exception.FavoriteNotFoundException;
import com.phoneaccessories.favorites.model.Favorite;
import com.phoneaccessories.favorites.repository.FavoriteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private CacheService cacheService;

    @InjectMocks
    private FavoriteService favoriteService;

    private Favorite testFavorite;
    private AddFavoriteRequest testRequest;
    private static final String USER_ID = "test-user-id";
    private static final String PRODUCT_ID = "test-product-id";
    private static final String PRODUCT_NAME = "Test Product";
    private static final double PRODUCT_PRICE = 99.99;
    private static final String PRODUCT_IMAGE = "http://example.com/image.jpg";
    private static final String CATEGORY = "Test Category";

    @BeforeEach
    void setUp() {
        // Setup test favorite
        testFavorite = new Favorite(USER_ID, PRODUCT_ID, PRODUCT_NAME, PRODUCT_PRICE, PRODUCT_IMAGE, CATEGORY);
        testFavorite.setId("test-favorite-id");
        testFavorite.setCreatedAt(LocalDateTime.now());

        // Setup test request
        testRequest = new AddFavoriteRequest();
        testRequest.setProductId(PRODUCT_ID);
        testRequest.setProductName(PRODUCT_NAME);
        testRequest.setProductPrice(PRODUCT_PRICE);
        testRequest.setProductImageUrl(PRODUCT_IMAGE);
        testRequest.setCategory(CATEGORY);
    }

    @Test
    void addFavorite_Success() {
        when(favoriteRepository.existsByUserIdAndProductId(USER_ID, PRODUCT_ID)).thenReturn(false);
        when(favoriteRepository.save(any(Favorite.class))).thenReturn(testFavorite);

        FavoriteResponse response = favoriteService.addFavorite(USER_ID, testRequest);

        assertNotNull(response);
        assertEquals(PRODUCT_ID, response.getProductId());
        assertEquals(USER_ID, response.getUserId());
        assertEquals(PRODUCT_NAME, response.getProductName());
        assertEquals(PRODUCT_PRICE, response.getProductPrice());
        assertEquals(PRODUCT_IMAGE, response.getProductImageUrl());
        assertEquals(CATEGORY, response.getCategory());
        verify(cacheService).invalidateUserFavorites(USER_ID);
    }

    @Test
    void addFavorite_DuplicateProduct() {
        when(favoriteRepository.existsByUserIdAndProductId(USER_ID, PRODUCT_ID)).thenReturn(true);

        assertThrows(DuplicateFavoriteException.class, () -> 
            favoriteService.addFavorite(USER_ID, testRequest)
        );

        verify(favoriteRepository, never()).save(any());
        verify(cacheService, never()).invalidateUserFavorites(any());
    }

    @Test
    void removeFavorite_Success() {
        when(favoriteRepository.findByUserIdAndProductId(USER_ID, PRODUCT_ID))
            .thenReturn(Optional.of(testFavorite));

        favoriteService.removeFavorite(USER_ID, PRODUCT_ID);

        verify(favoriteRepository).delete(testFavorite);
        verify(cacheService).invalidateUserFavorites(USER_ID);
    }

    @Test
    void removeFavorite_NotFound() {
        when(favoriteRepository.findByUserIdAndProductId(USER_ID, PRODUCT_ID))
            .thenReturn(Optional.empty());

        assertThrows(FavoriteNotFoundException.class, () -> 
            favoriteService.removeFavorite(USER_ID, PRODUCT_ID)
        );

        verify(favoriteRepository, never()).delete(any());
        verify(cacheService, never()).invalidateUserFavorites(any());
    }

    @Test
    void getUserFavorites_FromCache() {
        // Setup cache hit
        UserFavoritesResponse cachedResponse = new UserFavoritesResponse(
            USER_ID,
            Arrays.asList(new FavoriteResponse(
                testFavorite.getId(),
                testFavorite.getUserId(),
                testFavorite.getProductId(),
                testFavorite.getProductName(),
                testFavorite.getProductPrice(),
                testFavorite.getProductImageUrl(),
                testFavorite.getCategory(),
                testFavorite.getCreatedAt()
            ))
        );
        when(cacheService.getCachedUserFavorites(USER_ID)).thenReturn(Optional.of(cachedResponse));

        UserFavoritesResponse response = favoriteService.getUserFavorites(USER_ID);

        assertNotNull(response);
        assertEquals(USER_ID, response.getUserId());
        assertEquals(1, response.getFavorites().size());
        verify(favoriteRepository, never()).findByUserId(any());
    }

    @Test
    void getUserFavorites_FromDatabase() {
        // Setup cache miss
        when(cacheService.getCachedUserFavorites(USER_ID)).thenReturn(Optional.empty());
        when(favoriteRepository.findByUserId(USER_ID)).thenReturn(Arrays.asList(testFavorite));

        UserFavoritesResponse response = favoriteService.getUserFavorites(USER_ID);

        assertNotNull(response);
        assertEquals(USER_ID, response.getUserId());
        assertEquals(1, response.getFavorites().size());
        assertEquals(PRODUCT_ID, response.getFavorites().get(0).getProductId());
        verify(cacheService).cacheUserFavorites(eq(USER_ID), any(UserFavoritesResponse.class));
    }

    @Test
    void getUserFavorites_EmptyList() {
        when(cacheService.getCachedUserFavorites(USER_ID)).thenReturn(Optional.empty());
        when(favoriteRepository.findByUserId(USER_ID)).thenReturn(List.of());

        UserFavoritesResponse response = favoriteService.getUserFavorites(USER_ID);

        assertNotNull(response);
        assertEquals(USER_ID, response.getUserId());
        assertTrue(response.getFavorites().isEmpty());
        verify(cacheService).cacheUserFavorites(eq(USER_ID), any(UserFavoritesResponse.class));
    }

    @Test
    void isFavorite_True() {
        when(favoriteRepository.existsByUserIdAndProductId(USER_ID, PRODUCT_ID)).thenReturn(true);

        boolean result = favoriteService.isFavorite(USER_ID, PRODUCT_ID);

        assertTrue(result);
    }

    @Test
    void isFavorite_False() {
        when(favoriteRepository.existsByUserIdAndProductId(USER_ID, PRODUCT_ID)).thenReturn(false);

        boolean result = favoriteService.isFavorite(USER_ID, PRODUCT_ID);

        assertFalse(result);
    }
}
