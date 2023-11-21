const urlParams = new URLSearchParams(window.location.search);
const teacherId = urlParams.get('id');
const username = urlParams.get('user');
const commentId = teacherId;
const perfilContainer = document.getElementById('perfil');
const comentariosContainer = document.getElementById('comentariosContainer');
const comentarButton = document.getElementById('comentar');

const mainlink = document.getElementById('main');
const navigatelink = document.getElementById('navigate');
const loginlink = document.getElementById('login');

console.log(username);
if (username) {
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
