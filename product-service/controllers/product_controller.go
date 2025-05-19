package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/yourusername/product-catalog-service/models"
	"github.com/yourusername/product-catalog-service/repository"
)

// ProductController handles product-related requests
type ProductController struct {
	repo *repository.ProductRepository
}

// NewProductController creates a new product controller
func NewProductController() *ProductController {
	return &ProductController{
		repo: repository.NewProductRepository(),
	}
}

// GetAll returns all products with optional filtering
func (c *ProductController) GetAll(ctx *fiber.Ctx) error {
	var filter models.ProductFilter
	if err := ctx.QueryParser(&filter); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid query parameters")
	}

	response, err := c.repo.GetAll(filter)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return ctx.JSON(response)
}

// GetByID returns a product by its ID
func (c *ProductController) GetByID(ctx *fiber.Ctx) error {
	id, err := uuid.Parse(ctx.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid product ID")
	}

	product, err := c.repo.GetByID(id)
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, err.Error())
	}

	return ctx.JSON(product)
}

// Create adds a new product
func (c *ProductController) Create(ctx *fiber.Ctx) error {
	var productData models.ProductCreate
	if err := ctx.BodyParser(&productData); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	product := models.Product{
		Name:        productData.Name,
		Description: productData.Description,
		Price:       productData.Price,
		Category:    productData.Category,
		ImageURL:    productData.ImageURL,
		Stock:       productData.Stock,
	}

	if err := c.repo.Create(&product); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return ctx.Status(fiber.StatusCreated).JSON(product)
}

// Update modifies an existing product
func (c *ProductController) Update(ctx *fiber.Ctx) error {
	id, err := uuid.Parse(ctx.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid product ID")
	}

	product, err := c.repo.GetByID(id)
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, err.Error())
	}

	var updateData models.ProductUpdate
	if err := ctx.BodyParser(&updateData); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	// Update fields if provided
	if updateData.Name != nil {
		product.Name = *updateData.Name
	}
	if updateData.Description != nil {
		product.Description = *updateData.Description
	}
	if updateData.Price != nil {
		product.Price = *updateData.Price
	}
	if updateData.Category != nil {
		product.Category = *updateData.Category
	}
	if updateData.ImageURL != nil {
		product.ImageURL = *updateData.ImageURL
	}
	if updateData.Stock != nil {
		product.Stock = *updateData.Stock
	}

	if err := c.repo.Update(product); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return ctx.JSON(product)
}

// Delete removes a product
func (c *ProductController) Delete(ctx *fiber.Ctx) error {
	id, err := uuid.Parse(ctx.Params("id"))
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid product ID")
	}

	if err := c.repo.Delete(id); err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}

// GetCategories returns all unique categories
func (c *ProductController) GetCategories(ctx *fiber.Ctx) error {
	categories, err := c.repo.GetCategories()
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, err.Error())
	}

	return ctx.JSON(fiber.Map{
		"categories": categories,
	})
}