import { Router } from "express";
import { PartnerService } from "../services/partner-service";
import { EventService } from "../services/event-service";

export const partnerRoutes = Router();

// registro de parceiros
/**
 * @swagger
 * /partners/register:
 *   post:
 *     summary: Registra um novo parceiro
 *     description: Cria uma nova conta de parceiro com nome, e-mail, senha e nome da empresa.
 *     tags:
 *       - Parceiros
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - company_name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Empresa X"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "contato@empresa.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "senhaSegura123"
 *               company_name:
 *                 type: string
 *                 example: "Empresa X Ltda"
 *     responses:
 *       201:
 *         description: Parceiro registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: "Parceiro cadastrado com sucesso!"
 *       400:
 *         description: Requisição inválida (dados faltando ou inválidos)
 *       500:
 *         description: Erro interno no servidor
 */
partnerRoutes.post('/register', async (req, res) => {
    const { name, email, password, company_name } = req.body;
    const partnerSevice = new PartnerService();
    const result = await partnerSevice.register({name, email, password, company_name});
    res.status(201).json({result});
});

// registro de eventos de parceiros
/**
 * @swagger
 * /partners/events:
 *   post:
 *     summary: Registra um novo evento para parceiros
 *     description: Permite que um parceiro autenticado crie um evento.
 *     tags:
 *       - Parceiros
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - date
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tech Conference 2025"
 *               description:
 *                 type: string
 *                 example: "Uma conferência sobre inovação tecnológica."
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-05-20T14:00:00Z"
 *               location:
 *                 type: string
 *                 example: "Centro de Convenções, São Paulo"
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       403:
 *         description: Não autorizado (usuário não é um parceiro)
 *       400:
 *         description: Requisição inválida
 *       500:
 *         description: Erro interno no servidor
 */
partnerRoutes.post('/events', async (req, res) => {
    const { name, description, date, location } = req.body;
    const userId = req.user!.id;

    const partnerService = new PartnerService();
    const partner = await partnerService.findByUserId(userId);

    if (!partner) {
        res.status(403).json({ message: "Not authorized" });
        return;
    }

    const eventService = new EventService();
    const result = await eventService.create({name, description, date: new Date(date), location, partnerId: partner.id});
    
    res.status(201).json({result});
});

// listar eventos de parceiros
/**
 * @swagger
 * /partners/events:
 *   get:
 *     summary: Lista eventos de um parceiro autenticado
 *     description: Retorna todos os eventos criados pelo parceiro autenticado.
 *     tags:
 *       - Parceiros
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos do parceiro autenticado
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
 *                     example: "Uma conferência sobre inovação tecnológica."
 *                   date:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-05-20T14:00:00Z"
 *                   location:
 *                     type: string
 *                     example: "Centro de Convenções, São Paulo"
 *       403:
 *         description: Não autorizado (usuário não é um parceiro)
 *       500:
 *         description: Erro interno no servidor
 */
partnerRoutes.get('/events', async (req, res) => {
    // obtém o ID do usuário autenticado a partir do objeto da requisição (req.user é garantido como não nulo pela validação anterior)
    const userId = req.user!.id; 

    const partnerService = new PartnerService();
    const partner = await partnerService.findByUserId(userId);

    if (!partner) {
        res.status(403).json({ message: "Not authorized" });
        return;
    }

    const eventService = new EventService();
    const result = await eventService.findAll(partner.id);

    res.json(result);
    
});

// buscar evento por id de parceiros
/**
 * @swagger
 * /partners/events/{eventId}:
 *   get:
 *     summary: Busca um evento específico de um parceiro autenticado
 *     description: Retorna os detalhes de um evento criado pelo parceiro autenticado.
 *     tags:
 *       - Parceiros
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         description: ID do evento a ser buscado
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Detalhes do evento encontrado
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
 *                   example: "Uma conferência sobre inovação tecnológica."
 *                 date:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-20T14:00:00Z"
 *                 location:
 *                   type: string
 *                   example: "Centro de Convenções, São Paulo"
 *       403:
 *         description: Não autorizado (usuário não é um parceiro)
 *       404:
 *         description: Evento não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
partnerRoutes.get('/events/:eventId', async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user!.id;

    // consulta o banco de dados para verificar se existe um parceiro associado ao ID do usuário
    const partnerService = new PartnerService();
    const partner = await partnerService.findByUserId(userId);

    if (!partner) {
        res.status(403).json({ message: "Not authorized" });
        return;
    }

    const eventService = new EventService();
    const event = await eventService.findById(+eventId);

    if (!event || event.partner_id !== event.id) {
        res.status(404).json({ message: "Event not found" });
    }

    res.json(event);

});