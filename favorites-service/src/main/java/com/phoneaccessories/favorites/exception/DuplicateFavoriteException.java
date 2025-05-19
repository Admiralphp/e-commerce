package com.phoneaccessories.favorites.exception;

/**
 * Exception thrown when trying to add a duplicate favorite.
 */
public class DuplicateFavoriteException extends RuntimeException {

    public DuplicateFavoriteException(String message) {
        super(message);
    }

    public DuplicateFavoriteException(String message, Throwable cause) {
        super(message, cause);
    }
}
