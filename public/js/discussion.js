'use strict';

document.querySelector('body').onload = main;
let local_items = [];

function main () {
    getDiscussions();
    
    document.getElementById('post-d-form').onsubmit = (event) => {
        event.preventDefault();
        postDiscussion();
        return false;
    }

    document.getElementById('logout').onclick = (event) => {
        logout();
    }
}

async function postDiscussion() {
    const reply = document.getElementById('discussion').value;
    let date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().replace(/:\d{2}\s/,' ');

    const res = await fetch(window.location.href, {
        method: 'post',
        body: JSON.stringify({reply, date}),
        headers: {'Content-Type': 'application/json'}
    });

    if (res.status === 200) {
        console.log(res);
        getDiscussions();
        alert('Posted discussion');
    } else {
        window.location = '/error';
    }
}

function getDiscussions() {
    let qid = window.location.href.split('/')[6]
    fetch(`http://52.179.6.145/discussion-list/${qid}`, {
        method: 'GET'
    }).then( res => {
        return res.json();
    }).then( data => {
        local_items = data.replies;
        document.getElementById('due').textContent = `Due: ${data.discussion.due}`;
        document.getElementById('discussion').textContent = `${data.discussion.question}`;
        render();
    }).catch( err => {
        console.log(err);
    });
}

function render() {
    const template = document.getElementById('template');
    let list_elt = document.getElementById('replies-lst');
    list_elt.innerHTML = '';
    for (let i = 0; i < local_items.length; ++i) {
        let new_li = document.importNode(template.content, true);

        // get replies
        new_li.querySelector('.name').textContent = local_items[i].user;
        new_li.querySelector('.date').textContent = local_items[i].date;
        new_li.querySelector('.contents').textContent = local_items[i].Reply;
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