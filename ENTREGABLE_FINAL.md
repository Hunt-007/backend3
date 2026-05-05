# Entregable Final
**Tests funcionales + Docker image (URL)**

**Alumno:** [Alessandro Baeza]  
**Curso:** [Programación Backend (III): Testing y Escalabilidad Flex]  
**Fecha:** [05/05/2026]  
**Repositorio:** [URL del repositorio de GitHub]

---

## Índice

1. Estructura del proyecto  
2. Tests funcionales  
3. Dockerización  
4. Imagen Docker  
5. Ejecución del proyecto  
6. README  
7. Conclusión

---

## 1. Estructura del proyecto

```txt
entrega final curso/
|-- .dockerignore
|-- Dockerfile
|-- README.md
|-- package.json
|-- package-lock.json
|-- server.js
|-- src/
|   |-- app.js
|   |-- routes/
|   |   `-- adoption.router.js
|   `-- services/
|       `-- adoption.service.js
`-- test/
    `-- adoption.router.test.js
```

**Descripción breve:**
- `adoption.router.js`: endpoints del módulo de adopciones.
- `adoption.service.js`: lógica de negocio y datos simulados.
- `adoption.router.test.js`: suite funcional de endpoints.
- `Dockerfile` y `.dockerignore`: empaquetado y optimización de imagen.
- `README.md`: guía completa de uso y despliegue.

---

## 2. Tests funcionales

Se implementaron tests funcionales para validar todos los endpoints del router `adoption.router.js` con escenarios reales de uso y manejo de errores.

**Stack de testing:**
- Mocha
- Chai
- Supertest

**Endpoints cubiertos:**
- `GET /api/adoptions`
- `GET /api/adoptions/:aid`
- `POST /api/adoptions/:uid/:pid`

**Casos validados:**
- Éxito (`200`, `201`)
- Validación de parámetros (`400`)
- Recursos inexistentes (`404`)
- Conflicto de negocio (`409`)
- Errores internos simulados (`500`)

**Evidencia de ejecución:**

```bash
npm test
```

Resultado obtenido:

```txt
12 passing (173ms)
```

---

## 3. Dockerización

Se creó un Dockerfile optimizado para producción y buenas prácticas de seguridad.

### Dockerfile

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

**Decisiones técnicas:**
- Base ligera (`node:20-alpine`)
- Instalación reproducible (`npm ci`)
- Solo dependencias de producción (`--omit=dev`)
- Ejecución con usuario no root (`USER node`)
- Reducción de contexto con `.dockerignore`

---

## 4. Imagen Docker

**Nombre y tag:**
- `hunk007/adoptions-api:1.0.0`
- `hunk007/adoptions-api:latest`

**Comandos:**

```bash
docker build -t hunk007/adoptions-api:1.0.0 .
docker run --rm -p 3000:3000 hunk007/adoptions-api:1.0.0
```

**Publicación en DockerHub:**

```bash
docker login
docker tag adoptions-api:1.0.0 hunk007/adoptions-api:1.0.0
docker push hunk007/adoptions-api:1.0.0
docker tag adoptions-api:1.0.0 hunk007/adoptions-api:latest
docker push hunk007/adoptions-api:latest
```

**URL pública DockerHub:**  
`https://hub.docker.com/r/hunk007/adoptions-api`

**Evidencia de build Docker (resumen real):**

```txt
#11 naming to docker.io/library/adoptions-api:1.0.0 done
#11 DONE 1.8s
```

**Evidencia de imagen creada (real):**

```txt
IMAGE                 ID             DISK USAGE   CONTENT SIZE
adoptions-api:1.0.0   85c753512d26        223MB         53.8MB
```

**Evidencia de ejecución de contenedor (real):**

```txt
CONTAINER ID   IMAGE                 STATUS         PORTS
4412de6d8d7e   adoptions-api:1.0.0   Up 3 seconds   0.0.0.0:3000->3000/tcp
{"status":"ok"}
Server running on 0.0.0.0:3000
```

**Evidencia de publicación en DockerHub (real):**

```txt
1.0.0: digest: sha256:85c753512d26ec99dc924b95d66a3bea29a230f14e5b3773c18607a62096f03a
latest: digest: sha256:85c753512d26ec99dc924b95d66a3bea29a230f14e5b3773c18607a62096f03a
```

---

## 5. Ejecución del proyecto

**Local:**
```bash
npm install
npm start
```

**Tests:**
```bash
npm test
```

**Con Docker:**
```bash
docker build -t hunk007/adoptions-api:1.0.0 .
docker run --rm -p 3000:3000 hunk007/adoptions-api:1.0.0
```

---

## 6. README

El repositorio incluye `README.md` actualizado con:

- estructura del proyecto,
- endpoints y cobertura funcional,
- pasos de instalación y ejecución,
- guía de dockerización y publicación,
- información necesaria para reproducir la solución.

---

## 7. Conclusión

Se completó una entrega integral en Node.js que cubre pruebas funcionales del router, dockerización optimizada y documentación reproducible.  
El resultado refleja un flujo profesional orientado a calidad, despliegue y mantenibilidad.
