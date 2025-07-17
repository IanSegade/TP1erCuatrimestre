import { client } from '../configs/db-config.js'; // <-- Asegurate que exportás una INSTANCIA conectada
import { Event } from '../entities/event.js';
import { User } from '../entities/user.js';
import { EventLocation } from '../entities/event_location.js';

// db_query ahora ejecuta la consulta usando tu client real
async function db_query(query, params) {
  // Solo conectar la primera vez, si no está conectado (ideal Pool)
  if (!client._connected) await client.connect(); // ._connected depende de lib, omite si usás Pool
  const res = await client.query(query, params);
  return res.rows;
}

export const event_repository = {
  async find_all_paginated({ limit, offset }) {
    const query = `
      SELECT 
        events.*,
        users.id AS user_id,
        users.first_name,
        users.last_name,
        users.username,
        event_locations.id AS event_location_id,
        event_locations.name AS event_location_name,
        event_locations.full_address,
        event_locations.max_capacity,
        event_locations.latitude AS event_location_latitude,
        event_locations.longitude AS event_location_longitude
      FROM events
      JOIN users ON users.id = events.id_creator_user
      JOIN event_locations ON event_locations.id = events.id_event_location
      ORDER BY events.start_date DESC
      LIMIT $1 OFFSET $2
    `;
    const rows = await db_query(query, [limit, offset]);

    const items = rows.map(row =>
      new Event({
        id: row.id,
        name: row.name,
        description: row.description,
        id_event_category: row.id_event_category,
        id_event_location: row.id_event_location,
        start_date: row.start_date,
        duration_in_minutes: row.duration_in_minutes,
        price: row.price,
        enabled_for_enrollment: row.enabled_for_enrollment,
        max_assistance: row.max_assistance,
        id_creator_user: row.id_creator_user,
        creator_user: new User({
          id: row.user_id,
          first_name: row.first_name,
          last_name: row.last_name,
          username: row.username
        }),
        location: new EventLocation({
          id: row.event_location_id,
          name: row.event_location_name,
          full_address: row.full_address,
          max_capacity: row.max_capacity,
          latitude: row.event_location_latitude,
          longitude: row.event_location_longitude
        })
      })
    );

    const countRows = await db_query('SELECT COUNT(*) FROM events', []);
    return {
      items,
      total: Number(countRows[0].count),
    };
  }
};