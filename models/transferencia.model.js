import { pool } from "../databases/connection.js";

const getAllTransfer = async () => {
    const { rows } = await pool.query(`SELECT 
    t.id AS transferencia_id,
    e.id AS emisor_id,
    e.nombre AS emisor_nombre,
    r.id AS receptor_id,
    r.nombre AS receptor_nombre,
    t.monto,
    t.fecha
FROM 
    transferencias t
JOIN 
    usuarios e ON t.emisor = e.id
JOIN 
    usuarios r ON t.receptor = r.id;`)
    return rows

}

const registrarTransaccion = async (emisor, receptor, monto) => {
    try {
        await pool.query('BEGIN')

        const query1 = {
            text: `
        UPDATE USUARIOS
        SET BALANCE = BALANCE - $1
        WHERE ID = $2
        `,
            values: [monto, emisor]
        }

        await pool.query(query1)

        const query2 = {
            text: `
            UPDATE USUARIOS
            SET BALANCE = BALANCE + $1
            WHERE ID = $2
        `,
            values: [monto, receptor]
        }

        await pool.query(query2)

        const query3 = {
            text: `
          INSERT INTO TRANSFERENCIAS (EMISOR,RECEPTOR,MONTO,FECHA) VALUES ($1,$2,$3, NOW()) RETURNING *
        `,
            values: [emisor, receptor, monto]
        }

        const { rows } = await pool.query(query3)
        await pool.query('COMMIT')

        return rows[0]

    } catch (error) {
        console.log(error)
        await pool.query('ROLLBACK')

    }
}


export const ModelTransferencias = {
    getAllTransfer,
    registrarTransaccion
}