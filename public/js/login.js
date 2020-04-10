'use strict';

document.querySelector('body').onload = main;

function main () {
    document.getElementById('login-form').onsubmit = (event) => {
        event.preventDefault();
        sendPass();
        return false;
    }
}

async function sendPass () {
    const username = document.getElementById('email').value;
    const title = document.getElementById("title").value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://http://52.179.6.145//login', {
        method: 'post',
        body: JSON.stringify({username, title, password}),
        headers: {'Content-Type': 'application/json'}
    });
    if (res.status === 200) {
        alert('Login successful');
    } else if (res.status === 401) {
        alert('Incorrect username/password');
    } else {
        window.location = '/error';
    }
}