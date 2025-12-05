const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "The Modern Quill API",
      version: "1.0.0",
      description: "RESTful API for The Modern Quill blog platform",
      contact: {
        name: "API Support",
        email: "support@themodernquill.com",
      },
      license: {
        name: "ISC",
      },
    },
    servers: [
      {
        url: process.env.API_BASE_URL || "http://localhost:4000/api/v1",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            data: {
              type: "object",
              nullable: true,
            },
            error: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                },
                code: {
                  type: "string",
                },
              },
            },
          },
        },
        Success: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "object",
            },
            error: {
              type: "object",
              nullable: true,
            },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: {
              type: "number",
            },
            limit: {
              type: "number",
            },
            total: {
              type: "number",
            },
            totalPages: {
              type: "number",
            },
            hasNext: {
              type: "boolean",
            },
            hasPrev: {
              type: "boolean",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

