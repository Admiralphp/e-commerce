package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/yourusername/product-catalog-service/config"
	"github.com/yourusername/product-catalog-service/controllers"
	"github.com/yourusername/product-catalog-service/middleware"
)

// SetupRoutes configures all the routes for the application
func SetupRoutes(app *fiber.App) {
	// Load config for middleware
	cfg, _ := config.LoadConfig()

	// Initialize controllers
	productController := controllers.NewProductController()
	authController := controllers.NewAuthController(cfg)

	// API routes
	api := app.Group("/api")

	// Auth routes
	auth := api.Group("/auth")
	auth.Post("/login", authController.Login)

	// Public product routes
	products := api.Group("/products")
	products.Get("/", productController.GetAll)
	products.Get("/categories", productController.GetCategories)
	products.Get("/:id", productController.GetByID)

	// Protected product routes (admin only)
	admin := api.Group("/admin")
	admin.Use(middleware.Protected(cfg))
	admin.Use(middleware.IsAdmin)
	
	adminProducts := admin.Group("/products")
	adminProducts.Post("/", productController.Create)
	adminProducts.Put("/:id", productController.Update)
	adminProducts.Delete("/:id", productController.Delete)

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status": "ok",
		})
	})
}