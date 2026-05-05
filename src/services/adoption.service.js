class AdoptionService {
  constructor() {
    this.users = new Set(['u1', 'u2']);
    this.pets = new Set(['p1', 'p2']);
    this.adoptions = [
      {
        id: 'a1',
        userId: 'u1',
        petId: 'p1',
        createdAt: new Date('2026-01-01T10:00:00.000Z').toISOString()
      }
    ];
    this.nextId = 2;
  }

  async getAll() {
    return this.adoptions;
  }

  async getById(adoptionId) {
    const adoption = this.adoptions.find((item) => item.id === adoptionId);
    return adoption || null;
  }

  async create(userId, petId) {
    if (!this.users.has(userId)) {
      return { error: 'USER_NOT_FOUND' };
    }

    if (!this.pets.has(petId)) {
      return { error: 'PET_NOT_FOUND' };
    }

    const alreadyAdopted = this.adoptions.some((item) => item.petId === petId);
    if (alreadyAdopted) {
      return { error: 'PET_ALREADY_ADOPTED' };
    }

    const newAdoption = {
      id: `a${this.nextId}`,
      userId,
      petId,
      createdAt: new Date().toISOString()
    };

    this.nextId += 1;
    this.adoptions.push(newAdoption);
    return { data: newAdoption };
  }
}

function createAdoptionService() {
  return new AdoptionService();
}

module.exports = {
  createAdoptionService
};
