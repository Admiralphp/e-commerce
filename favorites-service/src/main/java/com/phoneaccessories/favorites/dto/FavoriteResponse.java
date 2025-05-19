package com.phoneaccessories.favorites.dto;

import java.time.LocalDateTime;

/**
 * DTO for favorite product response.
 */
public class FavoriteResponse {

    private String favoriteId;
    private String productId;
    private String productName;
    private Double productPrice;
    private String productImageUrl;
    private String category;
    private LocalDateTime createdAt;

    public FavoriteResponse() {}

    public FavoriteResponse(String favoriteId, String productId, String productName,
                            Double productPrice, String productImageUrl, String category,
                            LocalDateTime createdAt) {
        this.favoriteId = favoriteId;
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productImageUrl = productImageUrl;
        this.category = category;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getFavoriteId() {
        return favoriteId;
    }

    public void setFavoriteId(String favoriteId) {
        this.favoriteId = favoriteId;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getProductPrice() {
        return productPrice;
    }

    public void setProductPrice(Double productPrice) {
        this.productPrice = productPrice;
    }

    public String getProductImageUrl() {
        return productImageUrl;
    }

    public void setProductImageUrl(String productImageUrl) {
        this.productImageUrl = productImageUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "FavoriteResponse{" +
                "favoriteId='" + favoriteId + '\'' +
                ", productId='" + productId + '\'' +
                ", productName='" + productName + '\'' +
                ", productPrice=" + productPrice +
                ", productImageUrl='" + productImageUrl + '\'' +
                ", category='" + category + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}