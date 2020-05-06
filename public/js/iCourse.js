'use strict';

const id = _id => document.getElementById(_id);
let default_items = '';
let local_items = [];

document.querySelector('body').onload = main;

function main () {
    default_items = id('class-list').innerHTML;

    getClassList();

    document.getElementById('courseCreationForm').onsubmit = (event) => {
        console.log(classID, name, description);
        event.preventDefault();
        instructorForm();
        return false;
    }

    document.getElementById('logout').onclick = (event) => {
        logout();
    }
}

async function instructorForm () { 
    const classID = document.getElementById('classID').value;
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value; 
    

    const data = {classID, name, description};
    console.log(`client: ${data}`);
    const res = await fetch('http://40.84.158.14/iCourse', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });

    if (res.status === 200) {
        alert('Class Created');
        getClassList();
    } else if (res.status === 409) {
        alert('Class Already exists');
    } else {
        window.location = '/error';
    } 
}


function getClassList () {
    fetch('http://40.84.158.14/iCourse-list', {
        method: 'GET'
    }).then( res => {
        return res.json();
    }).then( data => {
        local_items = data.classes;
        document.getElementById('welcome').textContent = `Welcome ${data.username}`;
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

        // get course and course ID
        new_li.querySelector('.list-group-item').textContent = local_items[i].name;
        new_li.querySelector('.list-group-item').setAttribute('href', `iCourse/${local_items[i].classID}/iDiscussion`);
        list_elt.appendChild(new_li);
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