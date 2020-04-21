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
    const email = document.getElementById('email').value;
    const isInstructor = document.getElementById("title").value;
    const password = document.getElementById('password').value;

    const res = await fetch('http://52.179.6.145/login', {
        method: 'post',
        body: JSON.stringify({email, password, isInstructor}),
        headers: {'Content-Type': 'application/json'}
    });
    if (res.status === 303) {
        console.log(res);
        alert('Login successful');
    } else if (res.status === 401) {
        alert('Incorrect username/password/title');
    } else {
        window.location = '/error';
    }
}