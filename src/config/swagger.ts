import swaggerJsDoc from "swagger-jsdoc";

const swaggerSpecs: swaggerJsDoc.Options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Swagger Connectify',
            version: '1.0.0',
            description: 'Vouz verrez ici tous les routes',
        },
        servers: [
            {
                url: 'http://localhost:8080',
                description: 'Development server',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

export default swaggerSpecs