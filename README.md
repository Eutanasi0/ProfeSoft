# ProfeSoft
Página web para calificar a los profesores de la escuela profesional software.

## Set up
- Clonas el repositorio
- Entras a la carpeta /back con el comando
  `cd back`
- Escribes los siguientes comandos
  `npm init`
  `npm install`
- Define tus variables de entorno en un archivo `.env`
 
  ```
  HOST=
  PASSWORD=
  EMAIL=
  PASS=
  jwt_secret_mail=
  baseUrl=
  baseUrlHost=
  ```
  
- Ahora puedes iniciar el servidor con el comando
  `npm run dev`

## Partes importantes del código
### Navigate
La lógica de nuestro buscador se encuentra en /front/scripts/dicTree.js

Primero se realiza una petición al servidor para obtener los datos, de todos los profesores con sus respectivos cursos.
```
let profesoresDB;
async function fetchData() {
    try {
        const response = await fetch("/everything", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        profesoresDB = data;
    } catch (error) {
        console.error(error);
    }
}
```

Cada vez que el usuario escriba en nuestro buscador, se ejecutará la siguiente función que intenta simular la búsqueda de un trie.

La función `buscarProfe()` recorre toda la data de profesores que está guardada en `profesoresDB` y en cada dato verifica si el input del usuario está dentro, por ejemplo, si tenemos como curso ´Matemática´ y el input es tica, la función va a devolver Matemática, pues 'tica' se encuentra dentro de la palabra.
```
async function buscarProfe() {
    const input = document.getElementById('busqueda');
    const resultados = document.getElementById('resultados');
    const consulta = input.value.toLowerCase();
    resultados.innerHTML = '';

    try {
        if (!profesoresDB) {
            await fetchData();
        }
        for (let profesor of profesoresDB.dataSend) {
            let tempo_name = profesor.teacher_name.toLowerCase();
            let tempo_course = profesor.course_name.toLowerCase();
            if (tempo_name.includes(consulta) || tempo_course.includes(consulta)) {
                // Crear un enlace y agregarlo al resultadoItem
                const enlace = document.createElement('a');
                enlace.href = `profes.html?user=${username}&id=${profesor.teacher_id}`;
                enlace.textContent = `${profesor.teacher_name} - Curso: ${profesor.course_name}`;

                // Crear un elemento de lista y agregar el enlace a él
                const resultadoItem = document.createElement('li');
                resultadoItem.appendChild(enlace);

                // Agregar el elemento de lista a la lista de resultados
                resultados.appendChild(resultadoItem);
            }
        }
    } catch (error) {
        console.error("Error during search:", error);
    }
}
```
### Registro de usuario
Para crear un usuario, obligamos el uso de correo institucional con una simple función.

```
function confirmDomain(email){
    const myDomain = "@unmsm.edu.pe";
    return email.endsWith(myDomain);
}
```

Luego, se verifica si el nombre o email existe dentro de nuestra base de datos. Si se repite alguno de los dos, se devuelve nulo, si no se repite, se crea un usuario en la base de datos y se pasa a la verificación del correo.

```
async function usingTheDB(pass, hashed_pass, salt, usuario, email){
    const client = await pool.connect();
    try {
        salt = await bcrypt.genSalt(10);
        hashed_pass = await bcrypt.hash(pass, salt);
        const query_find_users_by_name = {
            text: 'SELECT * FROM public."users" WHERE email = $1 OR name = $2',
            values: [email, usuario],
        };
        const flag = await client.query(query_find_users_by_name);
        console.log(flag.rowCount);
        if(flag.rowCount > 0){
            console.log("El nombre de usuario o el correo ya está registrado");
            return null;
        } else{
            const query_user = {
                text: 'INSERT INTO public."users"(name, email, hashed_pass, salt) VALUES($1, $2, $3, $4)',
                values: [usuario, email, hashed_pass, salt],
            }
            await client.query(query_user);
            return 1;
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        client.release();
    }
};
```
```
const createAccount = async(req, res, next) =>{
    const {usuario, email, password} = req.body;
    let pass = password;
    let hashed_pass = '';
    let salt = '';

    if(confirmDomain(email)){
        if(await usingTheDB(pass, hashed_pass, salt, usuario, email, password)){
            res.status(200).json({message: "Se ha mandado el correo"});
            next();
        } else{
            res.status(200).json({message: "Ese correo o nombre ya existe"});
        }
    } else {
        res.status(200).json({message: "Ese no es un correo institucional..."})
    }
}
```

### Verificación de correo
Una vez el usuario es creado, nuestro servidor se encarga de mandar un correo con un token único para la verificación del correo registrado.

![image](https://github.com/Eutanasi0/ProfeSoft/assets/123672027/f2f357a6-3ccc-49de-8097-c3ffa4d03679)

Al hacer click en el link, este manda una petición al servidor, que comprobará si el token y el usuario son los mismos, una vez verificados, elimina el token y activa al usuario.

```
const verifyEmail = async(req, res)=>{
    token = req.query.id;
    user = req.query.username;
    const client = await pool.connect();
    try {
        const query_find_token_by_name ={
            text: 'SELECT token_auth FROM public."users" WHERE name = $1',
            values: [user],
        }
        const token_db = await client.query(query_find_token_by_name);
        jwt.verify(token, process.env.jwt_secret_mail, async(e, decoded) => {
            if (e) {
                console.log(e)
                return res.sendStatus(403)
            } else {
                if(token_db.rows[0].token_auth === token){
                    try{
                        let activate = true;
                        let auth = null;
                        const query_update_state = {
                            text: 'UPDATE public."users" SET token_auth = $1, activate = $2 WHERE name = $3',
                            values: [auth, activate, user],
                        };
                        try {
                            let prueba = await client.query(query_update_state);
                            console.log(prueba);
                        } catch (error) {
                            console.log(error);
                        }
                    } catch(error){
                        console.log(error);
                    }
                    return res.redirect('https://profesoft.onrender.com/files/login.html?msg=Correoconfirmado');
                } else {
                    return res.status(403).json({message: "Los tokens no coinciden"})
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(403).json({message: "That token doesn't exist"})
    } finally {
        client.release();
    }
}
```
Esto actualiza la tabla de users en nuestra base de datos, pasando de estado inactivo a activo.

![image](https://github.com/Eutanasi0/ProfeSoft/assets/123672027/fee2d645-7f07-4db1-9dd8-a51e8ab8c339)

### Login
Nuesto login se compone de una petición con dos funciones.
```
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
```
Antes de verificar los datos del usuario, verificamos si el usuario siquiera está activado.
```
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
```

Si el usuario está activo, verificamos los datos, pasamos por un algoritmo hash la contraseña y la sal del usuario para compararlo con la contraseña hasheada dentro de la base de datos.
```
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
```
Si se confirman los datos, el usuario es redireccionado a la página principal, sino, se le manda un mensaje de error.

### Profesores
Tenemos dos tipos de peticiones para la información de los profesores.
Una, donde mandamos todos los nombres con sus respectivos cursos.
```
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
```
Otro, donde solo mostramos los datos de un profesor según el id mandado.
```
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
```

### Comentarios
Para los comentarios, tenemos de igual forma dos tipos de peticiones. 

Primero, para mostrar todos los comentarios que están ligados a un profesor por su id.

```
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
```
Segundo, tenemos una peticion post, que permite la creación de comentarios referentes a un profesor.

```
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
```

Cabe destacar, que tenemos una función para calificar al profesor recién calificado, y mantener actualizada nuestra base de datos de esta manera.

```
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
```
