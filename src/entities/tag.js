export default class Tag {
    constructor({ id, name }) {
      this.id = id != null ? Number(id) : undefined;
      this.name = name;
    }
  }  