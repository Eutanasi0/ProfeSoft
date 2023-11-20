const urlParams = new URLSearchParams(window.location.search);
const teacherId = urlParams.get('id');
const commentId = teacherId;
const perfilContainer = document.getElementById('perfil');
const comentariosContainer = document.getElementById('comentariosContainer');
const comentarButton = document.getElementById('comentar');

fetch(`/teacher?id=${teacherId}`, {
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
    console.log(data.teachers['course']['name']);
    perfilContainer.innerHTML = `
                <h2>${data.teachers['teacher']['name']}</h2>
                <p>${data.teachers['course']['name']}</p>
            `;
})
.catch(error =>{
    console.error(error);
});

fetch(`/getComments?id=${commentId}`, {
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

comentarButton.addEventListener('click', function(){
    fetch(`/createComment`, {
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
});
