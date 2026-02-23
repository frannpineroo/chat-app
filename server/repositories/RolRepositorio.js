
const {PrismaClient} = require ('@prisma/client');
const Repositorio = require ("./Repositorio.js");
const prisma = new PrismaClient();

class RolRepositorio extends Repositorio {
    constructor() {
        super(prisma.rol);
    }
  
    async buscarPorNombre(nombre) {
    return this.model.findUnique({
      where: { nombre }
    });
  }
}

module.exports = RolRepositorio;
