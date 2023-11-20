<<<<<<< HEAD
class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.profesorData = null;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word, data) {
        let node = this.root;
        for (let char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
        node.profesorData = data;
    }

    search(query) {
        let node = this.root;
        for (let char of query) {
            if (node.children[char]) {
                node = node.children[char];
            } else {
                return null; // No match found
            }
        }
        return node.isEndOfWord ? node.profesorData : null;
    }
}
=======
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('user');
>>>>>>> 3f234888ea96d8134f6e350d9107ea3327730f1a

let profesoresDB;
let trie;

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

        // Build trie from profesoresDB
        trie = new Trie();
        for (let profesor of profesoresDB.dataSend) {
            let tempo_name = profesor.teacher_name.toLowerCase();
            let tempo_course = profesor.course_name.toLowerCase();
            trie.insert(tempo_name, profesor);
            trie.insert(tempo_course, profesor);
        }
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
<<<<<<< HEAD
=======
        for (let profesor of profesoresDB.dataSend) {
            let tempo_name = profesor.teacher_name.toLowerCase();
            let tempo_course = profesor.course_name.toLowerCase();
            if (tempo_name.includes(consulta) || tempo_course.includes(consulta)) {
                // Crear un enlace y agregarlo al resultadoItem
                const enlace = document.createElement('a');
                enlace.href = `profes.html?user=${username}&id=${profesor.teacher_id}`; // Coloca la URL a la que deseas que apunte el enlace
                enlace.textContent = `${profesor.teacher_name} - Curso: ${profesor.course_name}`;
>>>>>>> 3f234888ea96d8134f6e350d9107ea3327730f1a

        // Search using trie
        let result = trie.search(consulta);

        if (result) {
            // Crear un enlace y agregarlo al resultadoItem
            const enlace = document.createElement('a');
            enlace.href = 'profes.html'; // Coloca la URL a la que deseas que apunte el enlace
            enlace.textContent = `${result.teacher_name} - Curso: ${result.course_name}`;

            // Crear un elemento de lista y agregar el enlace a él
            const resultadoItem = document.createElement('li');
            resultadoItem.appendChild(enlace);

            // Agregar el elemento de lista a la lista de resultados
            resultados.appendChild(resultadoItem);
        }
    } catch (error) {
        console.error("Error during search:", error);
    }
}

// Aquí hace la petición cuando presiona buscar

const button = document.getElementById('buscar');

button.addEventListener('click', function(){

});