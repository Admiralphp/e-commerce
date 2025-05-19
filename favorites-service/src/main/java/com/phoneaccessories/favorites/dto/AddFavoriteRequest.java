package com.phoneaccessories.favorites.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * DTO for adding a product to favorites.
 */
public class AddFavoriteRequest {

    @NotBlank(message = "Product ID cannot be blank")
    private String productId;

    private String productName;

    @PositiveOrZero(message = "Product price must be positive or zero")
    private Double productPrice;

    private String productImageUrl;

    private String category;

    public AddFavoriteRequest() {}

    public AddFavoriteRequest(String productId, String productName,
                              Double productPrice, String productImageUrl, String category) {
        this.productId = productId;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productImageUrl = productImageUrl;
        this.category = category;
    }

    // Getters and Setters
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

    @Override
    public String toString() {
        return "AddFavoriteRequest{" +
                "productId='" + productId + '\'' +
                ", productName='" + productName + '\'' +
                ", productPrice=" + productPrice +
                ", productImageUrl='" + productImageUrl + '\'' +
                ", category='" + category + '\'' +
                '}';
    }
}