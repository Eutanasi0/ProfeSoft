const urlParams = new URLSearchParams(window.location.search);
const teacherId = urlParams.get('id');
const username = urlParams.get('user');
const commentId = teacherId;

const perfilContainer = document.getElementById('perfil');
const comentarios = document.getElementById('comentarios');
const comentarButton = document.getElementById('comentar');
const container = document.getElementById('container');

const inputComentario = document.getElementById('nuevoComentario');
const inputCalificacion = document.getElementById('calificacion');

const mainlink = document.getElementById('main');
const navigatelink = document.getElementById('navigate');
const loginlink = document.getElementById('login');
const navbar = document.getElementById('navbar');

if (username == "null" || username == null) {
    console.log('ah ?')
} else{
    loginlink.href = `../files/login.html?user=${username}`;
    mainlink.href = `../files/main.html?user=${username}`;
    navigatelink.href = `../files/navigate.html?user=${username}`;
}

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
    console.log(data.teachers['teacher']);
    const arrayBuffer = new Uint8Array(data.teachers['teacher']['img'].data).buffer;
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    const reader = new FileReader();

    reader.onloadend = function () {
        const imageData = reader.result;

        perfilContainer.innerHTML = `
            <div>
                <h2>${data.teachers['teacher']['name']}</h2>
                <p style="margin-top: 10px;">${data.teachers['course']['name']}</p>
                <p style="margin-top: 15px;">Calificación : ${data.teachers['teacher']['grade']}</p>
            </div>
            <img src="${imageData}" alt="Profile Image">
        `;
    };

    reader.readAsDataURL(blob);
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
    console.log(data.length);
    let commentsHTML = '<h2>Comentarios</h2>';
    for(let i = 0; i< data.length; i++){
        commentsHTML += `
            <div class="comentario" style="word-wrap: break-word;">
                <div style="display: flex; justify-content: space-between;">
                    <p style="font-weight: bold; padding: 10px;">${data[i].username}</p>
                    <p style="font-weight: bold; padding: 10px;">Calificación: ${data[i].grade}</p>
                </div>
                <div style="word-wrap: break-word; border: 1px solid gray; padding: 10px; margin-bottom: 10px; border-radius: 15px;">
                    <p>${data[i].text}</p>
                </div>
            </div>
        `;
    }
    comentarios.innerHTML = commentsHTML;
})

comentarButton.addEventListener('click', function(){
    if(!inputComentario.value || !inputCalificacion.value){
        window.confirm(`Comenta algo...`)
        return;
    }
    comentarios.innerHTML += `
        <div class="comentario" style="word-wrap: break-word;">
            <div style="display: flex; justify-content: space-between;">
                <p style="font-weight: bold; padding: 10px;">${username}</p>
                <p style="font-weight: bold; padding: 10px;">Calificación: ${inputCalificacion.value}</p>
            </div>
            <div style="word-wrap: break-word; border: 1px solid gray; padding: 10px; margin-bottom: 10px; border-radius: 15px;">
                <p>${inputComentario.value}</p>
            </div>
        </div>
    `;
    fetch(`/createComment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            teacher_id: teacherId,
            name: username,
            text: inputComentario.value,
            calificacion: inputCalificacion.value,
        })
    })
    .then(response =>{
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data =>{
        console.log(data);
        inputComentario.value = null;
        inputCalificacion.value = null;
    })
});
