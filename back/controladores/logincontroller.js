require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Client } = require("pg");

const verifyLogin = async(req, res) => {
    const {user, password} = req.body;
    const username = user;
    const client = new Client({
        user: 'postgres',
        host: process.env.HOST,
        database: 'professoft',
        password: process.env.PASSWORD,
        port: 5432,
    });
    try {
        await client.connect();
        const user = await getUserFromDatabase(username, password, client);
        // req.session.isAuth = true;
        if (user) {
        res.status(200).json({
            username,
            // sessionId: req.session.id,
        });
        } else {
        res.status(200).json({ message: "Credenciales incorrectas" });
        }
    } catch (error) {
        console.error('Error al manejar la solicitud:', error);
        res.status(500).json({ message: "Error en el servidor" });
    } finally {
        if (client._connected) {
            await client.end();
            console.log('Cliente desconectado');
        }
    }
}

// Para consulta
async function getUserFromDatabase(username, password, client) {
  try {
    // Realizar una consulta SQL para verificar las credenciales
    const query_sal = {
      text: 'SELECT salt FROM public."users" WHERE name = $1',
      values: [username],
    }
    let sal = await client.query(query_sal);
    let hashed = await bcrypt.hash(password, sal.rows[0]['salt']);


    const query = {
      text: 'SELECT user FROM public."users" WHERE name = $1 AND hashed_pass = $2',
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
  }
}

module.exports = {
    verifyLogin,
}