import { event_service } from '../services/events-service.js';

export const event_controller = {
  async list(req, res) {
    try {
      const page = Number(req.query.page) || 1;
      const page_size = Number(req.query.page_size) || 10;
      const data = await event_service.list_events({ page, page_size });
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};