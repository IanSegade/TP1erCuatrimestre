export default class Event {
    constructor({
      id, name, description, id_event_category, id_event_location, start_date,
      duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_creator_user
    }) {
      this.id = id != null ? Number(id) : undefined;
      this.name = name;
      this.description = description;
      this.id_event_category = id_event_category != null ? Number(id_event_category) : undefined;
      this.id_event_location = id_event_location != null ? Number(id_event_location) : undefined;
      this.start_date = start_date;
      this.duration_in_minutes = duration_in_minutes != null ? Number(duration_in_minutes) : undefined;
      this.price = price != null ? Number(price) : undefined;
      this.enabled_for_enrollment = enabled_for_enrollment == null ? true : Boolean(enabled_for_enrollment);
      this.max_assistance = max_assistance != null ? Number(max_assistance) : undefined;
      this.id_creator_user = id_creator_user != null ? Number(id_creator_user) : undefined;
    }
  }  