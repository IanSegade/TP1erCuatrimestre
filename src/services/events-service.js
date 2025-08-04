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
