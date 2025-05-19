package com.phoneaccessories.favorites.service;

import com.phoneaccessories.favorites.dto.AddFavoriteRequest;
import com.phoneaccessories.favorites.dto.FavoriteResponse;
import com.phoneaccessories.favorites.dto.UserFavoritesResponse;
import com.phoneaccessories.favorites.exception.DuplicateFavoriteException;
import com.phoneaccessories.favorites.exception.FavoriteNotFoundException;
import com.phoneaccessories.favorites.model.Favorite;
import com.phoneaccessories.favorites.repository.FavoriteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {
    private static final Logger logger = LoggerFactory.getLogger(FavoriteService.class);

    private final FavoriteRepository favoriteRepository;
    private final CacheService cacheService;

    public FavoriteService(FavoriteRepository favoriteRepository, CacheService cacheService) {
        this.favoriteRepository = favoriteRepository;
        this.cacheService = cacheService;
    }

    /**
     * Add a product to user's favorites.
     */
    @Transactional
    public FavoriteResponse addFavorite(String userId, AddFavoriteRequest request) {
        logger.debug("Adding product {} to favorites for user {}", request.getProductId(), userId);

        // Check if the product is already in favorites
        if (favoriteRepository.existsByUserIdAndProductId(userId, request.getProductId())) {
            throw new DuplicateFavoriteException("Product is already in favorites");
        }

        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setProductId(request.getProductId());
        favorite.setProductName(request.getProductName());
        favorite.setProductPrice(request.getProductPrice());
        favorite.setProductImageUrl(request.getProductImageUrl());
        favorite.setCategory(request.getCategory());

        Favorite savedFavorite = favoriteRepository.save(favorite);

        // Invalidate cache
        cacheService.invalidateUserFavorites(userId);

        return mapToFavoriteResponse(savedFavorite);
    }

    /**
     * Remove a product from user's favorites.
     */
    @Transactional
    public void removeFavorite(String userId, String productId) {
        logger.debug("Removing product {} from favorites for user {}", productId, userId);

        Favorite favorite = favoriteRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new FavoriteNotFoundException("Favorite not found"));

        favoriteRepository.delete(favorite);

        // Invalidate cache
        cacheService.invalidateUserFavorites(userId);
    }

    /**
     * Get all favorite products for a user.
     */
    @Transactional(readOnly = true)
    public UserFavoritesResponse getUserFavorites(String userId) {
        logger.debug("Retrieving favorites for user {}", userId);

        // Try to get from cache first
        return cacheService.getUserFavorites(userId)
                .orElseGet(() -> {
                    List<Favorite> favorites = favoriteRepository.findByUserId(userId);
                    UserFavoritesResponse response = new UserFavoritesResponse(
                            userId,
                            favorites.stream()
                                    .map(this::mapToFavoriteResponse)
                                    .collect(Collectors.toList())
                    );
                    
                    // Cache the response
                    cacheService.cacheUserFavorites(userId, response);
                    
                    return response;
                });
    }

    private FavoriteResponse mapToFavoriteResponse(Favorite favorite) {
        return new FavoriteResponse(
                favorite.getId(),
                favorite.getUserId(),
                favorite.getProductId(),
                favorite.getProductName(),
                favorite.getProductPrice(),
                favorite.getProductImageUrl(),
                favorite.getCategory(),
                favorite.getCreatedAt()
        );
    }
}
