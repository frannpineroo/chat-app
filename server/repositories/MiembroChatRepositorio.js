import { prisma } from '../prisma/client';
import Repositorio from './Repositorio';

class MiembroChatRepositorio extends Repositorio {
    constructor() {
        super(prisma.MiembroChat); 
    }

    //async traerMiembros() {
    //    return await this.model.findMany();
    //}

    async buscarPorChatId(chatId) {
        return await this.model.findMany({
            where: {chatId: chatId}
        });
    }
    
    async buscarPorUsuarioId(usuarioId) {
        return await this.model.findMany({
            where: { usuarioId: usuarioId }
        });
    }

    //async crearMiembro(entidad) {
    //    try {
    //        const crear = await this.model.create({
    //            data: entidad
    //        });

    //        return crear.id;

    //    } catch (error) {
    //        throw error;
    //    }
    //}

    //async actualizarMiembro(id, entidad) {
      //  if (id !== entidad.id) {
        //    return false;
        //}

        //const existe = await this.model.findUnique({
          //  where: { id }
        //});

        //if (!existe) return false;

        //try {
        //    await this.model.update({
        //        where: { id },
        //        data: entidad
        //    });

        //    return true;

        //} catch (error) {
        //    throw error;
       // }
    //}

    //async borrar(id) {
      //  const entidad = await this.model.findUnique({
        //    where: { id }
        //});

        //if (!entidad) return false;

        //await this.model.delete({
        //    where: { id }
        //});

        //return true;
    //}
}

export default MiembroChatRepositorio;
