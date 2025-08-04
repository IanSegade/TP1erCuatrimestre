export default class Province {
    constructor({ id, name, full_name, latitude, longitude, display_order }) {
      this.id = id != null ? Number(id) : undefined;
      this.name = name;
      this.full_name = full_name;
      this.latitude = latitude != null ? Number(latitude) : undefined;
      this.longitude = longitude != null ? Number(longitude) : undefined;
      this.display_order = display_order != null ? Number(display_order) : undefined;
    }
}