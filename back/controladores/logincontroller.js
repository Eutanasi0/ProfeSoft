const bcrypt = require('bcryptjs');
const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: process.env.HOST,
    database: 'profesoft',
    password: process.env.PASSWORD,
    port: 5432,
})

const verifyLogin = async(req, res) => {
    const {user, password} = req.body;
    const username = user; // El username aquí es el email, no lo cambié
    try {
        let response;
        let activate = await verifyactivation(username)
        let message = "";
        if(activate.rows[0].activate){
            response = await getUserFromDatabase(username, password);
        } else{
            response = null;
            message += " o confirma tu correo antes de logearte";
        }

        if (response) {
            req.session.isAuth = true,
            res.status(200).json({
                username,
                sessionId: req.session.id,
                response
            });
        } else {
            res.status(200).json({ msg: "Credenciales incorrectas" + message});
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
            text: 'SELECT name FROM public."users" WHERE email = $1 AND hashed_pass = $2',
            values: [username, hashed],
        }

        const result = await client.query(query);

        if (result.rows.length === 1) {
            const userInfo = result.rows[0];
            return {
                id: userInfo,
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

async function verifyactivation(username) {
    const client = await pool.connect();
    try {
        const query_verify_account = {
            text: 'SELECT activate FROM public."users" WHERE email = $1',
            values: [username],
        }
        result = await client.query(query_verify_account);
        return result
    } catch (error) {
        console.log(error)
        return null
    } finally {
        client.release();
    }
}

const auth = async(req, res, next)=>{
    if(!req.session.isAuth){
        res.status(500).json({msg:"No estás logeado"})
    } else{
        next();
    }
}

module.exports = {
    verifyLogin,
    auth,
}
