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
### Verificación de usuario
Antes de la verficación, se necesita registrar un usuario con su propio correo institucional.

Una vez el correo es creado, nuestro servidor se encarga de mandar un correo con un token único para la verificación de este mismo

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

### Profesores
### Comentarios
