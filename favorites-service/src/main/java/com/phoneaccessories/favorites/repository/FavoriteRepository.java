package com.phoneaccessories.favorites.repository;

import com.phoneaccessories.favorites.model.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Favorite entity.
 */
@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, String> {

    /**
     * Find all favorites for a specific user.
     *
     * @param userId the user ID
     * @return list of favorites for the user
     */
    List<Favorite> findByUserId(String userId);

    /**
     * Find a specific favorite by user ID and product ID.
     *
     * @param userId the user ID
     * @param productId the product ID
     * @return the favorite if found
     */
    Optional<Favorite> findByUserIdAndProductId(String userId, String productId);

    /**
     * Check if a favorite exists for a user and product.
     *
     * @param userId the user ID
     * @param productId the product ID
     * @return true if favorite exists, false otherwise
     */
    boolean existsByUserIdAndProductId(String userId, String productId);

    /**
     * Delete a favorite by user ID and product ID.
     *
     * @param userId the user ID
     * @param productId the product ID
     * @return number of deleted documents
     */
    long deleteByUserIdAndProductId(String userId, String productId);

    /**
     * Count favorites for a specific user.
     *
     * @param userId the user ID
     * @return count of favorites for the user
     */
    long countByUserId(String userId);

    /**
     * Find favorites by user ID ordered by creation date descending.
     *
     * @param userId the user ID
     * @return list of favorites ordered by creation date
     */
    @Query("{'user_id': ?0}")
    List<Favorite> findByUserIdOrderByCreatedAtDesc(String userId);

    /**
     * Delete all favorites for a specific user.
     *
     * @param userId the user ID
     * @return number of deleted documents
     */
    long deleteByUserId(String userId);
}
