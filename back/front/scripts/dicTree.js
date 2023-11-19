const profesores = {
    "ciro rodriguez rodriguez":{ "id":"11", "nombre":"Ciro Rodríguez Rodríguez", "curso": "Matemática Discreta" },
    "daniel quinto pacze":{ "id":"1", "nombre": "Daniel Quinto Pacze", "curso": "Matemática Discreta" },
    "santiago domingo moquillaza henrriquez": { "id":"10", "nombre": "Santiago Domingo Moquillaza Henrriquez", "curso": "Matemática Discreta" },
    "nelly demetria pillhuaman caña": { "id":"12", "nombre": "Nelly Demetria Pillhuaman Caña", "curso": "Probabilidades" },
    "mary iris miranda robles":{ "id":"9", "nombre": "Mary Iris Miranda Robles", "curso": "Probabilidades" },
    "rosario del pilar depaz apestegui": { "id":"13","nombre": "Rosario del Pilar Depaz Apestegui", "curso": "Probabilidades"},
    "jorge luis chávez soto": {"id":"8", "nombre": "Jorge Luis Chávez Soto", "curso": "Algorítmica II"},
    "juan ricardo tapia carbajal": {"id":"7", "nombre": "Juan Ricardo Tapia Carbajal", "curso": "Algorítmica II"},
    "augusto parcemon corte vásquez": { "id":"6","nombre": "Augusto Parcemon Corte Vásquez", "curso": "Algorítmica II"},
    "fausto franklin mercado philco": {"id":"5", "nombre": "Fausto Franklin Mercado Philco", "curso": "Contabilidad para la Gestión"},
    "frank edmundo escobedo bailón": { "id":"4","nombre": "Frank Edmundo Escobedo Bailón", "curso": "Innovación, Tecnología y Emprendimiento"},
    "luz sussy bayona oré": {"id":"3", "nombre": "Luz Sussy Bayona Oré", "curso": "Innovación, Tecnología y Emprendimiento"},
    "igor jovino aguilar alonso": {"id":"2","nombre": "Igor Jovino Aguilar Alonso", "curso": "Innovación, Tecnología y Emprendimiento"},
    "gustavo arredondo castillo": {"id":"14","nombre": "Gustavo Arredondo Castillo", "curso": "Procesos de Software"},
    "yudi lucero guzmán monteza": {"id":"15","nombre": "Yudi Lucero Guzmán Monteza", "curso": "Procesos de Software"},
    "felix armando fermin perez": {"id":"16","nombre": "Felix Armando Fermin Perez", "curso": "Sistemas Digitales"},
    "walter pedro contreras flores": {"id":"17","nombre": "Walter Pedro Contreras Flores", "curso": "Sistemas Digitales"}
};

let profesoresDB;

fetch("/everything", {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    },
})
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    console.log(data);
    profesoresDB = data;
})
.catch(error => {
    console.error(error);
})

async function buscarProfe() {
    const input = document.getElementById('busqueda');
    const resultados = document.getElementById('resultados');
    const consulta = input.value.toLowerCase();
    resultados.innerHTML = '';

    for (let nombre in profesores) {
        if (nombre.includes(consulta)) {
            const resultadoItem = document.createElement('li');
            resultadoItem.textContent = `${profesores[nombre].nombre} - Curso: ${profesores[nombre].curso}`;
            resultados.appendChild(resultadoItem);
        }
    }
}

