package repository

import (
	"errors"
	"math"
	"strings"

	"github.com/google/uuid"
	"github.com/yourusername/product-catalog-service/db"
	"github.com/yourusername/product-catalog-service/models"
	"gorm.io/gorm"
)

// ProductRepository handles database operations for products
type ProductRepository struct {
	DB *gorm.DB
}

// NewProductRepository creates a new product repository
func NewProductRepository() *ProductRepository {
	return &ProductRepository{
		DB: db.GetDB(),
	}
}

// GetAll returns all products with optional filtering
func (r *ProductRepository) GetAll(filter models.ProductFilter) (*models.ProductResponse, error) {
	var products []models.Product
	var totalItems int64

	// Set default pagination values
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.Limit < 1 || filter.Limit > 100 {
		filter.Limit = 10
	}

	// Base query
	query := r.DB.Model(&models.Product{})

	// Apply filters
	if filter.Category != "" {
		query = query.Where("category = ?", filter.Category)
	}
	if filter.MinPrice != nil {
		query = query.Where("price >= ?", *filter.MinPrice)
	}
	if filter.MaxPrice != nil {
		query = query.Where("price <= ?", *filter.MaxPrice)
	}
	if filter.Search != "" {
		search := "%" + strings.ToLower(filter.Search) + "%"
		query = query.Where("LOWER(name) LIKE ? OR LOWER(description) LIKE ?", search, search)
	}

	// Count total results
	if err := query.Count(&totalItems).Error; err != nil {
		return nil, err
	}

	// Apply sorting
	if filter.SortBy != "" {
		direction := "ASC"
		if strings.ToUpper(filter.SortDir) == "DESC" {
			direction = "DESC"
		}
		query = query.Order(filter.SortBy + " " + direction)
	} else {
		query = query.Order("created_at DESC")
	}

	// Apply pagination
	offset := (filter.Page - 1) * filter.Limit
	if err := query.Offset(offset).Limit(filter.Limit).Find(&products).Error; err != nil {
		return nil, err
	}

	// Calculate total pages
	totalPages := int(math.Ceil(float64(totalItems) / float64(filter.Limit)))

	return &models.ProductResponse{
		Items:      products,
		TotalItems: totalItems,
		TotalPages: totalPages,
		Page:       filter.Page,
		Limit:      filter.Limit,
	}, nil
}

// GetByID returns a product by its ID
func (r *ProductRepository) GetByID(id uuid.UUID) (*models.Product, error) {
	var product models.Product
	if err := r.DB.First(&product, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("product not found")
		}
		return nil, err
	}
	return &product, nil
}

// Create adds a new product
func (r *ProductRepository) Create(product *models.Product) error {
	return r.DB.Create(product).Error
}

// Update modifies an existing product
func (r *ProductRepository) Update(product *models.Product) error {
	return r.DB.Save(product).Error
}

// Delete removes a product by its ID
func (r *ProductRepository) Delete(id uuid.UUID) error {
	return r.DB.Delete(&models.Product{}, "id = ?", id).Error
}

// GetCategories returns all unique categories
func (r *ProductRepository) GetCategories() ([]string, error) {
	var categories []string
	if err := r.DB.Model(&models.Product{}).Distinct().Pluck("category", &categories).Error; err != nil {
		return nil, err
	}
	return categories, nil
}