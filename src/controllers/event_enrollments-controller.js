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