profileHtmlCode = 
`<div class = "statsActions">
    <input type = "text" id = "data" placeholder = "Introduce Data Here" class = "categoryName-input profileInput">
    <button id = "hideText" class = "button-hideText" onclick = "hideText()"><i class = "fa fa-eye-slash"></i></button>
</div>
<div id = "profileContainer" class = "profileContainer">
    <div class = "profileActions">
        <a class = "profileElement" onclick = "updateProfile('picture')" id = "p1"> Update profile picture </a>
        <a class = "profileElement" onclick = "updateProfile('affiliation')" id = "p2"> Update affiliation </a>
        <a class = "profileElement" onclick = "updateProfile('git')" id = "p3"> Update github </a>
        <a class = "profileElement" onclick = "updateProfile('fb')" id = "p4"> Update facebook </a>
        <a class = "profileElement" onclick = "changePass()" id = "p5"> Change Password </a>
    </div>
    <div class="card">
        <img id = "profileImg" class = "profileImg" src="https://res.cloudinary.com/teepublic/image/private/s--SxrM6_Ef--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1456830129/production/designs/434917_1.jpg">
        <h1 id = "userName">USER NAME</h1>
        <p style = "font-size: 20px" id = "statut">Normal User</p>
        <p style = "font-size: 20px" id = "affiliation">Introduce your affiliation</p>
        <div style="margin: 30px 0; font-size: 25px;">
            <a href="" style = "color: #007acc" id = "github"><i class="fa fa-github"></i></a>  
            <a href="" style = "color: #007acc" id = "facebook"><i class="fa fa-facebook"></i></a> 
        </div>
    </div>
</div>`

function expandProfileUser(user) {
    changeMenuStyle("profile");
    document.getElementsByTagName("html")[0].style["overflow-y"] = "visible";
    document.getElementById("wrapper").innerHTML = profileHtmlCode;
    if (user["picture"]) document.getElementById("profileImg").src = user["picture"];
    document.getElementById("userName").innerText = user["username"];
    if (user["block"] && user["block"] == '1') {
        document.getElementById("statut").innerText = "BLOCKED";
        document.getElementsByClassName("card")[0].style = "border: ridge; border-color: red;";
    }
    else document.getElementById("statut").innerText = user["role"];
    if (user["affiliation"]) document.getElementById("affiliation").innerText = user["affiliation"];
    if (user["git"]) document.getElementById("github").href = user["git"];
    if (user["fb"]) document.getElementById("facebook").href = user["fb"];
    document.getElementsByTagName("footer")[0].style.display = "block";
}

function changePassUser(user, name) {
    let newPass = document.getElementById("data").value;
    let ok = true;
    for (const ch of newPass) 
        if (('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z' ) || ('0' <= ch && ch <= '9')) continue;
        else ok = false;
    if (ok == false || newPass == "") {
        if (name == "-1") expandProfileUser(user);
        else showUser(user, name);
        let message = document.createElement("div");
        message.style = "font-size: 24px;";
        message.innerText = "Password must have only english letters or digits";
        document.getElementsByClassName("profileActions")[0].appendChild(message);
    }
    else {
        user["password"] = newPass;
        if (name == "-1") localStorage["account"] = user["username"] + "-" + newPass;
        updateUser(user);
        if (name == -1) {
            logg(user["username"] + " changed his/her password.");
            expandProfileUser(user);
        }
        else {
            logg(name + " changed " + user["username"] + " 's password.");
            showUser(user, name);
        }
    }
}

function expandProfile() {
    getUser(function(user) {
        expandProfileUser(user);
    });
}

function updateProfile(str) {
    getUser(function(user) {
        let curr = document.getElementById("data").value;
        if (curr != "") {
            user[str] = curr;
            logg(user["username"] + " updated his/her profile.");
            updateUser(user);
            expandProfile();
        }
    });
}

function changePass() {
    getUser(function(user) {
        changePassUser(user, "-1");
    });
}

function findUser() {
    let userName = document.getElementById("userName").value;
    getElements("users", function(elements) {
        let found = false;
        let user;
        for (const curr of elements)
            if (curr["username"] == userName) {
                found = true;
                user = curr;
                break;
            }
        if (!found && document.getElementById("message") == null) {
            let message = document.createElement("div");
            message.style = "font-size: 24px;";
            message.innerText = "Username does not exist !";
            message.id = "message";
            message.classList.add("homeActions");
            document.getElementById("wrapper").appendChild(message);
        }
        else if (found) {
            getUser(function(admin) {
                showUser(user, admin["username"]);
            });
        }
    });
}

function showUser(user, admin) {
    expandProfileUser(user);
    document.getElementById("data").placeholder = "New Password";

    document.getElementById("p1").innerText = "Change in Normal User";
    document.getElementById('p1').removeAttribute("onclick");
    document.getElementById("p1").onclick = function() { changeRole(user, "user", admin); }

    document.getElementById("p2").innerText = "Change in Admin";
    document.getElementById('p2').removeAttribute("onclick");
    document.getElementById("p2").onclick = function() { changeRole(user, "admin", admin); }

    document.getElementById("p3").innerText = "Change Password";
    document.getElementById('p3').removeAttribute("onclick");
    document.getElementById("p3").onclick = function() { changePassUser(user, admin); }

    document.getElementById("p4").innerText = "Block User";
    document.getElementById('p4').removeAttribute("onclick");
    document.getElementById("p4").onclick = function() { blockUser(user, admin); }

    document.getElementById("p5").innerText = "Delete User";
    document.getElementById('p5').removeAttribute("onclick");
    document.getElementById("p5").onclick = function() { deleteUser(user, admin); }
}

function changeRole(user, role, admin) {
    user["role"] = role;
    if (role == "admin") logg(admin + " changed " + user["username"] + " 's role into ADMIN.");
    else logg(admin + " changed " + user["username"] + " 's role into NORMAL USER.");
    updateUser(user);
    showUser(user, admin);
}

function blockUser(user, admin) {
    if (!user["block"] || user["block"] == 0) {
        user["block"] = 1;
        logg(admin + " blocked " + user["username"] + ".");
    }
    else {
        user["block"] = 0;
        logg(admin + " unblocked " + user["username"] + ".");
    }
    updateUser(user);
    showUser(user, admin);
}

function deleteUser(user, admin) {
    deleteElement("users", Number(user.id), function() {
        logg(admin + " deleted " + user["username"] + " 's account.");
        expandHome();
    });
}

function hideText() {
    let curr = document.getElementById("data");
    if (curr.type == "text") curr.type = "password";
    else curr.type = "text";
}