package com.phoneaccessories.favorites.dto;

import java.util.List;

/**
 * DTO for user favorites response.
 */
public class UserFavoritesResponse {

    private String userId;
    private int totalCount;
    private List<FavoriteResponse> favorites;

    public UserFavoritesResponse() {}

    public UserFavoritesResponse(String userId, int totalCount, List<FavoriteResponse> favorites) {
        this.userId = userId;
        this.totalCount = totalCount;
        this.favorites = favorites;
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public List<FavoriteResponse> getFavorites() {
        return favorites;
    }

    public void setFavorites(List<FavoriteResponse> favorites) {
        this.favorites = favorites;
        this.totalCount = favorites != null ? favorites.size() : 0;
    }

    @Override
    public String toString() {
        return "UserFavoritesResponse{" +
                "userId='" + userId + '\'' +
                ", totalCount=" + totalCount +
                ", favorites=" + favorites +
                '}';
    }
}
