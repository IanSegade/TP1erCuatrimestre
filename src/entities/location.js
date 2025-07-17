export class Location {
    constructor({ id, name, id_province, latitude, longitude }) {
      this.id = id != null ? Number(id) : undefined;
      this.name = name;
      this.id_province = id_province != null ? Number(id_province) : undefined;
      this.latitude = latitude != null ? Number(latitude) : undefined;
      this.longitude = longitude != null ? Number(longitude) : undefined;
    }
  }  