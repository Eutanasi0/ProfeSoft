let button = document.getElementById('registerbutton');
let user = document.getElementById('user');
let email = document.getElementById('email');
let password = document.getElementById('password');

button.addEventListener('click', function(){
    fetch("/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            usuario: user.value,
            email: email.value,
            password: password.value,
        })
    })
    .then(response => {
        if(!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data =>console.log(data))
    .catch(error => console.error(error));
})