package com.phoneaccessories.favorites.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Entity representing a user's favorite product.
 */
@Document(collection = "favorites")
public class Favorite {

    @Id
    private String id;

    @NotBlank(message = "User ID cannot be blank")
    @Indexed
    @Field("user_id")
    private String userId;

    @NotBlank(message = "Product ID cannot be blank")
    @Field("product_id")
    private String productId;

    @NotNull(message = "Created date cannot be null")
    @Field("created_at")
    private LocalDateTime createdAt;

    // Product information for caching purposes
    @Field("product_name")
    private String productName;

    @Field("product_price")
    private Double productPrice;

    @Field("product_image_url")
    private String productImageUrl;

    @Field("category")
    private String category;

    public Favorite() {
        this.createdAt = LocalDateTime.now();
    }

    public Favorite(String userId, String productId) {
        this();
        this.userId = userId;
        this.productId = productId;
    }

    public Favorite(String userId, String productId, String productName,
                    Double productPrice, String productImageUrl, String category) {
        this(userId, productId);
        this.productName = productName;
        this.productPrice = productPrice;
        this.productImageUrl = productImageUrl;
        this.category = category;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
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
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Favorite favorite = (Favorite) o;
        return Objects.equals(userId, favorite.userId) &&
                Objects.equals(productId, favorite.productId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, productId);
    }

    @Override
    public String toString() {
        return "Favorite{" +
                "id='" + id + '\'' +
                ", userId='" + userId + '\'' +
                ", productId='" + productId + '\'' +
                ", createdAt=" + createdAt +
                ", productName='" + productName + '\'' +
                ", productPrice=" + productPrice +
                ", category='" + category + '\'' +
                '}';
    }
}