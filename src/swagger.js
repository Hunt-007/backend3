const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');

function buildSwaggerSpec() {
  return swaggerJsdoc({
    definition: {
      openapi: '3.0.3',
      info: {
        title: 'Adoptions API',
        version: '1.0.0',
        description:
          'API REST de adopciones. Documentacion interactiva con Swagger UI; especificacion generada con swagger-jsdoc.'
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Desarrollo local' },
        { url: '/', description: 'Relativo al host actual (util en contenedor / proxy)' }
      ]
    },
    apis: [path.join(__dirname, 'docs', 'adoptions.openapi.js')]
  });
}

module.exports = { buildSwaggerSpec };
