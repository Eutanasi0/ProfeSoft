const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('user');

const mainlink = document.getElementById('main');
const navigatelink = document.getElementById('navigate');
const loginlink = document.getElementById('login');

if (username) {
    loginlink.href = `../files/login.html?user=${username}`;
    mainlink.href = `../files/main.html?user=${username}`;
    navigatelink.href = `../files/navigate.html?user=${username}`;
}

let profesoresDB;

async function fetchData() {
    try {
        const response = await fetch("/everything", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
                // You may need to include additional headers (e.g., authentication token)
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

async function buscarProfe() {
    const input = document.getElementById('busqueda');
    const resultados = document.getElementById('resultados');
    const consulta = input.value.toLowerCase();
    resultados.innerHTML = '';

    try {
        if (!profesoresDB) {
            await fetchData(); // Fetch data if not already fetched
        }
        for (let profesor of profesoresDB.dataSend) {
            let tempo_name = profesor.teacher_name.toLowerCase();
            let tempo_course = profesor.course_name.toLowerCase();
            if (tempo_name.includes(consulta) || tempo_course.includes(consulta)) {
                // Crear un enlace y agregarlo al resultadoItem
                const enlace = document.createElement('a');
                enlace.href = `profes.html?user=${username}&id=${profesor.teacher_id}`; // Coloca la URL a la que deseas que apunte el enlace
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

// Aquí hace la petición cuando presiona buscar

const button = document.getElementById('buscar');

button.addEventListener('click', function(){

});