package com.phoneaccessories.favorites.exception;

/**
 * Exception thrown when a favorite is not found.
 */
public class FavoriteNotFoundException extends RuntimeException {

    public FavoriteNotFoundException(String message) {
        super(message);
    }

    public FavoriteNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
