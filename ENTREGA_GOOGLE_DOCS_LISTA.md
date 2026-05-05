# Entregable final: Tests funcionales + Docker image (URL)

**Alumno:** [Alessandro Baeza]  
**Curso:** [Programación Backend (III): Testing y Escalabilidad Flex]  
**Fecha:** 05/05/2026  
**Repositorio (GitHub):** [https://github.com/Hunt-007/backend3/]

---

## 1) Estructura del proyecto

Descripcion de la estructura del repositorio y archivos principales:

```txt
backend3/
|-- .dockerignore
|-- Dockerfile
|-- README.md
|-- package.json
|-- package-lock.json
|-- server.js
|-- src/
|   |-- app.js
|   |-- swagger.js
|   |-- docs/
|   |   `-- adoptions.openapi.js
|   |-- routes/
|   |   `-- adoption.router.js
|   `-- services/
|       `-- adoption.service.js
`-- test/
    `-- adoption.router.test.js
```

Proposito de carpetas y archivos:

- `src/routes/adoption.router.js`: define los endpoints funcionales del modulo de adopciones.
- `src/services/adoption.service.js`: encapsula la logica de negocio del dominio.
- `test/adoption.router.test.js`: tests funcionales de todos los endpoints del router.
- `Dockerfile`: construccion de imagen Docker optimizada para ejecucion.
- `README.md`: documentacion de uso, pruebas y despliegue.

---

## 2) Tests funcionales

Se implementaron tests funcionales para validar todos los endpoints de `adoption.router.js`, incluyendo escenarios de exito, validacion, errores de negocio y errores internos.

### Endpoints cubiertos

- `GET /api/adoptions`
- `GET /api/adoptions/:aid`
- `POST /api/adoptions/:uid/:pid`

### Casos validados

- Exito (`200`, `201`)
- Validacion de entrada (`400`)
- Recurso inexistente (`404`)
- Conflicto de negocio (`409`)
- Error interno (`500`)

### Mocks y fakes utilizados

Los tests usan inyeccion de dependencias para reemplazar el servicio real por dobles de prueba (fakes/mocks), permitiendo simular respuestas controladas por escenario.

### Codigo completo de tests funcionales

```javascript
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
```

### Evidencia de ejecucion de tests

Comando ejecutado:

```bash
npm test
```

Salida (evidencia):

```txt
Functional Tests - adoption.router.js
12 passing (173ms)
```

---

## 3) Dockerizacion

Se genero un Dockerfile optimizado para reproducibilidad, seguridad y peso reducido.

### Dockerfile utilizado (completo)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

ENV NODE_ENV=production
EXPOSE 3000

USER node
CMD ["node", "server.js"]
```

### Decisiones de optimizacion

- Imagen base ligera: `node:20-alpine`.
- Instalacion deterministica: `npm ci`.
- Solo dependencias de produccion: `--omit=dev`.
- Ejecucion con usuario no root: `USER node`.
- Menor contexto de build: uso de `.dockerignore`.

### Log de build Docker (evidencia)

```txt
docker build -t adoptions-api:1.0.0 .
#11 naming to docker.io/library/adoptions-api:1.0.0 done
#11 DONE 1.8s
```

---

## 4) Imagen Docker

### Nombre y tags generados

- `hunk007/adoptions-api:1.0.0`
- `hunk007/adoptions-api:latest`

### Evidencia de imagen creada

```txt
IMAGE                 ID             DISK USAGE   CONTENT SIZE
adoptions-api:1.0.0   85c753512d26        223MB         53.8MB
```

### Evidencia de ejecucion del contenedor

```txt
CONTAINER ID   IMAGE                 STATUS         PORTS
4412de6d8d7e   adoptions-api:1.0.0   Up 3 seconds   0.0.0.0:3000->3000/tcp
{"status":"ok"}
Server running on 0.0.0.0:3000
```

### Evidencia de publicacion DockerHub

```txt
1.0.0: digest: sha256:85c753512d26ec99dc924b95d66a3bea29a230f14e5b3773c18607a62096f03a
latest: digest: sha256:85c753512d26ec99dc924b95d66a3bea29a230f14e5b3773c18607a62096f03a
```

### Evidencia de escaneo de seguridad (Docker Scout)

```txt
docker scout quickview hunk007/adoptions-api:1.0.0
Target             │  hunk007/adoptions-api:1.0.0  │    0C    11H     2M     2L
Base image         │  node:20-alpine               │    0C    11H     2M     2L
Updated base image │  node:24-alpine               │    0C     1H     3M     0L
```

URL publica de la imagen:

`https://hub.docker.com/r/hunk007/adoptions-api`

---

## 5) Ejecucion del proyecto

### Ejecutar local

```bash
npm install
npm start
```

### Correr tests

```bash
npm test
```

### Ejecutar con Docker

```bash
docker build -t hunk007/adoptions-api:1.0.0 .
docker run --rm -p 3000:3000 hunk007/adoptions-api:1.0.0
```

### Validaciones recomendadas en contenedor

```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/adoptions
```

Codigos esperados observados:

```txt
GET /health -> 200
GET /api/adoptions -> 200
GET /api/adoptions/a1 -> 200
GET /api/adoptions/a%40 -> 400
GET /api/adoptions/a999 -> 404
POST /api/adoptions/u2/p2 -> 201
POST /api/adoptions/u%40/p1 -> 400
POST /api/adoptions/u99/p2 -> 404
POST /api/adoptions/u2/p99 -> 404
POST /api/adoptions/u2/p1 -> 409
```

---

## 6) README

Se incluye `README.md` actualizado con:

- URL del repositorio GitHub: `https://github.com/Hunt-007/backend3/`.
- URL publica de DockerHub.
- Instrucciones de instalacion, test y dockerizacion.
- Evidencias y pasos de reproduccion.

> Pegar aqui el contenido completo y final de `README.md` (requisito explicito de la consigna).

---

## 7) Conclusiones

Se cumplio con el desarrollo de tests funcionales del router, dockerizacion de la API, publicacion de imagen en DockerHub y documentacion para reproducibilidad.  
La solucion sigue buenas practicas de calidad, seguridad basica y despliegue.

---

## Checklist final antes de enviar

- [x] Completar Alumno y Curso.
- [x] Pegar URL publica del repositorio GitHub.
- [ ] Pegar el contenido completo del `README.md`.
- [ ] Verificar que el Google Docs tenga permiso de lectura por enlace.
- [ ] Enviar el link del Google Docs en la plataforma.
