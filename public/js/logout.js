'use strict';

document.querySelector('body').onload = main;

function main () {
    document.getElementById('logout').onclick = (event) => {
        logout();
    }
}

async function logout () {
    const res = await fetch('http://40.84.158.14/logout', {
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