
import { PrismaClient } from "@prisma/client";
import Repositorio from "./Repositorio.js";
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

export default RolRepositorio;
