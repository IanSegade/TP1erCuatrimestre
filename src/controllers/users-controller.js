import * as userService from '../services/users-service.js';

export async function manejarLogin(req, res) {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
    }
  
    try {
      const { token, user } = await userService.login(username, password);
      res.json({ token, user });
    } catch (error) {
      if (error.codigo === 401) {
        return res.status(401).json({ error: error.message });
      }
      console.error("Error en login:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  }