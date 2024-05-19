require('dotenv').config();
const { Pool } = require("pg");
const { calculateCalification } = require('./commentscontroller');

const pool = new Pool({
    user: 'professoft',
    host: process.env.HOST,
    database: 'professoft',
    password: process.env.PASSWORD,
    port: 5432,
})

const getTeacher = async(req, res) =>{
    teacherId = req.query.id;
    try {
        const teachers = await getTeachersFromDB(teacherId);
        return res.status(200).json({teachers});
    } catch (error) {
        console.log(error);
        return res.status(400).json({message: "Problemas en el paraíso"})
    }
}

async function getTeachersFromDB(teacherId){
    const client = await pool.connect();
    try {
        const [teacherQuery, courseIdQuery] = await Promise.all([
            client.query('SELECT * FROM public."teachers" WHERE id = $1', [teacherId]),
            client.query('SELECT cursos_id FROM public."teachers_courses" WHERE profesor_id = $1', [teacherId]),
        ]);

        const teacher = teacherQuery.rows[0];
        const courseId = courseIdQuery.rows[0]["cursos_id"];

        const query_find_course_by_id = {
            text: 'SELECT * FROM public."courses" WHERE id = $1',
            values: [courseId],
        };
        const courseQuery = await client.query(query_find_course_by_id);
        const course = courseQuery.rows[0];

        return {
            teacher,
            course,
        }
    } catch (error) {
        console.log(error);
        return "hola tqm";
    } finally {
        client.release();
        calculateCalification(teacherId);
    }
}

const getAllTeachers = async(req, res) => {
    const client = await pool.connect();
    try{
        const query_all_teachers = {
            text: `
                SELECT
                    teachers.id AS teacher_id,
                    teachers.name AS teacher_name,
                    courses.id AS course_id,
                    courses.name AS course_name
                FROM
                    public."teachers"
                JOIN
                    public."teachers_courses" ON teachers.id = teachers_courses.profesor_id
                JOIN
                    public."courses" ON teachers_courses.cursos_id = courses.id
            `,
        };
        const result = await client.query(query_all_teachers);
        const dataSend = result.rows;
        res.status(200).json({dataSend});
    } catch (error){
        console.error(error);
        res.status(500).json({message: "Problemas con la db"})
    } finally {
        client.release();
    }
}

module.exports = {
    getTeacher,
    getAllTeachers,
}
