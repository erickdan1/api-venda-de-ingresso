import { Router } from "express";
import { AuthService, InvalidCredentialError } from "../services/auth-service";

export const authRoutes = Router();

// criação de login do usuário
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
