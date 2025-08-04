import client from "../configs/db-config.js";

export async function obtenerTodasPorUsuario(id_user) {
    const query = `
        SELECT * FROM event_locations
        WHERE id_creator_user = $1
        ORDER BY id ASC
    `;
    const { rows } = await client.query(query, [id_user]);
    return rows;
}

export async function obtenerPorId(id, id_user) {
    const query = `
        SELECT * FROM event_locations
        WHERE id = $1 AND id_creator_user = $2
    `;
    const { rows } = await client.query(query, [id, id_user]);
    return rows[0] || null;
}

export async function insertar(data) {
    const query = `
        INSERT INTO event_locations
        (name, full_address, id_location, max_capacity, id_creator_user)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    const values = [
        data.name,
        data.full_address,
        data.id_location,
        data.max_capacity,
        data.id_creator_user
    ];
    const { rows } = await client.query(query, values);
    return rows[0];
}

export async function actualizar(id, id_user, data) {
    const query = `
        UPDATE event_locations
        SET name = $1, full_address = $2, id_location = $3, max_capacity = $4
        WHERE id = $5 AND id_creator_user = $6
        RETURNING *
    `;
    const values = [
        data.name,
        data.full_address,
        data.id_location,
        data.max_capacity,
        id,
        id_user
    ];
    const { rows } = await client.query(query, values);
    return rows[0] || null;
}

export async function eliminar(id, id_user) {
    const query = `
        DELETE FROM event_locations
        WHERE id = $1 AND id_creator_user = $2
        RETURNING *
    `;
    const { rows } = await client.query(query, [id, id_user]);
    return rows[0] || null;
}