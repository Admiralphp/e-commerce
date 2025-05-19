package middleware

import (
	"errors"
	"strings"

	"github.com/gofiber/fiber/v2"
	jwtmiddleware "github.com/gofiber/jwt/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/yourusername/product-catalog-service/config"
)

// Protected creates middleware that requires a valid JWT token
func Protected(cfg *config.Config) fiber.Handler {
	return jwtmiddleware.New(jwtmiddleware.Config{
		SigningKey:   []byte(cfg.JWTSecret),
		ErrorHandler: jwtError,
		AuthScheme:   "Bearer",
	})
}

// jwtError handles JWT errors
func jwtError(c *fiber.Ctx, err error) error {
	if err.Error() == "Missing or malformed JWT" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing or malformed JWT token",
		})
	}
	return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
		"error": "Invalid or expired JWT token",
	})
}

// IsAdmin checks if the user has admin role
func IsAdmin(c *fiber.Ctx) error {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	role := claims["role"].(string)

	if role != "admin" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Admin access required",
		})
	}

	return c.Next()
}

// ExtractToken extracts the token from the authorization header
func ExtractToken(authHeader string) (string, error) {
	if authHeader == "" {
		return "", errors.New("authorization header is required")
	}

	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return "", errors.New("authorization header format must be Bearer {token}")
	}

	return parts[1], nil
}

// GenerateToken generates a new JWT token
func GenerateToken(username string, role string, cfg *config.Config) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["username"] = username
	claims["role"] = role

	return token.SignedString([]byte(cfg.JWTSecret))
}