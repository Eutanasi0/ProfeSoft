const id = document.getElementById('busqueda');

fetch(`/teacher?id=${id.value}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})
.then(response =>{
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data =>{
    console.log(data);
})
.catch(error =>{
    console.error(error);
})