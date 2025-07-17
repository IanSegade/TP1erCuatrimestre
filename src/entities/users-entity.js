export class User {
    constructor({ id, firstName, lastName, username, password }) {
      this.id = id != null ? Number(id) : undefined;
      this.firstName = firstName;
      this.lastName = lastName;
      this.username = username;
      this.password = password;
    }
  }  