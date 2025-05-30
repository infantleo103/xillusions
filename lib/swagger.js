import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api', // API folder path
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Xillusions API Documentation',
        version: '1.0.0',
        description: 'API documentation for Xillusions e-commerce platform',
        contact: {
          name: 'API Support',
          email: 'support@xillusions.com',
        },
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
        {
          url: 'https://xillusions.vercel.app',
          description: 'Production server',
        },
      ],
      tags: [
        {
          name: 'Categories',
          description: 'API endpoints for managing categories',
        },
        {
          name: 'Products',
          description: 'API endpoints for managing products',
        },
        {
          name: 'Users',
          description: 'API endpoints for managing users',
        },
        {
          name: 'Orders',
          description: 'API endpoints for managing orders',
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
  });
  return spec;
};