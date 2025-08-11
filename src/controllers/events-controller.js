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

export async function manejarObtenerEventosPorUsuario(req, res) {
  const usuario = req.user;

  if (!usuario) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const eventos = await eventService.obtenerEventosPorUsuarioService(usuario.id);
    res.status(200).json(eventos);
  } catch (error) {
    if (error.codigo) {
      return res.status(error.codigo).json({ error: error.message });
    }
    console.error("Error al obtener eventos por usuario:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}