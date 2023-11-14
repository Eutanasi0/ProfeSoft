
async function buscarProfe() {
    const input = document.getElementById('busqueda');
    const resultados = document.getElementById('resultados');
    const consulta = input.value.toLowerCase();
    resultados.innerHTML = '';

    const response = await fetch('dicTree.json');
    const datos = await response.json();

    // Buscar nombre en el diccionario
    for (let nombre in datos) {
      if (nombre.includes(consulta)) {
        const resultadoItem = document.createElement('li');
        resultadoItem.textContent = `${datos[nombre].nombre} - Curso: ${datos[nombre].curso}`;
        resultados.appendChild(resultadoItem);
      }
    }
}