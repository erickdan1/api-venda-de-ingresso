import { Router } from "express";
import { PartnerService } from "../services/partner-service";
import { EventService } from "../services/event-service";

export const partnerRoutes = Router();

// registro de parceiros
partnerRoutes.post('/register', async (req, res) => {
    const { name, email, password, company_name } = req.body;
    const partnerSevice = new PartnerService();
    const result = await partnerSevice.register({name, email, password, company_name});
    res.status(201).json({result});
});

// registro de eventos de parceiros
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