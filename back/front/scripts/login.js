let usuario = document.getElementById('user');
let contra = document.getElementById('password');
let login_button = document.getElementById('loginbutton')

login_button.addEventListener('click', function(){
    console.log(usuario.value, contra.value);
    fetch('http://localhost:3000/front/files/login.html/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: usuario.value,
            password: password.value,
        })
    })
    .then(respone => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
})