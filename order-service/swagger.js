const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order Service API Documentation',
      version: '1.0.0',
      description: 'API documentation for the Order Service',
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Local Development Server',
      },
      {
        url: 'http://api.phoneaccessories.local/api/orders',
        description: 'Gateway Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

module.exports = swaggerJsdoc(options);