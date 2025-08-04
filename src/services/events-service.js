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