import { Router } from "express";
import { EventService } from "../services/event-service";

export const eventRoutes = Router();

// listar eventos (público)
eventRoutes.get('/', async (req, res) => {
    const eventService = new EventService();
    const result = await eventService.findAll();
    res.json(result);
});

// buscar evento por id
eventRoutes.get('/:eventId', async (req, res) => {
    const { eventId } = req.params;
    const eventService = new EventService();
    const event = await eventService.findById(+eventId);
    if (!event) {
        res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
});
