# Entregable Final - Tests funcionales + Docker image

## 1) Estructura del proyecto

```txt
.
|-- .github
|   `-- workflows
|       `-- ci.yml
|-- Dockerfile
|-- README.md
|-- package.json
|-- server.js
|-- src
|   |-- app.js
|   |-- docs
|   |   `-- adoptions.openapi.js
|   |-- routes
|   |   `-- adoption.router.js
|   |-- services
|   |   `-- adoption.service.js
|   `-- swagger.js
`-- test
    `-- adoption.router.test.js
```

## 2) Descripcion general

Este proyecto implementa una API en Node.js con Express para gestionar adopciones. Incluye tests funcionales de todos los endpoints del router `adoption.router.js`, documentacion **OpenAPI** generada con **swagger-jsdoc** y expuesta con **Swagger UI**, dockerizacion optimizada, pipeline **CI** (tests + build de imagen) y guia de ejecucion reproducible.

### Cumplimiento con la consigna (checklist)

| Requisito de la consigna | Estado en este repo |
|---------------------------|---------------------|
| Tests funcionales de **todos** los endpoints de `adoption.router.js` | Cumple: `test/adoption.router.test.js` (Mocha + Chai + Supertest), 12 casos |
| Casos positivos, negativos y de error; **mocks/fakes** del servicio | Cumple: `buildAppWithService()` inyecta objeto fake con `overrides` por escenario |
| Ejecucion automatizada repetible | Cumple: `npm test` |
| **Dockerfile** optimizado (base ligera, capas, prod deps, puerto) | Cumple: `Dockerfile` (`node:20-alpine`, `npm ci --omit=dev`, usuario `node`, `EXPOSE 3000`) |
| Build local y ejecucion en contenedor | Cumple: build local y healthcheck validados en contenedor (`adoptions-api:1.0.0`) |
| Imagen en **DockerHub** + URL publica en README | Cumple: imagen publicada en `hunk007/adoptions-api` con tags `1.0.0` y `latest` |
| Escaneo basico de vulnerabilidades | Pendiente manual: Docker Hub pestana **Vulnerabilities** tras subir, o `docker scout quickview` (Docker Desktop / CLI) |
| **Swagger/OpenAPI** (`swagger-jsdoc` + Swagger UI) | Cumple: ver seccion **Documentacion API** mas abajo |
| **CI/CD** (pipeline tests + imagen) | Cumple en parte: `.github/workflows/ci.yml` ejecuta `npm test` y `docker build` en cada push/PR a `main` o `master` |
| Despliegue cloud (AWS/Azure/GCP) y monitoreo | No incluido (opcional avanzado); el README indica como correr contenedor localmente |
| README con URL repo, URL imagen DockerHub, instrucciones y evidencias | Parcial: instrucciones listas; **URL del repositorio** y **URL DockerHub** debes completarlas cuando existan |

**URL del repositorio (completar):** `[PENDIENTE — https://github.com/TU_USUARIO/adoptions-api]`  
**URL publica DockerHub:** `https://hub.docker.com/r/hunk007/adoptions-api`

## 3) Endpoints cubiertos por tests funcionales

- `GET /api/adoptions`
- `GET /api/adoptions/:aid`
- `POST /api/adoptions/:uid/:pid`

### Casos cubiertos

- Exito (200/201)
- Validacion de parametros (400)
- Recursos inexistentes (404)
- Conflicto de negocio (409)
- Error interno de servidor simulado con mocks/fakes (500)

## 4) Ejecucion local

### Instalar dependencias

```bash
npm install
```

### Levantar servidor

```bash
npm start
```

Servidor en `http://localhost:3000`

### Documentacion API (Swagger / OpenAPI)

Con el servidor en marcha:

- **Swagger UI (interactivo):** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **JSON OpenAPI (especificacion):** [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json)

La especificacion se genera con **swagger-jsdoc** a partir de `src/docs/adoptions.openapi.js` y se sirve con **swagger-ui-express** desde `src/app.js`.

### Healthcheck

```bash
GET http://localhost:3000/health
```

## 5) Ejecutar tests funcionales

```bash
npm test
```

Salida esperada: `12 passing` (evidencia para Google Docs: pegar log completo de esta consola).

## 5.1) Integracion continua (CI)

En GitHub, con el repositorio remoto configurado, el workflow `.github/workflows/ci.yml`:

1. Instala dependencias con `npm ci`
2. Ejecuta `npm test`
3. Construye la imagen con `docker build -t adoptions-api:ci .` (sin publicar)

