require('dotenv').config();
const { Client } = require("pg");

const getTeacher = async(req, res) =>{
    teacherId = req.query.id;
    const client = new Client({
        user: 'postgres',
        host: process.env.HOST,
        database: 'professoft',
        password: process.env.PASSWORD,
        port: 5432,
      });
    try {
        const teachers = await getTeachersFromDB(client, teacherId);
        console.log(teachers)
        return res.status(200).json({teachers});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Problemas en el paraíso"})
    }
}

async function getTeachersFromDB(client, teacherId){
    const id = teacherId;
    try {
        await client.connect();
        const query_find_teacher_by_name = {
            text: 'SELECT * FROM public."teachers" WHERE id = $1',
            values: [id],
        };
        const queryResult = await client.query(query_find_teacher_by_name);
        const result = queryResult.rows[0];
        console.log(result)
        return result;
    } catch (error) {
        console.log(error);
        return null;
    } finally {
        await client.end();
    }
}

module.exports = {
    getTeacher,
}