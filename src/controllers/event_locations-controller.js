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