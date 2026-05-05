/**
 * Especificacion OpenAPI generada con swagger-jsdoc (este archivo solo aporta comentarios).
 *
 * @openapi
 * tags:
 *   - name: Health
 *     description: Comprobacion de disponibilidad
 *   - name: Adoptions
 *     description: Adopciones de mascotas
 * components:
 *   schemas:
 *     Adoption:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: a1
 *         userId:
 *           type: string
 *           example: u1
 *         petId:
 *           type: string
 *           example: p1
 *         createdAt:
 *           type: string
 *           format: date-time
 *     ErrorBody:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         message:
 *           type: string
 *           example: Adoption not found
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Healthcheck
 *     responses:
 *       '200':
 *         description: Servicio activo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 * /api/adoptions:
 *   get:
 *     tags: [Adoptions]
 *     summary: Listar todas las adopciones
 *     responses:
 *       '200':
 *         description: Lista obtenida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Adoption'
 *       '500':
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorBody'
 * /api/adoptions/{aid}:
 *   get:
 *     tags: [Adoptions]
 *     summary: Obtener una adopcion por id
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         description: Identificador alfanumerico (incluye _ y -)
 *         example: a1
 *     responses:
 *       '200':
 *         description: Adopcion encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Adoption'
 *       '400':
 *         description: Id invalido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorBody'
 *       '404':
 *         description: No existe la adopcion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorBody'
 *       '500':
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorBody'
 * /api/adoptions/{uid}/{pid}:
 *   post:
 *     tags: [Adoptions]
 *     summary: Crear adopcion (usuario y mascota existentes)
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         example: u2
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *         example: p2
 *     responses:
 *       '201':
 *         description: Adopcion creada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   $ref: '#/components/schemas/Adoption'
 *       '400':
 *         description: Parametros invalidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorBody'
 *       '404':
 *         description: Usuario o mascota no encontrado (message USER_NOT_FOUND o PET_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorBody'
 *       '409':
 *         description: Mascota ya adoptada (PET_ALREADY_ADOPTED)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorBody'
 *       '500':
 *         description: Error interno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorBody'
 */

module.exports = {};
