export class EventLocation {
    constructor({ id, id_location, name, fullAddress, maxCapacity, latitude, longitude }) {
      this.id = id != null ? Number(id) : undefined;
      this.id_location = id_location != null ? Number(id_location) : undefined;
      this.name = name;
      this.fullAddress = fullAddress;
      this.maxCapacity = maxCapacity != null ? Number(maxCapacity) : undefined;
      this.latitude = latitude != null ? Number(latitude) : undefined;
      this.longitude = longitude != null ? Number(longitude) : undefined;
    }
  }  