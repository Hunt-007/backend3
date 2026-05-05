const express = require('express');

function isValidId(value) {
  return /^[a-zA-Z0-9_-]+$/.test(value);
}

function createAdoptionRouter({ adoptionService }) {
  const router = express.Router();

  router.get('/', async (_req, res) => {
    try {
      const adoptions = await adoptionService.getAll();
      return res.status(200).json({ status: 'success', payload: adoptions });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  });

  router.get('/:aid', async (req, res) => {
    const { aid } = req.params;

    if (!isValidId(aid)) {
      return res.status(400).json({ status: 'error', message: 'Invalid adoption id' });
    }

    try {
      const adoption = await adoptionService.getById(aid);

      if (!adoption) {
        return res.status(404).json({ status: 'error', message: 'Adoption not found' });
      }

      return res.status(200).json({ status: 'success', payload: adoption });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  });

  router.post('/:uid/:pid', async (req, res) => {
    const { uid, pid } = req.params;

    if (!isValidId(uid) || !isValidId(pid)) {
      return res.status(400).json({ status: 'error', message: 'Invalid user or pet id' });
    }

    try {
      const result = await adoptionService.create(uid, pid);

      if (result.error === 'USER_NOT_FOUND' || result.error === 'PET_NOT_FOUND') {
        return res.status(404).json({ status: 'error', message: result.error });
      }

      if (result.error === 'PET_ALREADY_ADOPTED') {
        return res.status(409).json({ status: 'error', message: result.error });
      }

      return res.status(201).json({ status: 'success', payload: result.data });
    } catch (error) {
      return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  });

  return router;
}

module.exports = createAdoptionRouter;
