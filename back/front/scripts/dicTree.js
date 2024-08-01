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

function getUsernameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('user');
}

async function buscarProfe() {
    const input = document.getElementById('busqueda');
    const resultados = document.getElementById('resultados');
    const consulta = input.value.toLowerCase();
    resultados.innerHTML = '';

    const username = getUsernameFromURL();

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
