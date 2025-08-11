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

export async function manejarObtenerUsuarioToken(req, res) {
  const id_user = req.user?.id;

  if (!id_user) {
    return res.status(401).json({ error: "No autenticado" });
  }

    try {
        const user = await userService.obtenerUsuarioDesdeToken(id_user);
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(error.codigo || 500).json({ error: error.message });
    }
}