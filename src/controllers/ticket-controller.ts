import { Router } from "express";
import { TicketService } from "../services/ticket-service";
import { PartnerService } from "../services/partner-service";
import { EventService } from "../services/event-service";

export const ticketRoutes = Router();

/**
 * @swagger
 * /events/{eventId}/tickets:
 *   post:
 *     summary: Cria ingressos para um evento
 *     description: Permite que um parceiro autenticado cadastre ingressos para um evento específico.
 *     tags:
 *       - Ingressos
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento ao qual os ingressos pertencem.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               num_tickets:
 *                 type: integer
 *                 example: 100
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 49.99
 *     responses:
 *       204:
 *         description: Ingressos criados com sucesso.
 *       403:
 *         description: Usuário não autorizado a criar ingressos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not authorized"
 *       500:
 *         description: Erro inesperado ao processar a criação dos ingressos.
 */
ticketRoutes.post("/:eventId/tickets", async (req, res) => {
    const userId = req.user!.id;
    const partnerService = new PartnerService();
    const partner = await partnerService.findByUserId(userId);

    if (!partner) {
        res.status(403).json({ message: "Not authorized" });
        return;
    }

    const { num_tickets, price } = req.body;
    const { eventId } = req.params;
    const ticketService = new TicketService();
    await ticketService.createMany({
        eventId: +eventId,
        numTickets: num_tickets,
        price,
    });
    res.status(204).send();
});

/**
 * @swagger
 * /events/{eventId}/tickets:
 *   get:
 *     summary: Lista ingressos de um evento
 *     description: Retorna uma lista de ingressos disponíveis para um evento específico.
 *     tags:
 *       - Ingressos
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento.
 *     responses:
 *       200:
 *         description: Lista de ingressos retornada com sucesso.
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
 *                   eventId:
 *                     type: integer
 *                     example: 5
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 49.99
 *                   available:
 *                     type: integer
 *                     example: 90
 *       404:
 *         description: Evento não encontrado ou sem ingressos disponíveis.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tickets not found"
 *       500:
 *         description: Erro inesperado ao buscar os ingressos.
 */
ticketRoutes.get("/:eventId/tickets", async (req, res) => {
    const { eventId } = req.params;
    const ticketService = new TicketService();
    const data = await ticketService.findByEventId(+eventId);
    res.json(data);
});

/**
 * @swagger
 * /events/{eventId}/tickets/{ticketId}:
 *   get:
 *     summary: Busca um ingresso específico
 *     description: Retorna detalhes de um ingresso específico pelo ID.
 *     tags:
 *       - Ingressos
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento.
 *       - in: path
 *         name: ticketId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ingresso.
 *     responses:
 *       200:
 *         description: Ingresso encontrado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 eventId:
 *                   type: integer
 *                   example: 5
 *                 price:
 *                   type: number
 *                   format: float
 *                   example: 49.99
 *                 available:
 *                   type: integer
 *                   example: 90
 *       404:
 *         description: Ingresso não encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket not found"
 *       500:
 *         description: Erro inesperado ao buscar o ingresso.
 */
ticketRoutes.get("/:eventId/tickets/:ticketId", async (req, res) => {
    const { eventId, ticketId } = req.params;
    const ticketService = new TicketService();
    const ticket = await ticketService.findById(+eventId, +ticketId);
    
    if (!ticket) {
        res.status(404).json({ message: "Ticket not Found."});
        return;
    }

    res.json(ticket);
});