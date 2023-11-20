const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',
    host: process.env.HOST,
    database: 'professoft',
    password: process.env.PASSWORD,
    port: 5432,
})

const getComments = async(req, res) =>{
    const client = await pool.connect();
    const profesor_id = req.query.id;
    try {
        const query_comments = {
            text: 'SELECT * FROM public."comments" WHERE profesor_id = $1',
            values: [profesor_id],
        }

        result = await client.query(query_comments);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "Error en el servidor"});
    } finally {
        client.release();
    }
}

const createComment = async(req, res) =>{
    res.status(200).json({msg: 'Has comentado'});
}

module.exports = {
    getComments,
    createComment,
}