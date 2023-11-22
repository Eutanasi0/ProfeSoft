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
### Verificación de usuario
### Login
### Profesores
### Comentarios
