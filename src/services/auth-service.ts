import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/user-model';

export class AuthService {

    async login(email: string, password: string) {
        const userModel = await UserModel.findByEmail(email);
        // se o usuário existe e a senha fornecida for válida
        if (userModel && bcrypt.compareSync(password, userModel.password)) {
            // gera um token JWT para autenticação, incluindo o ID e e-mail do usuário
            return jwt.sign({ id: userModel.id, email: userModel.email }, "123456", {
            expiresIn: "1h", // Token válido por 1 hora
            });
        } else {
            throw new InvalidCredentialError();
        }   
    }

}

export class InvalidCredentialError extends Error {}