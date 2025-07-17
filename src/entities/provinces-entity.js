export class Province {
    constructor({ id, name, fullName, latitude, longitude, displayOrder }) {
      this.id = id != null ? Number(id) : undefined;
      this.name = name;
      this.fullName = fullName;
      this.latitude = latitude != null ? Number(latitude) : undefined;
      this.longitude = longitude != null ? Number(longitude) : undefined;
      this.displayOrder = displayOrder != null ? Number(displayOrder) : undefined;
    }
  }  