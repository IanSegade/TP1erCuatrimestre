export class EventCategory {
    constructor({ id, name, displayOrder }) {
      this.id = id != null ? Number(id) : undefined;
      this.name = name;
      this.displayOrder = displayOrder != null ? Number(displayOrder) : undefined;
    }
}  