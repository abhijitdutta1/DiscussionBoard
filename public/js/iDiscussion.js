'use strict';

const id = _id => document.getElementById(_id);
let default_items = '';
let local_items = [];

document.querySelector('body').onload = main;

function main () {
    // default_items = id('class-list').innerHTML;

    // getClassList();

    document.getElementById('discussionCreationForm').onsubmit = (event) => {
        event.preventDefault();
        subjectForm();
        return false;
    }

    document.getElementById('logout').onclick = (event) => {
        logout();
    }
}

async function subjectForm () { 
    const question = document.getElementById('question').value;
    const datetimepicker1 = document.getElementById('datetimepicker1').value;
    const description = document.getElementById('description').value; 
    console.log(question, datetimepicker1, description);

    const data = {question, datetimepicker1, description};
    console.log(`client: ${data}`);
    const res = await fetch('http://52.179.6.145/iCourse/iDiscussion', {
        method: 'post',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });

    if (res.status === 200) {
        alert('Discussion Created');
        getClassList();
    } else if (res.status === 409) {
        alert('Discussion exists');
    } else {
        window.location = '/error';
    } 
}


function getClassList () {
    fetch('http://52.179.6.145/iDiscussion-list', {
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