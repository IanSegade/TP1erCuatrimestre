export class EventCategory {
    constructor({ id, name, display_order }) {
      this.id = id != null ? Number(id) : undefined;
      this.name = name;
      this.display_order = display_order != null ? Number(display_order) : undefined;
    }
}