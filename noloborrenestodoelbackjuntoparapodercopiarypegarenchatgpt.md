
en cuanto a mi backend, la foto es el orden de las cosas y te paso el codigo 
import * as service from "../services/event_enrollments-service.js";

export async function manejarInscripcion(req, res) {
    const id_event = parseInt(req.params.id);
    const id_user = req.user.id;
    const description = req.body?.description || "";

    try {
        const inscripcion = await service.inscribirUsuario(id_event, id_user, description);
        return res.status(201).json(inscripcion);
    } catch (error) {
        return res.status(error.codigo || 500).json({ error: error.message });
    }
}

export async function manejarDesinscripcion(req, res) {
    const id_event = parseInt(req.params.id);
    const id_user = req.user.id;

    try {
        await service.desinscribirUsuario(id_event, id_user);
        return res.status(200).json({ mensaje: "Inscripción eliminada con éxito" });
    } catch (error) {
        return res.status(error.codigo || 500).json({ error: error.message });
    }
}

import * as service from "../services/event_locations-service.js";

export async function manejarObtenerTodas(req, res) {
    try {
        const ubicaciones = await service.obtenerTodas(req.user.id);
        res.status(200).json(ubicaciones);
    } catch (error) {
        res.status(error.codigo || 500).json({ error: error.message || error });
    }
}

export async function manejarObtenerUna(req, res) {
    try {
        const ubicacion = await service.obtenerUna(parseInt(req.params.id), req.user.id);
        res.status(200).json(ubicacion);
    } catch (error) {
        res.status(error.codigo || 500).json({ error: error.message || error });
    }
}

export async function manejarCrear(req, res) {
    try {
        const nueva = await service.crear({
            ...req.body,
            id_creator_user: req.user.id
        });
        res.status(201).json(nueva);
    } catch (error) {
        res.status(error.codigo || 500).json({ error: error.message || error });
    }
}

export async function manejarActualizar(req, res) {
    try {
        const actualizada = await service.actualizar(
            parseInt(req.params.id),
            req.user.id,
            req.body
        );
        res.status(200).json(actualizada);
    } catch (error) {
        res.status(error.codigo || 500).json({ error: error.message || error });
    }
}


export async function manejarEliminar(req, res) {
    try {
        await service.eliminar(parseInt(req.params.id), req.user.id);
        res.status(200).json({ mensaje: "Ubicación eliminada correctamente" });
    } catch (error) {
        res.status(error.codigo || 500).json({ error: error.message || error });
    }
}

import * as eventService from '../services/events-service.js';

