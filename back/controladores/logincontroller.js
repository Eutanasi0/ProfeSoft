const bcrypt = require('bcryptjs');
const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: process.env.HOST,
    database: 'professoft',
    password: process.env.PASSWORD,
    port: 5432,
})

const verifyLogin = async(req, res) => {
    console.log(req.session);
    const {user, password} = req.body;
    const username = user; // El username aquí es el email, no lo cambié
    try {
      const user = await getUserFromDatabase(username, password);
      if (user) {
        req.session.isAuth = true,
        res.status(200).json({
            username,
            sessionId: req.session.id,
        });
        } else {
        res.status(200).json({ message: "Credenciales incorrectas" });
        }
    } catch (error) {
        console.error('Error al manejar la solicitud:', error);
        res.status(500).json({ message: "Error en el servidor" });
    }
}

// Para consulta
async function getUserFromDatabase(username, password) {
    const client = await pool.connect();
    try {
        // Realizar una consulta SQL para verificar las credenciales
        const query_sal = {
            text: 'SELECT salt FROM public."users" WHERE email = $1',
            values: [username],
        }
        let sal = await client.query(query_sal);
        let hashed = await bcrypt.hash(password, sal.rows[0]['salt']);


        const query = {
            text: 'SELECT user FROM public."users" WHERE email = $1 AND hashed_pass = $2',
            values: [username, hashed],
        }

        const result = await client.query(query);

        if (result.rows.length === 1) {
            const user = result.rows[0];
            return {
                id: user,
            };
        } else {
            return null;
        }
    } catch (error) {
        console.log('No existen esos datos');
        return null;
    } finally {
        client.release();
    }
}

module.exports = {
    verifyLogin,
}