"use strict";
document.querySelector("body").onload = main;

function main () {
    document.getElementById("register-form").onsubmit = (event) => {
        event.preventDefault();
        processForm(event);
        return false;
    };
}

function processForm (event) {
    const fullName = document.getElementById("full-name").value;
    const email = document.getElementById("email").value;
    const title = document.getElementById("title").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-assword").value;

    if (password !== confirmPassword) {
        alert("Passwords aren't the same.");
        return;
    }
    
    const data = {fullName, email, title, password};
    fetch("http://52.179.6.145/signup", {
        method: "post",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    }).then( async res => {
        if (res.status === 200) {
            alert('Account Created');
        } else if (res.status === 409) {
            alert('Username exists');
        } else {
            window.location = '/error';
        }
    }).catch( err => {
        console.log(err);
    });
}