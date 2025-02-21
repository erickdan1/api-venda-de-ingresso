import express from 'express';
import jwt from 'jsonwebtoken';
import { Database } from './database';
import { authRoutes } from './controllers/auth-controller';
import { partnerRoutes } from './controllers/partner-controller';
import { customerRoutes } from './controllers/customer-controller';
import { eventRoutes } from './controllers/event-controller';
import { UserService } from './services/user-service';
import { ticketRoutes } from './controllers/ticket-controller';

const app = express();

app.use(express.json());

// define um array de rotas que não requerem autenticação
const unprotectedRoutes = [
    { method: "POST", path: "/auth/login" },
    { method: "POST", path: "/customers/register" },
    { method: "POST", path: "/partners/register" },
    { method: "GET", path: "/events" },
];

// middleware para verificar autenticação
app.use(async (req, res, next) => {
    // verifica se a rota atual está na lista de rotas não protegidas
    const isUnprotectedRoute = unprotectedRoutes.some(
        (route) => route.method == req.method && req.path.startsWith(route.path)
    );
    
    // se for uma rota não protegida, permite o acesso sem autenticação
    if (isUnprotectedRoute) {
        return next(); // passa o controle para o próximo middleware ou rota
    }

    // obtém o token do header de autorização
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    try {
        // verifica o token usando JWT e decodifica o payload
        const payload = jwt.verify(token, "123456") as {
            id: number;
            email: string;
        };
        const userService = new UserService();
        const user = await userService.findById(payload.id);

        if (!user) {
            res.status(401).json({ message: "Failed to authenticate token" });
            return;
        }
        
        // armazena o usuário no objeto da requisição para uso posterior
        req.user = user as { id: number; email: string };
        next();
    } catch (error) {
        res.status(401).json({ message: "Failed to authenticate token" });
    }
});

app.get('/', (req, res) => {
    res.json({message: "Hello World!"});
});

app.use('/auth', authRoutes);
app.use('/partners', partnerRoutes);
app.use('/customers', customerRoutes);
app.use('/events', eventRoutes);
app.use('/events', ticketRoutes);

app.listen(3000, async () => {
    const connection = Database.getInstance();
    // limpar tabelas
    await connection.execute("SET FOREIGN_KEY_CHECKS = 0"); // desativa temporariamente a verificação de chaves estrangeiras
    await connection.execute("TRUNCATE TABLE tickets");
    await connection.execute("TRUNCATE TABLE events");
    await connection.execute("TRUNCATE TABLE customers");
    await connection.execute("TRUNCATE TABLE partners");
    await connection.execute("TRUNCATE TABLE users");
    await connection.execute("SET FOREIGN_KEY_CHECKS = 1"); // ativa a verificação de chaves estrangeiras

    console.log('Running in http://localhost:3000');
});