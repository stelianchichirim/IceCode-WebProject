noAccHtmlCode = 
`<a onclick = "expandHome()"> Login or Sign up</a>`

accHtmlCode =
`<a onclick = "expandProfile()" id = "accName"> </a>
<a style = "cursor: auto;"> | </a>
<a onclick = "logout()"> Logout</a>`

function showLoginInfo() {
    getUser(function(user) {
        let loginInfo = document.getElementById("loginInfo");
        if (user == "") loginInfo.innerHTML = noAccHtmlCode;
        else {
            loginInfo.innerHTML = accHtmlCode;
            document.getElementById("accName").innerText = user["username"];
        }
    });
}

function getUser(f) {
    if (!localStorage["account"]) f("");
    else {
        getElements("users", function(elements) {
            let found = false;
            let obj;
            for (const element of elements) {
                if (element["username"] + "-" + element["password"] == localStorage["account"]) {found = true; obj = element; break;}
            }
            if (found && obj["block"] && obj["block"] == "1") {
                logout();
                return;
            }
            if (found) f(obj);
            else f("");
        });
    }
}

function updateUser(user) {
    if (user == "") return;
    updateElement("users", user["id"], user, function() {});
}

function logout() {
    getUser(function(user) {
        user["msgLogin"] = "Last time you connected from ip " + user["ipLogin"] + " at " + user["dateLogin"] + ", " + user["timeLogin"] + ". You visited the site " + user["countLogin"] + " times.";
        updateUser(user);
        localStorage["account"] = "";
        expandHomeGuest();
        showLoginInfo();
    });
}

function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    getElements("users", function(elements) {
        let found = false;
        let obj;
        for (const element of elements) {
            if (username == element["username"] && password == element["password"]) {found = true; obj = element; break;}
        }
        if (found && obj["block"] && obj["block"] == "1") {
            expandHomeGuest();
            let message = document.createElement("div");
            message.innerText = "This account is BLOCKED";
            document.getElementsByClassName("homeLogin")[0].appendChild(message);
            return;
        }
        if (found) {
            fetch('https://api.ipify.org?format=json').then(function(response) {
                response.json().then(function(data) {
                    localStorage["account"] = username + "-" + password;
                    obj["countLogin"]++;
                    obj["dateLogin"] = getCurrDate();
                    obj["timeLogin"] = getCurrTime();
                    obj["ipLogin"] = data.ip;
                    updateUser(obj);
                    expandHome();
                    showLoginInfo();
                })
            });
        }
        else {
            expandHomeGuest();
            let message = document.createElement("div");
            message.innerText = "Username or Password is invalid";
            document.getElementsByClassName("homeLogin")[0].appendChild(message);
        }
    });
}

function signUp() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let ok = true;
    for (const ch of username) 
        if (('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z' ) || ('0' <= ch && ch <= '9')) continue;
        else ok = false;
    for (const ch of password) 
        if (('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z' ) || ('0' <= ch && ch <= '9')) continue;
        else ok = false;
    if (ok == false || username == "" || password == "") {
        expandHomeGuest();
        let message = document.createElement("div");
        message.innerText = "Username or Password is incorrect";
        document.getElementsByClassName("homeLogin")[0].appendChild(message);
    }
    else {
        getElements("users", function(elements) {
            let found = false;
            for (const element of elements) {
                if (username == element["username"]) {found = true; break;}
            }
            if (found) {
                expandHomeGuest();
                let message = document.createElement("div");
                message.innerText = "Username already exists";
                document.getElementsByClassName("homeLogin")[0].appendChild(message);
            }
            else {
                fetch('https://api.ipify.org?format=json').then(function(response) {
                    response.json().then(function(data) {
                        const newUser = {
                            username: username,
                            password: password,
                            role: "user",
                            countLogin: 2,
                            dateLogin: getCurrDate(),
                            timeLogin: getCurrTime(),
                            ipLogin: data.ip
                        }
                        logg(username + " signed up for the site !");
                        postElement("users", newUser, function (element) {
                            localStorage["account"] = username + "-" + password;
                            expandHome();
                            showLoginInfo();
                        });
                    })
                });
            }
        });
    }
}