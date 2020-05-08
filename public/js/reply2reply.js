'use strict';

document.querySelector('body').onload = main;
let local_items = [];
let local_items2 = [];

function main () {
    getReplies();
    
    document.getElementById('post-R2R-form').onsubmit = (event) => {
        event.preventDefault();
        postReply();
        return false;
    }

    document.getElementById('logout').onclick = (event) => {
        logout();
    }
}

async function postReply() {
    const reply = document.getElementById('reply-post').value;
    let date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString().replace(/:\d{2}\s/,' ');

    const res = await fetch(window.location.href, {
        method: 'post',
        body: JSON.stringify({reply, date}),
        headers: {'Content-Type': 'application/json'}
    });

    if (res.status === 200) {
        console.log(res);
        getReplies();
        alert('Posted reply');
    } else {
        window.location = '/error';
    }
}

function getquestion() {
    let qid = window.location.href.split('/')[6]
    let ReplyID = window.location.href.split('/')[7]
    fetch(`http://40.84.158.14/discussion-list/${qid}/${ReplyID}/`, {
        method: 'GET'
    }).then( res => {
        return res.json();
    }).then( data => {
        local_items2 = data.replies;
        //  ********
        const template = document.getElementById('template');
        let list_elt = document.getElementById('replies-lst');
        list_elt.innerHTML = '';
            
        for (let i = 0; i < local_items2.length; ++i) {
            let new_li = document.importNode(template.content, true);

            // get replies
            new_li.querySelector('.name').textContent = local_items2[i].user;
            new_li.querySelector('.date').textContent = local_items2[i].date;
            new_li.querySelector('.contents').textContent = local_items2[i].Reply;
            list_elt.appendChild(new_li);
        }
        //  ********
    }).catch( err => {
        console.log(err);
    });
}

function getReplies() {
    let qid = window.location.href.split('/')[6]
    let ReplyID = window.location.href.split('/')[7]
    fetch(`http://40.84.158.14/discussion-list/${qid}/${ReplyID}/`, {
        method: 'GET'
    }).then( res => {
        return res.json();
    }).then( data => {
        local_items = data.reply2reply;
        document.getElementById('due').textContent = `Replying to: ${data.replies[0].user}`;
        document.getElementById('discussion').textContent = `Reply was: -- '${data.replies[0].Reply}' -- at: -- ${data.replies[0].date}`;
        render();
    }).catch( err => {
        console.log(err);
    });
}

function render() {
    // console.log(local_items);
    const template = document.getElementById('template');
    let list_elt = document.getElementById('replies-lst');
    list_elt.innerHTML = '';
        
    for (let i = 0; i < local_items.length; ++i) {
        let new_li = document.importNode(template.content, true);

        // get replies
        new_li.querySelector('.name').textContent = local_items[i].user;
        new_li.querySelector('.date').textContent = local_items[i].date;
        new_li.querySelector('.contents').textContent = local_items[i].reply;
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