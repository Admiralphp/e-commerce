package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Product represents a product in the catalog
type Product struct {
	ID          uuid.UUID      `gorm:"type:uuid;primary_key" json:"id"`
	Name        string         `gorm:"size:255;not null" json:"name"`
	Description string         `gorm:"type:text" json:"description"`
	Price       float64        `gorm:"not null" json:"price"`
	Category    string         `gorm:"size:100;not null;index" json:"category"`
	ImageURL    string         `gorm:"size:255" json:"image_url"`
	Stock       int            `gorm:"not null" json:"stock"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

// BeforeCreate will set a UUID rather than numeric ID
func (p *Product) BeforeCreate(tx *gorm.DB) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return nil
}

// ProductFilter represents filtering options for products
type ProductFilter struct {
	Category string   `query:"category"`
	MinPrice *float64 `query:"min_price"`
	MaxPrice *float64 `query:"max_price"`
	Search   string   `query:"search"`
	SortBy   string   `query:"sort_by"`
	SortDir  string   `query:"sort_dir"`
	Page     int      `query:"page"`
	Limit    int      `query:"limit"`
}

// ProductResponse represents a paginated product response
type ProductResponse struct {
	Items      []Product `json:"items"`
	TotalItems int64     `json:"total_items"`
	TotalPages int       `json:"total_pages"`
	Page       int       `json:"page"`
	Limit      int       `json:"limit"`
}

// ProductCreate represents the data needed to create a product
type ProductCreate struct {
	Name        string  `json:"name" validate:"required,min=2,max=100"`
	Description string  `json:"description" validate:"required"`
	Price       float64 `json:"price" validate:"required,gt=0"`
	Category    string  `json:"category" validate:"required,min=2,max=50"`
	ImageURL    string  `json:"image_url" validate:"required,url"`
	Stock       int     `json:"stock" validate:"required,gte=0"`
}

// ProductUpdate represents the data needed to update a product
type ProductUpdate struct {
	Name        *string  `json:"name" validate:"omitempty,min=2,max=100"`
	Description *string  `json:"description"`
	Price       *float64 `json:"price" validate:"omitempty,gt=0"`
	Category    *string  `json:"category" validate:"omitempty,min=2,max=50"`
	ImageURL    *string  `json:"image_url" validate:"omitempty,url"`
	Stock       *int     `json:"stock" validate:"omitempty,gte=0"`
}