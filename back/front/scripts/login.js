let usuario = document.getElementById('user');
let contra = document.getElementById('password');
let login_button = document.getElementById('loginbutton');

login_button.addEventListener('click', function(){
    event.preventDefault();
    console.log(usuario.value, contra.value);
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: usuario.value,
            password: contra.value,
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if(data.username === usuario.value){
            location.href =`/files/navigate.html?user=${data['response']['id'].name}`;
        }
    })
    .catch(error => console.error(error));
})