const chai = require('chai');
const request = require('supertest');
const createAdoptionRouter = require('../src/routes/adoption.router');
const createApp = require('../src/app');

const { expect } = chai;

function buildAppWithService(overrides = {}) {
  const baseService = {
    getAll: async () => [
      { id: 'a1', userId: 'u1', petId: 'p1', createdAt: '2026-01-01T10:00:00.000Z' }
    ],
    getById: async (id) => {
      if (id === 'a1') {
        return { id: 'a1', userId: 'u1', petId: 'p1', createdAt: '2026-01-01T10:00:00.000Z' };
      }
      return null;
    },
    create: async (uid, pid) => ({
      data: { id: 'a2', userId: uid, petId: pid, createdAt: '2026-01-02T10:00:00.000Z' }
    })
  };

  const service = { ...baseService, ...overrides };
  const router = createAdoptionRouter({ adoptionService: service });
  return createApp({ adoptionRouter: router });
}

describe('Functional Tests - adoption.router.js', () => {
  describe('GET /api/adoptions', () => {
    it('returns all adoptions with 200', async () => {
      const app = buildAppWithService();
      const response = await request(app).get('/api/adoptions');

      expect(response.status).to.equal(200);
      expect(response.body.status).to.equal('success');
      expect(response.body.payload).to.be.an('array').with.lengthOf(1);
    });

    it('returns 500 when service fails', async () => {
      const app = buildAppWithService({
        getAll: async () => {
          throw new Error('db fail');
        }
      });

      const response = await request(app).get('/api/adoptions');

      expect(response.status).to.equal(500);
      expect(response.body.message).to.equal('Internal server error');
    });
  });

  describe('GET /api/adoptions/:aid', () => {
    it('returns one adoption with 200 for valid id', async () => {
      const app = buildAppWithService();
      const response = await request(app).get('/api/adoptions/a1');

      expect(response.status).to.equal(200);
      expect(response.body.payload.id).to.equal('a1');
    });

    it('returns 400 for invalid adoption id', async () => {
      const app = buildAppWithService();
      const response = await request(app).get('/api/adoptions/a$1');

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Invalid adoption id');
    });

    it('returns 404 when adoption does not exist', async () => {
      const app = buildAppWithService();
      const response = await request(app).get('/api/adoptions/a999');

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Adoption not found');
    });

    it('returns 500 when getById throws', async () => {
      const app = buildAppWithService({
        getById: async () => {
          throw new Error('service down');
        }
      });

      const response = await request(app).get('/api/adoptions/a1');

      expect(response.status).to.equal(500);
      expect(response.body.message).to.equal('Internal server error');
    });
  });

  describe('POST /api/adoptions/:uid/:pid', () => {
    it('creates an adoption and returns 201', async () => {
      const app = buildAppWithService();
      const response = await request(app).post('/api/adoptions/u2/p2');

      expect(response.status).to.equal(201);
      expect(response.body.status).to.equal('success');
      expect(response.body.payload).to.have.property('id');
      expect(response.body.payload.userId).to.equal('u2');
      expect(response.body.payload.petId).to.equal('p2');
    });

    it('returns 400 for invalid uid or pid', async () => {
      const app = buildAppWithService();
      const response = await request(app).post('/api/adoptions/invalid*/p2');

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Invalid user or pet id');
    });

    it('returns 404 when user does not exist', async () => {
      const app = buildAppWithService({
        create: async () => ({ error: 'USER_NOT_FOUND' })
      });

      const response = await request(app).post('/api/adoptions/u999/p2');

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('USER_NOT_FOUND');
    });

    it('returns 404 when pet does not exist', async () => {
      const app = buildAppWithService({
        create: async () => ({ error: 'PET_NOT_FOUND' })
      });

      const response = await request(app).post('/api/adoptions/u2/p999');

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('PET_NOT_FOUND');
    });

    it('returns 409 when pet is already adopted', async () => {
      const app = buildAppWithService({
        create: async () => ({ error: 'PET_ALREADY_ADOPTED' })
      });

      const response = await request(app).post('/api/adoptions/u2/p1');

      expect(response.status).to.equal(409);
      expect(response.body.message).to.equal('PET_ALREADY_ADOPTED');
    });

    it('returns 500 when create throws', async () => {
      const app = buildAppWithService({
        create: async () => {
          throw new Error('unexpected failure');
        }
      });

      const response = await request(app).post('/api/adoptions/u2/p2');

      expect(response.status).to.equal(500);
      expect(response.body.message).to.equal('Internal server error');
    });
  });
});
