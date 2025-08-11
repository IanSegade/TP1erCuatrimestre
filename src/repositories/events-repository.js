import client from "../configs/db-config.js";
import Event from '../entities/event.js';
import User from '../entities/user.js';
import EventLocation from '../entities/event_location.js';
import Location from '../entities/location.js';
import Province from '../entities/province.js';
import Tag from '../entities/tag.js';

export async function obtenerEventoConDetalle(idEvento) {
  const query = `
    SELECT 
      e.*, 
      u.id as user_id, u.first_name, u.last_name, u.username,
      el.id as event_location_id, el.name as event_location_name, el.full_address,
      loc.id as location_id, loc.name as location_name,
      p.id as province_id, p.name as province_name,
      t.id as tag_id, t.name as tag_name
    FROM events e
    JOIN users u ON e.id_creator_user = u.id
    JOIN event_locations el ON e.id_event_location = el.id
    JOIN locations loc ON el.id_location = loc.id
    JOIN provinces p ON loc.id_province = p.id
    LEFT JOIN event_tags et ON et.id_event = e.id
    LEFT JOIN tags t ON t.id = et.id_tag
    WHERE e.id = $1
  `;

  const { rows } = await client.query(query, [idEvento]);
  if (rows.length === 0) return null;
  
  const filaBase = rows[0];
  const evento = new Event(filaBase);

  evento.creatorUser = new User({
    id: filaBase.user_id,
    firstName: filaBase.first_name,
    lastName: filaBase.last_name,
    username: filaBase.username
  });

  evento.eventLocation = new EventLocation({
    id: filaBase.event_location_id,
    name: filaBase.event_location_name,
    fullAddress: filaBase.full_address,
    location: new Location({
      id: filaBase.location_id,
      name: filaBase.location_name,
      province: new Province({
        id: filaBase.province_id,
        name: filaBase.province_name
      })
    })
  });

  evento.tags = [];
  rows.forEach(row => {
    if (row.tag_id && !evento.tags.find(t => t.id === row.tag_id)) {
      evento.tags.push(new Tag({ id: row.tag_id, name: row.tag_name }));
    }
  });

  return evento;
}

export async function listarEventosPaginados(limit, offset) {
  const query = `
    SELECT 
      e.id, e.name, e.description, e.start_date, e.duration_in_minutes, e.price,
      e.enabled_for_enrollment, el.max_capacity,
      u.id as user_id, u.first_name, u.last_name, u.username,
      el.id as event_location_id, el.name as event_location_name, el.full_address,
      loc.id as location_id, loc.name as location_name,
      p.id as province_id, p.name as province_name
    FROM events e
    JOIN users u ON e.id_creator_user = u.id
    JOIN event_locations el ON e.id_event_location = el.id
    JOIN locations loc ON el.id_location = loc.id
    JOIN provinces p ON loc.id_province = p.id
    ORDER BY e.start_date DESC
    LIMIT $1 OFFSET $2
  `;

  const { rows } = await client.query(query, [limit, offset]);
  return rows.map(row => {
    const evento = new Event(row);
    evento.creatorUser = new User({
      id: row.user_id,
      firstName: row.first_name,
      lastName: row.last_name,
      username: row.username
    });
    evento.eventLocation = new EventLocation({
      id: row.event_location_id,
      name: row.event_location_name,
      fullAddress: row.full_address,
      location: new Location({
        id: row.location_id,
        name: row.location_name,
        province: new Province({
          id: row.province_id,
          name: row.province_name
        })
      })
    });
    evento.maxCapacity = row.max_capacity;
    return evento;
  });
}

export async function buscarEventos(filtros) {
  let query = `
  SELECT 
  e.*, 
  u.id as user_id, u.first_name, u.last_name, u.username,
  el.id as event_location_id, el.name as event_location_name, el.full_address,
  loc.id as location_id, loc.name as location_name,
  p.id as province_id, p.name as province_name,
  t.id as tag_id, t.name as tag_name
  FROM events e
  JOIN users u ON e.id_creator_user = u.id
  JOIN event_locations el ON e.id_event_location = el.id
  JOIN locations loc ON el.id_location = loc.id
  JOIN provinces p ON loc.id_province = p.id
  LEFT JOIN event_tags et ON et.id_event = e.id
  LEFT JOIN tags t ON t.id = et.id_tag
  WHERE e.id = $1
  `;

  const params = [];
  let idx = 1;

  if (filtros.name) {
    query += ` AND e.name ILIKE '%' || $${idx} || '%'`;
    params.push(filtros.name);
    idx++;
  }

  if (filtros.startdate) {
    query += ` AND e.start_date::date = $${idx}`;
    params.push(filtros.startdate);
    idx++;
  }

  if (filtros.tag) {
    query += ` AND t.name ILIKE '%' || $${idx} || '%'`;
    params.push(filtros.tag);
    idx++;
  }

  query += ` ORDER BY e.start_date DESC`;

  const { rows } = await client.query(query, params);

  return rows.map(row => {
    const evento = new Event(row);
    evento.creatorUser = new User({
      id: row.user_id,
      firstName: row.first_name,
      lastName: row.last_name,
      username: row.username
    });
    evento.eventLocation = new EventLocation({
      id: row.event_location_id,
      name: row.event_location_name,
      fullAddress: row.full_address,
      location: new Location({
        id: row.location_id,
        name: row.location_name,
        province: new Province({
          id: row.province_id,
          name: row.province_name
        })
      })
    });
    evento.maxCapacity = row.max_capacity;
    return evento;
  });
}

