'use strict';

document.querySelector('body').onload = main;

function main () {
    document.getElementById('logout').onclick = (event) => {
        event.preventDefault();
        logout();
        return false;
    }
}

async function logout () {
    const res = await fetch('http://52.179.6.145/logout', {
        method: 'post',
    });
    if (res.status === 200) {
        console.log(res);
        alert('Logout successful');
        window.location = '/';
    } else {
        window.location = '/error';
    }
}