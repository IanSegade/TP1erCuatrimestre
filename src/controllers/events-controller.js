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