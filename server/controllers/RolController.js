import { Router } from "express";
import RolRepositorio from "../repositories/RolRepositorio.js";

const router = Router();
const Rol = new RolRepositorio();

router.get("/", async (req, res) => {
    try {
        const roles = await Rol.select();

        if (!roles || roles.length === 0) {
            return res.status(404).json({
                message: "No se encuentran roles."
            });
        }

        return res.json(roles);

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
});


router.post("/", async (req, res) => {
    try {
        const dtoRol = req.body;

        const nuevoRol = await Rol.insert(dtoRol);

        return res.status(201).json(nuevoRol.id);

    } catch (error) {
        return res.status(400).json({
            message: `Error al crear el rol: ${error.message}`
        });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const dtoRol = req.body;

        if (id !== dtoRol.id) {
            return res.status(400).json({
                message: "Datos inválidos."
            });
        }

        const actualizado = await Rol.update(id, dtoRol);

        if (!actualizado) {
            return res.status(400).json({ message: "No se pudo actualizar el rol." });
        }

        return res.json({
            message: "Rol actualizado correctamente."
        });

    } catch (error) {
        return res.status(400).json({
            message: `Error al actualizar el rol: ${error.message}`
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const eliminado = await Rol.delete(id);
        
        if (!eliminado) {
            return res.status(400).json({ message: "No se pudo eliminar el rol." });
        }

        return res.json({
            message: "Rol eliminado."
        });

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });
    }
});

export default router;
