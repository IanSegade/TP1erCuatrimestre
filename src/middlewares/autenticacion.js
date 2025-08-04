import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'MiSecretoParaJWT_2025!';

export function autenticacionMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: "No token proporcionado" });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Formato de token inválido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      id: Number(decoded.id),          // <- Aquí convierto a número
      username: decoded.username,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