export async function crearEvento(evento) {
  const query = `
    INSERT INTO events
      (name, description, id_event_category, id_event_location, start_date, duration_in_minutes,
       price, enabled_for_enrollment, max_assistance, id_creator_user)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *
  `;
  const values = [
    evento.name, evento.description, evento.id_event_category, evento.id_event_location,
    evento.start_Date, evento.duration_in_minutes, evento.price, evento.enabled_for_enrollment,
    evento.max_assistance, evento.id_creator_user
  ];
  const { rows } = await client.query(query, values);
  return new Event(rows[0]);
}

export async function obtenerEventoPorId(id) {
  const query = `SELECT * FROM events WHERE id = $1`;
  const { rows } = await client.query(query, [id]);
  if(!rows[0]) return null;
  return new Event(rows[0]);
}

export async function actualizarEvento(evento) {
  const query = `
    UPDATE events SET
    name=$1, description=$2, id_event_category=$3, id_event_location=$4,
    start_date=$5, duration_in_minutes=$6, price=$7,
    enabled_for_enrollment=$8, max_assistance=$9
    WHERE id=$10
    RETURNING *
  `;
  const values = [
    evento.name, evento.description, evento.idEventCategory, evento.idEventLocation,
    evento.startDate, evento.durationInMinutes, evento.price, evento.enabledForEnrollment,
    evento.maxAssistance, evento.id
  ];
  const { rows } = await client.query(query, values);
  if(!rows[0]) return null;
  return new Event(rows[0]);
}

export async function eliminarEvento(id) {
  const query = `DELETE FROM events WHERE id = $1 RETURNING *`;
  const { rows } = await client.query(query, [id]);
  if(!rows[0]) return null;
  return new Event(rows[0]);
}

export async function tieneInscripciones(idEvento) {
  const query = `SELECT COUNT(*) FROM event_enrollments WHERE id_event = $1`;
  const { rows } = await client.query(query, [idEvento]);
  return parseInt(rows[0].count,10) > 0;
}

export async function obtenerCapacidadLugar(idEventLocation) {
  const query = `SELECT max_capacity FROM event_locations WHERE id = $1`;
  const { rows } = await client.query(query, [idEventLocation]);
  if (!rows[0]) return null;
  return parseInt(rows[0].max_capacity, 10);
}

export async function obtenerEventosPorUsuario(idUsuario) {
  const query = `
    SELECT 
      e.*, 
      u.id as user_id, u.first_name, u.last_name, u.username,
      el.id as event_location_id, el.name as event_location_name, el.full_address,
      loc.id as location_id, loc.name as location_name,
      p.id as province_id, p.name as province_name,
      t.id as tag_id, t.name as tag_name
    FROM events e
    JOIN users u ON e.id_creator_user = u.id
    JOIN event_locations el ON e.id_event_location = el.id
    JOIN locations loc ON el.id_location = loc.id
    JOIN provinces p ON loc.id_province = p.id
    LEFT JOIN event_tags et ON et.id_event = e.id
    LEFT JOIN tags t ON t.id = et.id_tag
    WHERE e.id_creator_user = $1
    ORDER BY e.start_date DESC
  `;

  const { rows } = await client.query(query, [idUsuario]);
  if (rows.length === 0) return [];

  const eventosMap = new Map();

  rows.forEach(row => {
    if (!eventosMap.has(row.id)) {
      const evento = new Event(row);

      evento.creatorUser = new User({
        id: row.user_id,
        firstName: row.first_name,
        lastName: row.last_name,
        username: row.username
      });

      evento.eventLocation = new EventLocation({
        id: row.event_location_id,
        name: row.event_location_name,
        fullAddress: row.full_address,
        location: new Location({
          id: row.location_id,
          name: row.location_name,
          province: new Province({
            id: row.province_id,
            name: row.province_name
          })
        })
      });

      evento.tags = [];
      eventosMap.set(row.id, evento);
    }

    const evento = eventosMap.get(row.id);
    if (row.tag_id && !evento.tags.find(t => t.id === row.tag_id)) {
      evento.tags.push(new Tag({ id: row.tag_id, name: row.tag_name }));
    }
  });

  return Array.from(eventosMap.values());
}