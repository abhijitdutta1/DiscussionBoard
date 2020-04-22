'use strict';

document.querySelector('body').onload = main;

function main () {
    document.getElementById('course-register-form').onsubmit = (event) => {
        event.preventDefault();
        registerCourse();
        return false;
    }

    document.getElementById('logout').onclick = (event) => {
        logout();
    }
}

async function registerCourse() {
    const code = document.getElementById('code').value;
    console.log(`code`);

    const res = await fetch('http://52.179.6.145/sCourse', {
        method: 'post',
        body: JSON.stringify({code}),
        headers: {'Content-Type': 'application/json'}
    });
    if (res.status === 200) {
        console.log(res);
        alert('Register class successful');
    } else if (res.status === 401) {
        alert('Class was not found with the code');
    } else {
        window.location = '/error';
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