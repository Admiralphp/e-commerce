package com.phoneaccessories.favorites.controller;

import com.phoneaccessories.favorites.dto.AddFavoriteRequest;
import com.phoneaccessories.favorites.dto.FavoriteResponse;
import com.phoneaccessories.favorites.dto.UserFavoritesResponse;
import com.phoneaccessories.favorites.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for managing user favorites.
 */
@RestController
@RequestMapping("/favorites")
@Validated
@Tag(name = "Favorites", description = "User favorites management API")
public class FavoriteController {

    private static final Logger logger = LoggerFactory.getLogger(FavoriteController.class);

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    /**
     * Add a product to user's favorites.
     */
    @PostMapping("/{userId}")
    @Operation(summary = "Add product to favorites", description = "Add a product to user's favorites list")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Product added to favorites successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "409", description = "Product already in favorites")
    })
    public ResponseEntity<FavoriteResponse> addFavorite(
            @Parameter(description = "User ID", required = true)
            @PathVariable @NotBlank String userId,
            @Parameter(description = "Add favorite request", required = true)
            @Valid @RequestBody AddFavoriteRequest request) {

        logger.info("Received request to add favorite for user: {}", userId);

        FavoriteResponse response = favoriteService.addFavorite(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Remove a product from user's favorites.
     */
    @DeleteMapping("/{userId}/{productId}")
    @Operation(summary = "Remove product from favorites", description = "Remove a product from user's favorites list")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Product removed from favorites successfully"),
            @ApiResponse(responseCode = "404", description = "Favorite not found")
    })
    public ResponseEntity<Void> removeFavorite(
            @Parameter(description = "User ID", required = true)
            @PathVariable @NotBlank String userId,
            @Parameter(description = "Product ID", required = true)
            @PathVariable @NotBlank String productId) {

        logger.info("Received request to remove favorite for user: {} and product: {}", userId, productId);

        favoriteService.removeFavorite(userId, productId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all favorite products for a user.
     */
    @GetMapping("/{userId}")
    @Operation(summary = "Get user favorites", description = "Retrieve all favorite products for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User favorites retrieved successfully"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<UserFavoritesResponse> getUserFavorites(
            @Parameter(description = "User ID", required = true)
            @PathVariable @NotBlank String userId) {

        logger.info("Received request to get favorites for user: {}", userId);

        UserFavoritesResponse response = favoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Check if a product is in user's favorites.
     */
    @GetMapping("/{userId}/{productId}/exists")
    @Operation(summary = "Check if product is favorite", description = "Check if a product is in user's favorites")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Check completed successfully")
    })
    public ResponseEntity<Map<String, Boolean>> isFavorite(
            @Parameter(description = "User ID", required = true)
            @PathVariable @NotBlank String userId,
            @Parameter(description = "Product ID", required = true)
            @PathVariable @NotBlank String productId) {

        logger.debug("Received request to check if product {} is favorite for user: {}", productId, userId);

        boolean isFavorite = favoriteService.isFavorite(userId, productId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }

    /**
     * Get the count of favorites for a user.
     */
    @GetMapping("/{userId}/count")
    @Operation(summary = "Get favorites count", description = "Get the count of favorites for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully")
    })
    public ResponseEntity<Map<String, Long>> getFavoriteCount(
            @Parameter(description = "User ID", required = true)
            @PathVariable @NotBlank String userId) {

        logger.debug("Received request to get favorite count for user: {}", userId);

        long count = favoriteService.getFavoriteCount(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Remove all favorites for a user.
     */
    @DeleteMapping("/{userId}")
    @Operation(summary = "Remove all favorites", description = "Remove all favorites for a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "All favorites removed successfully")
    })
    public ResponseEntity<Map<String, Long>> removeAllFavorites(
            @Parameter(description = "User ID", required = true)
            @PathVariable @NotBlank String userId) {

        logger.info("Received request to remove all favorites for user: {}", userId);

        long deletedCount = favoriteService.removeAllFavorites(userId);
        return ResponseEntity.ok(Map.of("deletedCount", deletedCount));
    }
}
