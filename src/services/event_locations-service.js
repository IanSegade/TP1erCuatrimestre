import * as repo from "../repositories/event_locations-repository.js";

function validarDatos({ name, full_address, id_location, max_capacity }) {
    if (!name || name.trim().length < 3) {
        throw { codigo: 400, message: "El nombre debe tener al menos 3 caracteres" };
    }
    if (!full_address || full_address.trim().length < 3) {
        throw { codigo: 400, message: "La dirección debe tener al menos 3 caracteres" };
    }
    if (!id_location || isNaN(id_location)) {
        throw { codigo: 400, message: "El id_location es inválido" };
    }
    if (!max_capacity || max_capacity <= 0) {
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