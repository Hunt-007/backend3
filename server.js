const createAdoptionRouter = require('./src/routes/adoption.router');
const { createAdoptionService } = require('./src/services/adoption.service');
const createApp = require('./src/app');

const adoptionService = createAdoptionService();
const adoptionRouter = createAdoptionRouter({ adoptionService });
const app = createApp({ adoptionRouter });

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});
