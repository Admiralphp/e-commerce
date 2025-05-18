package db

import (
	"database/sql"
	"fmt"
	"os"
	_ "github.com/lib/pq"  // postgres driver
	"github.com/yourusername/product-catalog-service/config"
	"github.com/yourusername/product-catalog-service/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// InitDatabase initializes the database connection
func InitDatabase(cfg *config.Config) error {
	// Get database connection details from config
	dbHost := cfg.DBHost
	dbUser := cfg.DBUser
	dbPassword := cfg.DBPassword
	dbName := cfg.DBName
	dbPort := cfg.DBPort
	
	// First, connect to the default 'postgres' database to create our database
	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/postgres?sslmode=disable", 
		dbUser, dbPassword, dbHost, dbPort)
	
	sqlDB, err := sql.Open("postgres", dsn)
	if err != nil {
		return fmt.Errorf("failed to connect to default database: %v", err)
	}
	defer sqlDB.Close()

	// Check if database exists
	var exists bool
	err = sqlDB.QueryRow("SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = 'product_catalog')").Scan(&exists)
	if err != nil {
		return fmt.Errorf("failed to check if database exists: %v", err)
	}

	// Create database if it doesn't exist
	if !exists {
		_, err = sqlDB.Exec("CREATE DATABASE product_catalog")
		if err != nil {
			return fmt.Errorf("failed to create database: %v", err)
		}
		fmt.Println("Database 'product_catalog' created successfully")
	}

	// Now connect to our new database
	dsn = fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", 
		dbUser, dbPassword, dbHost, dbPort, dbName)
	
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return fmt.Errorf("failed to connect to product_catalog database: %v", err)
	}

	// Auto migrate the schemas
	if err := DB.AutoMigrate(&models.Product{}); err != nil {
		return fmt.Errorf("failed to auto-migrate: %v", err)
	}

	return nil
}

// getEnv gets an environment variable or returns a default value if not set
// This function is now deprecated as we're using the config struct
func getEnv(key, defaultValue string) string {
	value, exists := os.LookupEnv(key)
	if !exists {
		return defaultValue
	}
	return value
}

// GetDB returns the database instance
func GetDB() *gorm.DB {
	return DB
}