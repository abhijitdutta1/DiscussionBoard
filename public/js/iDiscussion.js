'use strict';

const id = _id => document.getElementById(_id);
let default_items = '';
let local_items = [];

document.querySelector('body').onload = main;

function main () {
    default_items = id('d-list').innerHTML;

    getDissList();

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
    const datetimepicker1 = document.getElementById('datetime').value;
    const description = document.getElementById('description').value; 

    const data = {question, datetimepicker1, description};
   
    const res = await fetch(window.location.href, {
        method: 'post',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    });

    if (res.status === 200) {
        alert('Discussion Created');
        getDissList();
    } else if (res.status === 409) {
        alert('Discussion exists');
    } else {
        window.location = '/error';
    } 
}

function getDissList () {
    let classID = window.location.href.split('/')[4]
    fetch(`http://40.84.158.14/iDiscussion-list/${classID}`, {
        method: 'GET'
    }).then( res => {
        return res.json();
    }).then( data => {
        local_items = data.discussions;
        // display class name
        document.getElementById('welcome').textContent = `${data.course} - ` + `${data.username}`;
        render();
    }).catch( err => {
        console.log(err);
    });
}

function render() {
    let classID = window.location.href.split('/')[4]
    const template = document.getElementById('template');
    let list_elt = document.getElementById('d-list');
    list_elt.innerHTML = '';

    for (let i = 0; i < local_items.length; ++i) {
        let new_li = document.importNode(template.content, true);

        // get question and discussion ID
        new_li.querySelector('.list-group-item').textContent = local_items[i].question;
        new_li.querySelector('.list-group-item').setAttribute('href', `iDiscussion/${local_items[i].QID}`);
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