Asi puedes **demostrar build Docker** aunque tu Windows no tenga Docker Desktop, usando la pestana **Actions** del repo como evidencia.

## 6) Dockerizacion

### Construir imagen

```bash
docker build -t hunk007/adoptions-api:1.0.0 .
```

### Ejecutar contenedor

```bash
docker run --rm -p 3000:3000 hunk007/adoptions-api:1.0.0
```

### Probar API desde contenedor

```bash
curl http://localhost:3000/health
```

## 7) Publicar imagen en DockerHub

```bash
docker login
docker push hunk007/adoptions-api:1.0.0
docker tag hunk007/adoptions-api:1.0.0 hunk007/adoptions-api:latest
docker push hunk007/adoptions-api:latest
```

- URL publica de imagen: `https://hub.docker.com/r/hunk007/adoptions-api`

### Escaneo de seguridad (recomendado para la consigna)

- En **Docker Hub**, con la imagen ya subida: abre el repositorio → pestana **Vulnerabilities** (o **Tags** → detalle del tag) y captura el resultado.
- Opcional con CLI (requiere Docker): `docker scout quickview hunk007/adoptions-api:1.0.0`

## 8) Evidencias para Google Docs

Pega en tu documento:

- Salida completa de `npm test`
- Log de `docker build` (local o desde **GitHub Actions**)
- Log de ejecucion de contenedor (`docker run` + peticion a `/health` o captura de Swagger en `http://localhost:3000/api-docs`)
- Captura o resumen del **escaneo de vulnerabilidades** (Docker Hub o Docker Scout)
- URL publica de DockerHub
- Contenido completo de este `README.md` (o enlace al repo raw)

### 8.1) Evidencias reales de esta ejecucion

**Tests funcionales**

```txt
Functional Tests - adoption.router.js
12 passing (173ms)
```

**Build Docker**

```txt
#11 naming to docker.io/library/adoptions-api:1.0.0 done
#11 DONE 1.8s
```

**Imagen creada**

```txt
IMAGE                 ID             DISK USAGE   CONTENT SIZE   EXTRA
adoptions-api:1.0.0   85c753512d26        223MB         53.8MB   U
```

**Ejecucion de contenedor + healthcheck**

```txt
CONTAINER ID   IMAGE                 STATUS         PORTS
4412de6d8d7e   adoptions-api:1.0.0   Up 3 seconds   0.0.0.0:3000->3000/tcp
{"status":"ok"}
Server running on 0.0.0.0:3000
```

**Publicacion en DockerHub**

```txt
1.0.0: digest: sha256:85c753512d26ec99dc924b95d66a3bea29a230f14e5b3773c18607a62096f03a size: 856
latest: digest: sha256:85c753512d26ec99dc924b95d66a3bea29a230f14e5b3773c18607a62096f03a size: 856
URL publica: https://hub.docker.com/r/hunk007/adoptions-api
```

**Validacion de endpoints en Docker**

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

## 9) Notas tecnicas de calidad

- Se usa inyeccion de dependencias en el router para facilitar mocks y fakes.
- Los tests son funcionales sobre HTTP real con `supertest`.
- El Dockerfile usa imagen base ligera (`node:20-alpine`) y usuario no root (`node`).

## 10) Pruebas con Postman

Levanta antes el servidor (`npm start` o contenedor en el puerto 3000).

### Variable de coleccion o entorno

| Variable  | Valor inicial              |
|-----------|----------------------------|
| `baseUrl` | `http://localhost:3000`    |

En Postman: coleccion o entorno → Add variable `baseUrl`.

### Peticiones sugeridas (orden recomendado)

Datos de ejemplo del servicio en memoria: usuarios `u1`, `u2`; mascotas `p1`, `p2`; adopcion inicial `a1` (usuario `u1`, mascota `p1`). La mascota `p1` ya esta adoptada al arrancar.

