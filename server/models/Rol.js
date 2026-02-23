const EntityBase = require ('./EntityBase');

class Rol extends EntityBase {
  constructor({id,nombre}) 
  {
    super({ id });
    this.nombre = nombre;
  }
}

module.exports = Rol;