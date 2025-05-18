package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/yourusername/product-catalog-service/config"
	"github.com/yourusername/product-catalog-service/middleware"
)

// AuthController handles authentication related requests
type AuthController struct {
	config *config.Config
}

// NewAuthController creates a new auth controller
func NewAuthController(cfg *config.Config) *AuthController {
	return &AuthController{
		config: cfg,
	}
}

// Login authenticates a user and returns a JWT token
func (c *AuthController) Login(ctx *fiber.Ctx) error {
	type LoginRequest struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var req LoginRequest
	if err := ctx.BodyParser(&req); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	// Validate credentials (in a real app, this would use a database)
	if req.Username != c.config.AdminUsername || req.Password != c.config.AdminPassword {
		return fiber.NewError(fiber.StatusUnauthorized, "Invalid credentials")
	}

	// Generate token
	token, err := middleware.GenerateToken(req.Username, "admin", c.config)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Could not generate token")
	}

	return ctx.JSON(fiber.Map{
		"token": token,
	})
}