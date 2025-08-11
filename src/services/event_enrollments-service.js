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

export async function verificarInscripcion(id_event, id_user) {
    return await repoService.usuarioYaInscripto(id_event, id_user);
}