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
