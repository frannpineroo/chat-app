class Repositorio {
    constructor(model) {
        this.model = model;
    }

    async existe(id) {
    return await this.model.findUnique({
      where: { id }
    });
    }

    async insert(entidad) {
        const crear = await this.model.create({
            data: entidad
        });
        return crear.id;
    }

    async select() {
        return await this.model.findMany();
    }

    async selectById(id) {
        return await this.model.findUnique({
            where: { id }
        });
    }

    async update(id, entidad) {
        try {
            await this.model.update({
                where: { id },
                data: entidad
            });

            return true;
        
        } catch (error) {
            return false;
        }
    }

    async delete(id) {
      try {
        await this.model.delete({
          where: { id }
        });
        return true;
      } catch (error) {
        return false;
     }
    }
}

module.exports = Repositorio;