| Nombre                    | Metodo | URL (pestaña Params / barra de direccion) | Codigo esperado |
|---------------------------|--------|---------------------------------------------|-----------------|
| Health                    | GET    | `{{baseUrl}}/health`                        | 200             |
| Listar adopciones         | GET    | `{{baseUrl}}/api/adoptions`                 | 200             |
| Obtener adopcion valida   | GET    | `{{baseUrl}}/api/adoptions/a1`              | 200             |
| ID adopcion invalido     | GET    | `{{baseUrl}}/api/adoptions/a%40`            | 400             |
| ID adopcion inexistente   | GET    | `{{baseUrl}}/api/adoptions/a999`            | 404             |
| Crear adopcion OK         | POST   | `{{baseUrl}}/api/adoptions/u2/p2`           | 201             |
| UID/PID invalidos         | POST   | `{{baseUrl}}/api/adoptions/u%40/p1`         | 400             |
| Usuario inexistente       | POST   | `{{baseUrl}}/api/adoptions/u99/p2`          | 404             |
| Mascota inexistente       | POST   | `{{baseUrl}}/api/adoptions/u2/p99`          | 404             |
| Mascota ya adoptada       | POST   | `{{baseUrl}}/api/adoptions/u2/p1`           | 409             |

En Postman, en la URL puedes escribir literal `{{baseUrl}}/api/adoptions/a@` para el caso 400 de GET (caracter `@` no permitido por la validacion del router).

**Nota:** Si ya ejecutaste **Crear adopcion OK** (`u2` + `p2`), un segundo POST igual devolvera **409** porque `p2` quedo adoptada. Reinicia el servidor para volver al estado inicial.

### Scripts para la pestaña Tests (copiar en cada peticion)

Sustituye el numero en `to.eql(...)` por el codigo de la tabla si corresponde.

**Health**

```javascript
pm.test('Status 200', () => pm.response.to.have.status(200));
const json = pm.response.json();
pm.test('Body status ok', () => pm.expect(json.status).to.eql('ok'));
```

**Listar adopciones**

```javascript
pm.test('Status 200', () => pm.response.to.have.status(200));
const json = pm.response.json();
pm.test('Envelope success', () => pm.expect(json.status).to.eql('success'));
pm.test('Payload es array', () => pm.expect(json.payload).to.be.an('array'));
```

**GET por id (exito con a1)**

```javascript
pm.test('Status 200', () => pm.response.to.have.status(200));
const json = pm.response.json();
pm.test('Envelope success', () => pm.expect(json.status).to.eql('success'));
pm.test('Tiene id', () => pm.expect(json.payload).to.have.property('id', 'a1'));
```

**GET id invalido (400)**

```javascript
pm.test('Status 400', () => pm.response.to.have.status(400));
const json = pm.response.json();
pm.test('Mensaje invalid adoption id', () =>
  pm.expect(json.message).to.eql('Invalid adoption id')
);
```

**GET id inexistente (404)**

```javascript
pm.test('Status 404', () => pm.response.to.have.status(404));
const json = pm.response.json();
pm.test('Mensaje not found', () => pm.expect(json.message).to.eql('Adoption not found'));
```

**POST crear adopcion (201)**

```javascript
pm.test('Status 201', () => pm.response.to.have.status(201));
const json = pm.response.json();
pm.test('Envelope success', () => pm.expect(json.status).to.eql('success'));
pm.test('Payload con userId y petId', () => {
  pm.expect(json.payload).to.have.property('userId', 'u2');
  pm.expect(json.payload).to.have.property('petId', 'p2');
});
```

**POST uid/pid invalidos (400)**

```javascript
pm.test('Status 400', () => pm.response.to.have.status(400));
const json = pm.response.json();
pm.test('Mensaje invalid user or pet id', () =>
  pm.expect(json.message).to.eql('Invalid user or pet id')
);
```

**POST usuario inexistente (404)**

```javascript
pm.test('Status 404', () => pm.response.to.have.status(404));
const json = pm.response.json();
pm.test('Codigo USER_NOT_FOUND', () => pm.expect(json.message).to.eql('USER_NOT_FOUND'));
```

**POST mascota inexistente (404)**

```javascript
pm.test('Status 404', () => pm.response.to.have.status(404));
const json = pm.response.json();
pm.test('Codigo PET_NOT_FOUND', () => pm.expect(json.message).to.eql('PET_NOT_FOUND'));
```

**POST mascota ya adoptada (409)**

```javascript
pm.test('Status 409', () => pm.response.to.have.status(409));
const json = pm.response.json();
pm.test('Codigo PET_ALREADY_ADOPTED', () =>
  pm.expect(json.message).to.eql('PET_ALREADY_ADOPTED')
);
```

### Runner

En Postman: coleccion → **Run** → selecciona las peticiones en el orden de la tabla → Run Adoptions API. Si falla el POST 201 tras una corrida previa, reinicia `npm start` y vuelve a ejecutar.
