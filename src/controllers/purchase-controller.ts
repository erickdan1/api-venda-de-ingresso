import { Request, Response, Router } from "express";
import { PurchaseService } from "../services/purchase-service";
import { CustomerService } from "../services/customer-service";
import { PaymentService } from "../services/payment-service";

export const purchaseRoutes = Router();

/**
 * @swagger
 * /purchases:
 *   post:
 *     summary: Realiza uma compra de ingressos
 *     description: Permite que um cliente autenticado compre ingressos utilizando um cartão de crédito.
 *     tags:
 *       - Compras
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticket_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *               card_token:
 *                 type: string
 *                 example: "tok_123456789abcdef"
 *     responses:
 *       201:
 *         description: Compra realizada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 customerId:
 *                   type: integer
 *                   example: 5
 *                 ticketIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [1, 2, 3]
 *                 status:
 *                   type: string
 *                   example: "confirmed"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-07-21T15:30:00Z"
 *       400:
 *         description: O usuário não é um cliente válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User needs to be a customer"
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
 *       500:
 *         description: Erro inesperado no processamento da compra.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unexpected error occurred"
 */
purchaseRoutes.post("/", async (req: Request, res: Response) => {
    const customerService = new CustomerService();
    const customer = await customerService.findByUserId(req.user!.id);

    if(!customer){
        res.status(400).json({message: "User needs be a customer"})
        return;
    }

    const { ticket_ids, card_token } = req.body;
    //design pattern - factory | container de serviços
    const paymentService = new PaymentService()
    const purchaseService = new PurchaseService(paymentService);
    const newPurchaseId = await purchaseService.create({
        customerId: customer.id,
        ticketIds: ticket_ids,
        cardToken: card_token,
    });
    
    const purchase = await purchaseService.findById(newPurchaseId);

    res.status(201).json(purchase);
});