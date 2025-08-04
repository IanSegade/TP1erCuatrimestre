import jwt from 'jsonwebtoken';
import * as userRepositorio from '../repositories/users-repository.js';

const JWT_SECRET = process.env.JWT_SECRET || 'MiSecretoParaJWT_2025!';

export async function login(username, password) {
  const user = await userRepositorio.validarCredenciales(username, password);

  if (!user) {
    const error = new Error('Usuario o contraseña inválidos');
    error.codigo = 401;
    throw error;
  }

  const payload = {
    id: user.id,
    username: user.username,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  return { token, user };
}