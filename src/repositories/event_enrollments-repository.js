import client from "../configs/db-config.js";

export async function obtenerEventoPorId(id_event) {
    const query = 'SELECT * FROM events WHERE id = $1';
    const { rows } = await client.query(query, [id_event]);
    return rows[0] || null;
}

export async function contarInscriptos(id_event) {
    const query = 'SELECT COUNT(*)::int AS total FROM event_enrollments WHERE id_event = $1';
    const { rows } = await client.query(query, [id_event]);
    return rows[0].total;
}

export async function usuarioYaInscripto(id_event, id_user) {
    const query = 'SELECT * FROM event_enrollments WHERE id_event = $1 AND id_user = $2';
    const { rows } = await client.query(query, [id_event, id_user]);
    return rows.length > 0;
}

export async function registrarInscripcion(id_event, id_user, description) {
    const query = `
        INSERT INTO event_enrollments (id_event, id_user, description, registration_date_time)
        VALUES ($1, $2, $3, NOW())
        RETURNING *`;
    const { rows } = await client.query(query, [id_event, id_user, description]);
    return rows[0];
}

export async function eliminarInscripcion(id_event, id_user) {
    const query = 'DELETE FROM event_enrollments WHERE id_event = $1 AND id_user = $2 RETURNING *';
    const { rows } = await client.query(query, [id_event, id_user]);
    return rows[0] || null;
}

export async function verificarInscripcion(id_event, id_user) {
    const query = 'SELECT * FROM event_enrollments WHERE id_event = $1 AND id_user = $2';
    const { rows } = await client.query(query, [id_event, id_user]);
    return rows.length > 0;
}
