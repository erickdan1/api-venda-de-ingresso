import { Router } from "express";
import { CustomerService } from "../services/customer-service";

export const customerRoutes = Router();

// registro de clientes/consumidores
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Registra um novo cliente/consumidor
 *     description: Cria uma nova conta de cliente com nome, e-mail, senha, endereço e telefone.
 *     tags:
 *       - Clientes
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
 *               - address
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João da Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "joao@email.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "senhaSegura123"
 *               address:
 *                 type: string
 *                 example: "Rua das Flores, 123, Recife - PE"
 *               phone:
 *                 type: string
 *                 example: "+55 81 98765-4321"
 *     responses:
 *       201:
 *         description: Cliente registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   example: "Cliente cadastrado com sucesso!"
 *       400:
 *         description: Requisição inválida (dados faltando ou inválidos)
 *       500:
 *         description: Erro interno no servidor
 */
customerRoutes.post('/register', async (req, res) => {
    const { name, email, password, address, phone } = req.body;
    const customerService = new CustomerService();
    const result = await customerService.register({
        name, email, password, address, phone
    });
    res.status(201).json({result})
});