import { Router } from "express";
import { AuthService, InvalidCredentialError } from "../services/auth-service";

export const authRoutes = Router();

// criação de login do usuário
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autenticação do usuário
 *     description: Realiza o login do usuário e retorna um token de acesso.
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@email.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "senhaSegura123"
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna um token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unexpected error occurred"
 */
authRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const authService = new AuthService();
    try {
        const token = await authService.login(email, password);
        res.json({token});
    } catch (e) {
        console.error(e);
        if (e instanceof InvalidCredentialError) {
            res.status(401).json({message: 'Invalid credentials'});
        }

        res.status(500).json({message: 'Unexpected error occourred'});
    }
});
