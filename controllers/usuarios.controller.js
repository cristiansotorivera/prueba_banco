import { ModelUsuarios } from "../models/usuarios.model.js";
import { handleError } from '../databases/errors.js';

const getAllUsuarios = async (req, res) => {
    try {
        const users = await ModelUsuarios.getAllUser();
        return res.json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Server error.' });
    }
};

const createUser = async (req, res) => {
    try {
        const { nombre, balance } = req.body;
        console.log(req.body);

        if (!nombre || !balance || !nombre.trim()) {
            return res.status(400).json({ ok: false, msg: 'El nombre y el balance son campos requeridos.' });
        }

        const newUser = { nombre, balance };
        const creacion = await ModelUsuarios.createUser(newUser);
        return res.json(creacion);
    } catch (error) {
        console.error(error);
        const { code, msg } = handleError(error);
        return res.status(code).json({ ok: false, msg });
    }
};

const removeUser = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ ok: false, msg: 'El ID es requerido.' });
        }

        const removeUser = await ModelUsuarios.removeUser(id);
        if (!removeUser) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado.' });
        }
        return res.json(removeUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Ocurrió un error al eliminar el usuario.' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.query;
        const { name, balance } = req.body;

        if (!id || !name || !balance || !name.trim() || !balance.trim()) {
            return res.status(400).json({ ok: false, msg: 'El ID, nombre y balance son campos requeridos.' });
        }

        const updateUser = { id, name, balance };
        const updateUsers = await ModelUsuarios.updateUser(updateUser);

        if (!updateUsers) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado.' });
        }

        return res.json(updateUsers);
    } catch (error) {
        console.error(error);
        const { code, msg } = handleError(error);
        return res.status(code).json({ ok: false, msg: 'Fallo al actualizar.' });
    }
};

export const ControllerUsuarios = {
    getAllUsuarios,
    createUser,
    removeUser,
    updateUser
};