export async function manejarObtenerEventoConDetalle(req, res) {
  const idEvento = req.params.id;

  try {
    const evento = await eventService.obtenerEventoConDetalleService(idEvento);
    res.status(200).json(evento);
  } catch (error) {
    if (error.codigo === 404) {
      return res.status(404).json({ error: error.message });
    }
    console.error("Error al obtener evento con detalle:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}

export async function manejarListarEventosPaginados(req, res) {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;

  try {
    const eventos = await eventService.listarEventosPaginadosService(limit, offset);
    res.status(200).json(eventos);
  } catch (error) {
    console.error("Error al listar eventos paginados:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}

export async function manejarBuscarEventos(req, res) {
  const { name, startdate, tag } = req.query;
  const filtros = { name, startdate, tag };

  try {
    const eventos = await eventService.buscarEventosService(filtros);
    res.status(200).json(eventos);
  } catch (error) {
    console.error("Error al buscar eventos:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}

export async function manejarCrearEvento(req, res){
  const usuario = req.user;
  if(!usuario){
    return res.status(401).json({ error: "No autorizado" });
  }
  const evento = req.body;

  try {
    const nuevo = await eventService.crearEventoService(evento, usuario.id);
    res.status(201).json(nuevo);
  } catch(error){
    if(error.codigo){
      return res.status(error.codigo).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
}

export async function manejarActualizarEvento(req, res) {
  const usuario = req.user;
  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }
  const evento = req.body;

  try {
    const actualizado = await eventService.actualizarEventoService(evento, usuario.id);
    return res.status(200).json(actualizado);
  } catch (error) {
    if (error.codigo) {
      return res.status(error.codigo).json({ error: error.message });
    }
    
    console.error("Error inesperado en manejarActualizarEvento:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function manejarEliminarEvento(req, res){
  const usuario = req.user;
  if(!usuario){
    return res.status(401).json({ error: "No autorizado" });
  }
  const idEvento = parseInt(req.params.id);

  try {
    const eliminado = await eventService.eliminarEventoService(idEvento, usuario.id);
    res.status(200).json(eliminado);
  } catch(error){
    if(error.codigo){
      return res.status(error.codigo).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
}

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

export default class EventCategory {
    constructor({ id, name, display_order }) {
      this.id = id != null ? Number(id) : undefined;
      this.name = name;
      this.display_order = display_order != null ? Number(display_order) : undefined;
    }
}

export default class EventEnrollment {
  constructor({
    id, id_event, id_user, description, registration_date_time, attended, observations, rating
  }) {
    this.id = id != null ? Number(id) : undefined;
    this.id_event = id_event != null ? Number(id_event) : undefined;
    this.id_user = id_user != null ? Number(id_user) : undefined;
    this.description = description;
    this.registration_date_time = registration_date_time;
    this.attended = attended == null ? false : Boolean(attended);
    this.observations = observations;
    this.rating = rating != null ? Number(rating) : undefined;
  }
}

export default class EventLocation {
    constructor({ id, id_location, name, full_address, max_capacity, latitude, longitude }) {
      this.id = id != null ? Number(id) : undefined;
      this.id_location = id_location != null ? Number(id_location) : undefined;
      this.name = name;
      this.full_address = full_address;
      this.max_capacity = max_capacity != null ? Number(max_capacity) : undefined;
      this.latitude = latitude != null ? Number(latitude) : undefined;
      this.longitude = longitude != null ? Number(longitude) : undefined;
    }
  }  

export default class Event {
    constructor({
      id, name, description, id_event_category, id_event_location, start_date,
      duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user
    }) {
      this.id = id != null ? Number(id) : undefined;
      this.name = name;
      this.description = description;
      this.id_event_category = id_event_category != null ? Number(id_event_category) : undefined;
      this.id_event_location = id_event_location != null ? Number(id_event_location) : undefined;
      this.start_date = start_date;
      this.duration_in_minutes = duration_in_minutes != null ? Number(duration_in_minutes) : undefined;
      this.price = price != null ? Number(price) : undefined;
      this.enabled_for_enrollment = enabled_for_enrollment == null ? true : Boolean(enabled_for_enrollment);
      this.max_assistance = max_assistance != null ? Number(max_assistance) : undefined;
      this.id_creator_user = id_creator_user != null ? Number(id_creator_user) : undefined;
    }
  }  

export default class Location {
    constructor({ id, name, id_province, latitude, longitude }) {
      this.id = id != null ? Number(id) : undefined;
      this.name = name;
      this.id_province = id_province != null ? Number(id_province) : undefined;
      this.latitude = latitude != null ? Number(latitude) : undefined;
      this.longitude = longitude != null ? Number(longitude) : undefined;
    }
  }  

export default class Province {
    constructor({ id, name, full_name, latitude, longitude, display_order }) {
      this.id = id != null ? Number(id) : undefined;
      this.name = name;
      this.full_name = full_name;
      this.latitude = latitude != null ? Number(latitude) : undefined;
      this.longitude = longitude != null ? Number(longitude) : undefined;
      this.display_order = display_order != null ? Number(display_order) : undefined;
    }
}

export default class Tag {
    constructor({ id, name }) {
      this.id = id != null ? Number(id) : undefined;
      this.name = name;
    }
  }  

export default class User {
    constructor({ id, first_name, last_name, username, password }) {
      this.id = id != null ? Number(id) : undefined;
      this.first_name = first_name;
      this.last_name = last_name;
      this.username = username;
      this.password = password;
    }
  }  

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
    SELECT DISTINCT
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
    LEFT JOIN event_tags et ON et.id_event = e.id
    LEFT JOIN tags t ON t.id = et.id_tag
    WHERE 1=1
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

import client from "../configs/db-config.js";
import User from '../entities/user.js';

export async function validarCredenciales(username, password) {
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const { rows } = await client.query(query, [username, password]);
  
    if (!rows[0]) return null;
  
    const user = new User(rows[0]);
    // Evitar devolver password
    user.password = undefined;
    return user;
  }

import * as repoService from "../repositories/event_enrollments-repository.js";

export async function inscribirUsuario(id_event, id_user, description = "") {
    const evento = await repoService.obtenerEventoPorId(id_event);
    if (!evento) {
        const error = new Error("Evento no encontrado");
        error.codigo = 404;
        throw error;
    }

    const fechaEvento = new Date(evento.start_date);
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    if (fechaEvento <= hoy) {
        const error = new Error("No se puede inscribir a un evento que ya sucedió o es hoy");
        error.codigo = 400;
        throw error;
    }

    if (!evento.enabled_for_enrollment) {
        const error = new Error("El evento no está habilitado para inscripción");
        error.codigo = 400;
        throw error;
    }

    const yaInscripto = await repoService.usuarioYaInscripto(id_event, id_user);
    if (yaInscripto) {
        const error = new Error("El usuario ya está inscripto en este evento");
        error.codigo = 400;
        throw error;
    }

    const inscriptos = await repoService.contarInscriptos(id_event);
    if (evento.max_assistance && inscriptos >= evento.max_assistance) {
        const error = new Error("Capacidad máxima alcanzada");
        error.codigo = 400;
        throw error;
    }

    return await repoService.registrarInscripcion(id_event, id_user, description);
}

export async function desinscribirUsuario(id_event, id_user) {
    const evento = await repoService.obtenerEventoPorId(id_event);
    if (!evento) {
        const error = new Error("Evento no encontrado");
        error.codigo = 404;
        throw error;
    }

    const fechaEvento = new Date(evento.start_date);
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    if (fechaEvento <= hoy) {
        const error = new Error("No se puede cancelar inscripción a un evento que ya sucedió o es hoy");
        error.codigo = 400;
        throw error;
    }

    const yaInscripto = await repoService.usuarioYaInscripto(id_event, id_user);
    if (!yaInscripto) {
        const error = new Error("El usuario no está inscripto en este evento");
        error.codigo = 400;
        throw error;
    }

    return await repoService.eliminarInscripcion(id_event, id_user);
}

import * as repo from "../repositories/event_locations-repository.js";

function validarDatos(data = {}) {
    if (!data.name || data.name.length < 3) {
        throw { codigo: 400, message: "El nombre debe tener al menos 3 caracteres" };
    }
    if (!data.full_address || data.full_address.length < 3) {
        throw { codigo: 400, message: "La dirección debe tener al menos 3 caracteres" };
    }
    if (!data.id_location || isNaN(data.id_location)) {
        throw { codigo: 400, message: "El id_location es inválido" };
    }
    if (!data.max_capacity || data.max_capacity <= 0) {
        throw { codigo: 400, message: "La capacidad máxima debe ser mayor que 0" };
    }
}

export async function obtenerTodas(id_user) {
    return await repo.obtenerTodasPorUsuario(id_user);
}

export async function obtenerUna(id, id_user) {
    const ubicacion = await repo.obtenerPorId(id, id_user);
    if (!ubicacion) {
        throw { codigo: 404, message: "Ubicación no encontrada o no pertenece al usuario" };
    }
    return ubicacion;
}

export async function crear(data) {
    validarDatos(data);
    return await repo.insertar(data);
}

export async function actualizar(id, id_user, data) {
    validarDatos(data);
    const actualizada = await repo.actualizar(id, id_user, data);
    if (!actualizada) {
        throw { codigo: 404, message: "Ubicación no encontrada o no pertenece al usuario" };
    }
    return actualizada;
}


export async function eliminar(id, id_user) {
    const eliminada = await repo.eliminar(id, id_user);
    if (!eliminada) {
        throw { codigo: 404, message: "Ubicación no encontrada o no pertenece al usuario" };
    }
    return eliminada;
}

import * as eventRepositorio from "../repositories/events-repository.js";

export async function obtenerEventoConDetalleService(idEvento) {
  if (!idEvento || isNaN(Number(idEvento))) {
    throw new Error("El idEvento proporcionado no es válido");
  }

  const evento = await eventRepositorio.obtenerEventoConDetalle(idEvento);

  if (!evento) {
    const error = new Error(`Evento con id ${idEvento} no encontrado`);
    error.codigo = 404;
    throw error;
  }

  return evento;
}

export async function listarEventosPaginadosService(limit = 10, offset = 0) {
  if (isNaN(Number(limit)) || isNaN(Number(offset))) {
    throw new Error("Los parámetros limit y offset deben ser números válidos");
  }
  return await eventRepositorio.listarEventosPaginados(Number(limit), Number(offset));
}

export async function buscarEventosService(filtros) {
  return await eventRepositorio.buscarEventos(filtros);
}

function validarEvento(evento, maxCapacity) {
  if(!evento.name || evento.name.length < 3) throw new Error("El nombre debe tener al menos 3 caracteres");
  if(!evento.description || evento.description.length <3) throw new Error("La descripción debe tener al menos 3 caracteres");
  if(evento.max_assistance > maxCapacity) throw new Error("La asistencia máxima no puede superar la capacidad del lugar");
  if(evento.price < 0) throw new Error("El precio no puede ser negativo");
  if(evento.duration_in_minutes < 0) throw new Error("La duración no puede ser negativa");
}

export async function crearEventoService(evento, idUsuario) {
  const maxCap = await eventRepositorio.obtenerCapacidadLugar(evento.id_event_location);
  if(maxCap === null) throw new Error("Ubicación inválida");

  validarEvento(evento, maxCap);
  evento.idCreatorUser = idUsuario;

  return await eventRepositorio.crearEvento(evento);
}

export async function actualizarEventoService(evento, idUsuario) {
  const existente = await eventRepositorio.obtenerEventoPorId(evento.id);
  if (!existente) {
    const e = new Error("Evento no encontrado");
    e.codigo = 404;
    throw e;
  }

  if (Number(existente.id_creator_user) !== Number(idUsuario)) {  
    const e = new Error("No autorizado a modificar");
    e.codigo = 401;
    throw e;
  }

  const maxCap = await eventRepositorio.obtenerCapacidadLugar(existente.id_event_location);
  if (maxCap === null) throw new Error("Ubicación inválida");

  validarEvento(evento, maxCap);

  return await eventRepositorio.actualizarEvento(evento);
}


export async function eliminarEventoService(idEvento, idUsuario) {
  const existente = await eventRepositorio.obtenerEventoPorId(idEvento);
  if(!existente){
    const e = new Error("Evento no encontrado");
    e.codigo = 404;
    throw e;
  }
  if(existente.id_creator_user !== idUsuario){
    const e = new Error("No autorizado a eliminar");
    e.codigo = 401;
    throw e;
  }

  const tieneInscrip = await eventRepositorio.tieneInscripciones(idEvento);
  if(tieneInscrip){
    const e = new Error("No se puede eliminar evento con inscripciones");
    e.codigo = 400;
    throw e;
  }

  return await eventRepositorio.eliminarEvento(idEvento);
}

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

import express from "express";
import cors from "cors";
import pkg, {Pool} from "pg";
import client from "./configs/db-config.js";
import * as eventController from './controllers/events-controller.js';
import * as userController from './controllers/users-controller.js';
import * as enrollmentController from './controllers/event_enrollments-controller.js';
import * as eventLocationController from './controllers/event_locations-controller.js';
import * as middlewares from './middlewares/autenticacion.js';

const { Client } = pkg;
const app = express();
const PORT = 3000;
client.connect();
app.use(cors());
app.use(express.json());

app.get('/api/event', eventController.manejarListarEventosPaginados); //2

app.get('/api/events', eventController.manejarBuscarEventos); //3

app.get('/api/event/:id', eventController.manejarObtenerEventoConDetalle); //4

app.post('/api/user/login', userController.manejarLogin); //5

app.post('/api/event', middlewares.autenticacionMiddleware, eventController.manejarCrearEvento); //6

app.put('/api/event', middlewares.autenticacionMiddleware, eventController.manejarActualizarEvento); //6

app.delete('/api/event/:id', middlewares.autenticacionMiddleware, eventController.manejarEliminarEvento); //6

app.post('/api/event/:id/enrollment', middlewares.autenticacionMiddleware, enrollmentController.manejarInscripcion); //7

app.delete('/api/event/:id/enrollment', middlewares.autenticacionMiddleware, enrollmentController.manejarDesinscripcion); //7

app.get('/api/event-location', middlewares.autenticacionMiddleware, eventLocationController.manejarObtenerTodas); //8

app.get('/api/event-location/:id', middlewares.autenticacionMiddleware, eventLocationController.manejarObtenerUna); //8

app.post('/api/event-location', middlewares.autenticacionMiddleware, eventLocationController.manejarCrear); //8

app.put('/api/event-location/:id', middlewares.autenticacionMiddleware, eventLocationController.manejarActualizar); //8

app.delete('/api/event-location/:id', middlewares.autenticacionMiddleware, eventLocationController.manejarEliminar); //8

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});