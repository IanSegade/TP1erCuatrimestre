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