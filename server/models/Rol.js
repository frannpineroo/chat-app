import EntityBase from './EntityBase';

class Rol extends EntityBase {
  constructor({id,nombre}) 
  {
    super({ id });
    this.nombre = nombre;
  }
}

export default Rol;