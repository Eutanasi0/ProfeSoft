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
                const resultadoItem = document.createElement('li');
                resultadoItem.textContent = `${profesor.teacher_name} - Curso: ${profesor.course_name}`;
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