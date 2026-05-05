const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { buildSwaggerSpec } = require('./swagger');

function createApp({ adoptionRouter }) {
  const app = express();
  app.use(express.json());
  app.use('/api/adoptions', adoptionRouter);

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  const swaggerSpec = buildSwaggerSpec();
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  app.get('/api-docs.json', (_req, res) => {
    res.json(swaggerSpec);
  });

  return app;
}

module.exports = createApp;
