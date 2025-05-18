package config

import (
	"errors"
	"os"

	"github.com/joho/godotenv"
)

// Config stores all configuration for the application
type Config struct {
	ServerPort    string
	DatabaseURL   string
	DBHost        string
	DBPort        string
	DBUser        string
	DBPassword    string
	DBName        string
	JWTSecret     string
	AdminUsername string
	AdminPassword string
}

// LoadConfig loads configuration from environment variables
func LoadConfig() (*Config, error) {
	// Load .env file if it exists
	godotenv.Load()

	cfg := &Config{
		ServerPort:    os.Getenv("SERVER_PORT"),
		DatabaseURL:   os.Getenv("DATABASE_URL"),
		DBHost:        os.Getenv("DB_HOST"),
		DBPort:        os.Getenv("DB_PORT"),
		DBUser:        os.Getenv("DB_USER"),
		DBPassword:    os.Getenv("DB_PASSWORD"),
		DBName:        os.Getenv("DB_NAME"),
		JWTSecret:     os.Getenv("JWT_SECRET"),
		AdminUsername: os.Getenv("ADMIN_USERNAME"),
		AdminPassword: os.Getenv("ADMIN_PASSWORD"),
	}

	// Set defaults if not provided
	if cfg.ServerPort == "" {
		cfg.ServerPort = "8080"
	}
	
	if cfg.DBHost == "" {
		cfg.DBHost = "postgres"
	}
	
	if cfg.DBPort == "" {
		cfg.DBPort = "5432"
	}
	
	if cfg.DBUser == "" {
		cfg.DBUser = "postgres"
	}
	
	if cfg.DBName == "" {
		cfg.DBName = "product_catalog"
	}

	// Validate required config
	if cfg.DatabaseURL == "" {
		// We can proceed without DATABASE_URL if we have the individual DB connection params
		if cfg.DBHost == "" || cfg.DBPort == "" || cfg.DBUser == "" {
			return nil, errors.New("database connection parameters are required")
		}
	}

	if cfg.JWTSecret == "" {
		return nil, errors.New("JWT secret is required")
	}

	if cfg.AdminUsername == "" || cfg.AdminPassword == "" {
		return nil, errors.New("admin credentials are required")
	}

	return cfg, nil
}

// GetEnv retrieves the value of the environment variable named by the key
// and a boolean indicating whether the variable is present
func GetEnv(key string) (string, bool) {
	val, exists := os.LookupEnv(key)
	return val, exists
}