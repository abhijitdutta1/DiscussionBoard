'use strict';

document.querySelector('body').onload = main;
let local_items = [];

function main () {
    getDiscussions();

    document.getElementById('logout').onclick = (event) => {
        logout();
    }
}

function getDiscussions () {
    // parse current url and get class id
    let classID = window.location.href.split('/')[4]
    fetch(`http://52.179.6.145/sDiscussion-list/${classID}`, {
        method: 'GET'
    }).then( res => {
        return res.json();
    }).then( data => {
        local_items = data.discussions;
        // display class name
        document.getElementById('welcome').textContent = `${data.course}`;
        render();
    }).catch( err => {
        console.log(err);
    });
}

function render() {
    let classID = window.location.href.split('/')[4]
    const template = document.getElementById('template');
    let list_elt = document.getElementById('discussion-list');
    list_elt.innerHTML = '';

    for (let i = 0; i < local_items.length; ++i) {
        let new_li = document.importNode(template.content, true);

        // get question and discussion ID
        new_li.querySelector('.list-group-item').textContent = local_items[i].question;
        new_li.querySelector('.list-group-item').setAttribute('href', `sCourse/${classID}/sDiscussion/${local_items[i].QID}`);
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