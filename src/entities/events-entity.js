export class Event {
    constructor({
      id, name, description, id_event_category, id_event_location, startDate,
      durationInMinutes, price, enabledForEnrollment, maxAssistance, id_creator_user
    }) {
      this.id = id != null ? Number(id) : undefined;
      this.name = name;
      this.description = description;
      this.id_event_category = id_event_category != null ? Number(id_event_category) : undefined;
      this.id_event_location = id_event_location != null ? Number(id_event_location) : undefined;
      this.startDate = startDate;
      this.durationInMinutes = durationInMinutes != null ? Number(durationInMinutes) : undefined;
      this.price = price != null ? Number(price) : undefined;
      this.enabledForEnrollment = enabledForEnrollment == null ? true : Boolean(enabledForEnrollment);
      this.maxAssistance = maxAssistance != null ? Number(maxAssistance) : undefined;
      this.id_creator_user = id_creator_user != null ? Number(id_creator_user) : undefined;
    }
  }  