import { Router } from "express";
import { EventService } from "../services/event-service";

export const eventRoutes = Router();

// listar eventos (público)
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Lista todos os eventos disponíveis
 *     description: Retorna uma lista de eventos disponíveis para o público.
 *     tags:
 *       - Eventos
 *     responses:
 *       200:
 *         description: Lista de eventos retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Tech Conference 2025"
 *                   description:
 *                     type: string
 *                     example: "Evento sobre tecnologia e inovação."
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-08-15T14:00:00Z"
 *                   location:
 *                     type: string
 *                     example: "Centro de Convenções, Recife"
 *       401:
 *         description: Token de autenticação ausente ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 */
eventRoutes.get('/', async (req, res) => {
    const eventService = new EventService();
    const result = await eventService.findAll();
    res.json(result);
});

// buscar evento por id
/**
 * @swagger
 * /events/{eventId}:
 *   get:
 *     summary: Busca um evento por ID
 *     description: Retorna os detalhes de um evento específico pelo seu ID.
 *     tags:
 *       - Eventos
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do evento a ser buscado.
 *     responses:
 *       200:
 *         description: Detalhes do evento retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Tech Conference 2025"
 *                 description:
 *                   type: string
 *                   example: "Evento sobre tecnologia e inovação."
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-15T14:00:00Z"
 *                 location:
 *                   type: string
 *                   example: "Centro de Convenções, Recife"
 *       404:
 *         description: Evento não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event not found"
 *       401:
 *         description: Token de autenticação ausente ou inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 */
eventRoutes.get('/:eventId', async (req, res) => {
    const { eventId } = req.params;
    const eventService = new EventService();
    const event = await eventService.findById(+eventId);
    if (!event) {
        res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
});
