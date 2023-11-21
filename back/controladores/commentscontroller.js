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
            text: `
            SELECT
                comments.id AS comment_id,
                comments.text,
                comments.grade,
                users.id AS user_id,
                users.name AS username
            FROM
                public."comments"
            JOIN
                public."users" ON users.id = comments.user_id
            WHERE
                comments.profesor_id = $1;
            `,
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
    const{teacher_id, name, text, calificacion} = req.body;
    const client = await pool.connect();
    try {
        const find_id_user = {
            text: `SELECT id FROM public."users" WHERE name = $1`,
            values: [name],
        }

        const user_id = await client.query(find_id_user);
        // console.log(user_id.rows[0].id);
        const query_create_comment = {
            text: `INSERT INTO public."comments" (text, grade, user_id, profesor_id) VALUES ($1, $2, $3, $4)`,
            values: [text, calificacion, user_id.rows[0].id, teacher_id],
        }
        const result = await client.query(query_create_comment);
        console.log(result);
        res.status(200).json({msg: 'Has comentado'});
    } catch (error) {
        console.log(error);
        res.status(400).json({msg: "Un error ha ocurrido"});
    } finally {
        client.release();
        calculateCalification(teacher_id);
    }
}

async function calculateCalification(teacher_id){
    const client = await pool.connect();
    try {
        const query_comments_by_teacher_id = {
            text: `SELECT grade FROM public."comments" WHERE profesor_id = $1`,
            values: [teacher_id],
        }
        const result_grades = await client.query(query_comments_by_teacher_id);
        let suma = 0;
        for(let i = 0; i<result_grades.rowCount; i++){
            suma += result_grades.rows[i].grade;
            console.log(result_grades.rows[i].grade, suma)
        }
        let promedio = suma/result_grades.rowCount;
        promedio = promedio.toFixed(1);
        const query_insert_calification = {
            text: `UPDATE public."teachers" SET grade = $1 WHERE id = $2`,
            values: [promedio, teacher_id]
        }
        await client.query(query_insert_calification);
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
    }
}

module.exports = {
    getComments,
    createComment,
}