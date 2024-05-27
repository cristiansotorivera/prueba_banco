import { ModelTransferencias } from "../models/transferencia.model.js";

const getAllTransfer = async (req, res) => {
    try {
        const transfers = await ModelTransferencias.getAllTransfer();
        return res.json(transfers);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Error con transferencia.' });
    }
};

const putTransferencia = async (req, res) => {
    try {
        const { emisor, receptor, monto } = req.body;
        
        if (!emisor || !receptor || !monto || !emisor.trim() || !receptor.trim() || !monto.trim()) {
            return res.status(400).json({ ok: false, msg: 'Por favor completar todos los campos.' });
        }

        const transferencia = await ModelTransferencias.registrarTransaccion(emisor, receptor, monto);
        return res.status(201).json(transferencia);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, msg: 'Error de transferencia.' });
    }
};

export const ControllerTransferencias = {
    getAllTransfer,
    putTransferencia
};
