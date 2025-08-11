import client from "../configs/db-config.js";
import User from '../entities/user.js';

export async function validarCredenciales(username, password) {
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const { rows } = await client.query(query, [username, password]);
  
    if (!rows[0]) return null;
  
    const user = new User(rows[0]);
    user.password = undefined;
    return user;
  }

  export async function obtenerUsuarioPorId(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const { rows } = await client.query(query, [id]);
    if (!rows[0]) return null;

    const user = new User(rows[0]);
    user.password = undefined;
    return user;
}