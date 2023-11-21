const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('user');

const mainlink = document.getElementById('main');
const navigatelink = document.getElementById('navigate');
const loginlink = document.getElementById('login');
const navbar = document.getElementById('navbar');
let logout;

if (username == "null" || username == null) {
    console.log('ah ?')
} else{
    loginlink.href = `../files/login.html?user=${username}`;
    mainlink.href = `../files/main.html?user=${username}`;
    navigatelink.href = `../files/navigate.html?user=${username}`;
}


function TrieNode(key) {

    this.key = key;

    this.parent = null;

    this.children = {};

    this.end = false;
  }

  TrieNode.prototype.getWord = function() {
    var output = [];
    var node = this;
    
    while (node !== null) {
      output.unshift(node.key);
      node = node.parent;
    }
    
    return output.join('');
  };
  
  function Trie() {
    this.root = new TrieNode(null);
  }

  Trie.prototype.insert = function(word) {
    var node = this.root;

    for(var i = 0; i < word.length; i++) {

      if (!node.children[word[i]]) {

        node.children[word[i]] = new TrieNode(word[i]);

        node.children[word[i]].parent = node;
      }

      node = node.children[word[i]];
      
      if (i == word.length-1) {

        node.end = true;
      }
    }
  };
  

  Trie.prototype.contains = function(word) {
    var node = this.root;

    for(var i = 0; i < word.length; i++) {

      if (node.children[word[i]]) {

        node = node.children[word[i]];
      } else {

        return false;
      }
    }

    return node.end;
  };
  
  Trie.prototype.find = function(prefix) {
    var node = this.root;
    var output = [];

    for(var i = 0; i < prefix.length; i++) {

      if (node.children[prefix[i]]) {
        node = node.children[prefix[i]];
      } else {

        return output;
      }
    }

    findAllWords(node, output);
    
    return output;
  };
  
  function findAllWords(node, arr) {

    if (node.end) {
      arr.unshift(node.getWord());
    }

    for (var child in node.children) {
      findAllWords(node.children[child], arr);
    }
  }
  

  var trie = new Trie();

  trie.insert("hello");
  trie.insert("helium");

  console.log(trie.contains("helium"));
  console.log(trie.contains("kickass"));
  
  console.log(trie.find("hel"));  
  console.log(trie.find("hell")); 

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