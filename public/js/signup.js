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
    const isInstructor = document.getElementById("title").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Passwords aren't the same.");
        return;
    }
    
    const data = {email, fullName, isInstructor, password};
    fetch("http://40.84.158.14/signup", {
        method: "post",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    }).then( async res => {
        if (res.status === 200) {
            alert('Account Created');
        } else if (res.status === 409) {
            alert('Email exists');
        } else {
            window.location = '/error';
        }
    }).catch( err => {
        console.log(err);
    });
}