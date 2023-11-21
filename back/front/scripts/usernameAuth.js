const urlParams = new URLSearchParams(window.location.search);
const teacherId = urlParams.get('id');
const username = urlParams.get('user');

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