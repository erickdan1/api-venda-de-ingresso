import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Venda de Ingressos",
      version: "1.0.0",
      description: "Documentação da API para gerenciamento e venda de ingressos",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de Desenvolvimento",
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
    }
  },
  apis: ["./src/controllers/*.ts"], // Define os arquivos onde estão as rotas para gerar a documentação
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
