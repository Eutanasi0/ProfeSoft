require('dotenv').config();
const { Pool } = require("pg");

const pool = new Pool({
    user: 'postgres',
    host: process.env.HOST,
    database: 'professoft',
    password: process.env.PASSWORD,
    port: 5432,
})

const getTeacher = async(req, res) =>{
    teacherId = req.query.id;
    try {
        const teachers = await getTeachersFromDB(teacherId);
        console.log(teachers)
        return res.status(200).json({teachers});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Problemas en el paraíso"})
    }
}

async function getTeachersFromDB(teacherId){
    const client = await pool.connect();
    try {
        const [teacherQuery, courseIdQuery, commentsQuery] = await Promise.all([
            client.query('SELECT * FROM public."teachers" WHERE id = $1', [teacherId]),
            client.query('SELECT cursos_id FROM public."teachers_courses" WHERE profesor_id = $1', [teacherId]),
            client.query('SELECT * FROM public."comments" WHERE profesor_id = $1', [teacherId]),
        ]);

        const teacher = teacherQuery.rows[0];
        const courseId = courseIdQuery.rows[0]["cursos_id"];
        const comments = commentsQuery.rows[0];
        console.log(teacher, courseId, comments)

        const query_find_course_by_id = {
            text: 'SELECT * FROM public."courses" WHERE id = $1',
            values: [courseId],
        };
        const courseQuery = await client.query(query_find_course_by_id);
        const course = courseQuery.rows[0];

        return {
            teacher,
            course,
            comments,
        }
    } catch (error) {
        console.log(error);
        return null;
    } finally {
        client.release();
    }
}

module.exports = {
    getTeacher,
}