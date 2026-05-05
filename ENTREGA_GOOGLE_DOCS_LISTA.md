# Entregable final: Tests funcionales + Docker image (URL)

**Alumno:** [Alessandro Baeza]  
**Curso:** [Programación Backend (III): Testing y Escalabilidad Flex]  
**Fecha:** 05/05/2026  
**Repositorio (GitHub):** [Pegar URL pública del repositorio]

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

> Pegar aqui el contenido completo de `test/adoption.router.test.js`.

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

- URL del repositorio (completar antes de entregar).
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

- [ ] Completar Alumno y Curso.
- [ ] Pegar URL publica del repositorio GitHub.
- [ ] Pegar el contenido completo del `README.md`.
- [ ] Verificar que el Google Docs tenga permiso de lectura por enlace.
- [ ] Enviar el link del Google Docs en la plataforma.
