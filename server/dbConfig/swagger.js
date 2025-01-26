// const swaggerJSDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger options
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cashup Backend',
            version: '1.0.0',
            description: 'API documentation for the Cashup backend',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },
    apis: ['./routes/*.js'], // Path to route files with documentation comments
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// module.exports = { swaggerDocs, swaggerUi };
export {swaggerDocs, swaggerUi}