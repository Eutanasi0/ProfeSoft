const profesores = {
  "ciro rodriguez rodriguez":{ "nombre":"Ciro Rodríguez Rodríguez", "curso": "Matemática Discreta" },
  "daniel quinto pacze":{ "nombre": "Daniel Quinto Pacze", "curso": "Matemática Discreta" },
  "santiago domingo moquillaza henrriquez": { "nombre": "Santiago Domingo Moquillaza Henrriquez", "curso": "Matemática Discreta" },
  "nelly demetria pillhuaman caña": { "nombre": "Nelly Demetria Pillhuaman Caña", "curso": "Probabilidades" },
  "mary iris miranda robles":{ "nombre": "Mary Iris Miranda Robles", "curso": "Probabilidades" },
  "rosario del pilar depaz apestegui": {"nombre": "Rosario del Pilar Depaz Apestegui", "curso": "Probabilidades"},
  "jorge luis chávez soto": {"nombre": "Jorge Luis Chávez Soto", "curso": "Algorítmica II"},
  "juan ricardo tapia carbajal": {"nombre": "Juan Ricardo Tapia Carbajal", "curso": "Algorítmica II"},
  "augusto parcemon corte vásquez": {"nombre": "Augusto Parcemon Corte Vásquez", "curso": "Algorítmica II"},
  "fausto franklin mercado philco": {"nombre": "Fausto Franklin Mercado Philco", "curso": "Contabilidad para la Gestión"},
  "frank edmundo escobedo bailón": {"nombre": "Frank Edmundo Escobedo Bailón", "curso": "Innovación, Tecnología y Emprendimiento"},
  "luz sussy bayona oré": {"nombre": "Luz Sussy Bayona Oré", "curso": "Innovación, Tecnología y Emprendimiento"},
  "igor jovino aguilar alonso": {"nombre": "Igor Jovino Aguilar Alonso", "curso": "Innovación, Tecnología y Emprendimiento"},
  "gustavo arredondo castillo": {"nombre": "Gustavo Arredondo Castillo", "curso": "Procesos de Software"},
  "yudi lucero guzmán monteza": {"nombre": "Yudi Lucero Guzmán Monteza", "curso": "Procesos de Software"},
  "felix armando fermin perez": {"nombre": "Felix Armando Fermin Perez", "curso": "Sistemas Digitales"},
  "walter pedro contreras flores": {"nombre": "Walter Pedro Contreras Flores", "curso": "Sistemas Digitales"}       
};

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