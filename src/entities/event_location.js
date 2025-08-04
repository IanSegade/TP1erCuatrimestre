export default class EventLocation {
    constructor({ id, id_location, name, full_address, max_capacity, latitude, longitude }) {
      this.id = id != null ? Number(id) : undefined;
      this.id_location = id_location != null ? Number(id_location) : undefined;
      this.name = name;
      this.full_address = full_address;
      this.max_capacity = max_capacity != null ? Number(max_capacity) : undefined;
      this.latitude = latitude != null ? Number(latitude) : undefined;
      this.longitude = longitude != null ? Number(longitude) : undefined;
    }
  }  