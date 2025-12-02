import swaggerJSDoc from "swagger-jsdoc";
import swaggerModelValidator from "swagger-model-validator";
import config from "../loaders/config.js";

const options = {
    definition: {
        openapi: "3.0.4",
        info: {
            title: "Week 4 Day 5 API DOCUMENTATION using Swagger",
            version: "1.0.0",
            description: "API documentation",
        },
        servers: [
            { url: `http://localhost:${config.port}`}
        ],
    },

    apis: ["./src/routes/*.js"], 
};

const swaggerSpec = swaggerJSDoc(options);
swaggerModelValidator(swaggerSpec);
export default swaggerSpec;
