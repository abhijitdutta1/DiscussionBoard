'use strict';

document.querySelector('body').onload = main;
let local_items = [];

function main () {
    getRegisteredClasses();
    
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
        alert('Registered class successfully');
    } else if (res.status === 404) {
        alert('Class was not found with the code');
    } else if (res.status === 409) {
        alert('Student is already registered for this course');
    } 
    else {
        window.location = '/error';
    }
}

function getRegisteredClasses () {
    fetch('http://52.179.6.145/registeredCourses', {
        method: 'GET'
    }).then( res => {
        return res.json();
    }).then( data => {
        local_items = data.classes;
        render();
    }).catch( err => {
        console.log(err);
    });
}

function render() {
    const template = document.getElementById('template');
    let list_elt = document.getElementById('class-list');
    list_elt.innerHTML = '';
    for (let i = 0; i < local_items.length; ++i) {
        let new_li = document.importNode(template.content, true);
        new_li.querySelector('.list-group-item').textContent = local_items[i].name;
        list_elt.appendChild(new_li);
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