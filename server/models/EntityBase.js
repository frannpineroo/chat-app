class EntityBase {
  constructor(id) {
    this.id = id;
  }

  get id() {
    return this.id;
  }

  set id(value) {
    this.id = value;
  }
}

module.exports = EntityBase;
