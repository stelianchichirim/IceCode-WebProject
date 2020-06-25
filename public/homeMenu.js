function changeMenuStyle(str) {
    let v = document.getElementsByClassName("menu-item-active");
    for (let x of v) {
        x.classList.remove("menu-item-active");
    }
    if (str == "profile") return;
    let curr = document.getElementById(str);
    curr.classList.add("menu-item-active");
}

/// Home Menu

homeHtmlCode =
`<div id ="homeContainer" class = "homeContainer">WELCOME TO MY WEBSITE !</div>
<div id = "loginMessage" class = "homeActions" style = "font-size: 22px;"> This is the first time you logged in !</div>`

homeAdminHtmlCode =
`<div id ="homeContainer" class = "homeContainer">WELCOME TO MY WEBSITE !</div>
<div id = "loginMessage" class = "homeActions" style = "font-size: 22px;"> This is the first time you logged in !</div>
<div id = "homeActions" class = "homeActions">
<label for = "userName">FIND USER: </label>
<input type = "text" id = "userName" placeholder = "Username" class = "categoryName-input">
<button id = "findUser" class = "button-findUser" onclick = "findUser()"><i class = "fa fa-search"></i></button>
</div>
<div id = "homeLoggButton" class = "homeLoggButton">
<a class = "loggButton" onclick = "expandLogger()">LOGGER</a>
</div>
`

homeHtmlCodeGuest =
`<div class = "homeLogin">
    <h2 style="text-align:center">Login or Sign Up</h2>
    <p style = "font-size: 20px"> Username and password must have only english letters or digits </p>
    <div class = "loginButtons">
        <input type="text" name="username" placeholder="Username" id = "username" class = "loginInput">
        <input type="password" name="password" placeholder="Password" id = "password" class = "loginInput">
        <button id = "login" class = "loginButton" onclick = "login()"><i class = "fa fa-sign-in"></i> Login</button>
        <button id = "login" class = "loginButton" onclick = "signUp()"><i class = "fa fa-sign-in"></i> Sign Up</button>
    </div>
</div>`

function expandHome() {
    getUser(function(user) {
        if (user == "") expandHomeGuest()  /// verificam daca e logat
        else {
            changeMenuStyle("home");
            document.getElementsByTagName("html")[0].style["overflow-y"] = "visible";
            if (user["role"] == "admin") document.getElementById("wrapper").innerHTML = homeAdminHtmlCode;
            else document.getElementById("wrapper").innerHTML = homeHtmlCode;
            document.getElementById("homeContainer").innerText = "WELCOME " + user.username + " !";
            if (user["countLogin"] > 2) document.getElementById("loginMessage").innerText = user["msgLogin"];
            document.getElementsByTagName("footer")[0].style.display = "block";
        }
    });
}

function expandHomeGuest() {
    changeMenuStyle("home");
    document.getElementsByTagName("html")[0].style["overflow-y"] = "visible";
    document.getElementById("wrapper").innerHTML = homeHtmlCodeGuest;
    document.getElementsByTagName("footer")[0].style.display = "block";
}

expandHome();
showLoginInfo();