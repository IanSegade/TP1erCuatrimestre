export class EventEnrollment {
    constructor({
      id, id_event, id_user, description, registrationDateTime, attended, observations, rating
    }) {
      this.id = id != null ? Number(id) : undefined;
      this.id_event = id_event != null ? Number(id_event) : undefined;
      this.id_user = id_user != null ? Number(id_user) : undefined;
      this.description = description;
      this.registrationDateTime = registrationDateTime;
      this.attended = attended == null ? false : Boolean(attended);
      this.observations = observations;
      this.rating = rating != null ? Number(rating) : undefined;
    }
  }
  