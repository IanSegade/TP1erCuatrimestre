export class User {
    constructor({ id, first_name, last_name, username, password }) {
      this.id = id != null ? Number(id) : undefined;
      this.first_name = first_name;
      this.last_name = last_name;
      this.username = username;
      this.password = password;
    }
  }  