prbBlogMenuHtmlCode = `
<div id = "actions" class = "actions">
<button id = "add" class = "button-add"><i class = "fa fa-plus"></i></button>
<button id = "edit" class = "button-edit"><i class = "fa fa-edit"></i></button>
<button id = "delete" class = "button-delete"><i class = "fa fa-minus"></i></button>
<button id = "read" class = "button-read"><i class = "fa fa-calendar-check-o"></i></button>
</div>
<div id = "container" class = "container">
<aside id = "sidebar" class = "sidebar">
</aside> 
<div class = "horizontal-divider"> 
    <a class = "divider-arrow" onclick = "resizeReadContent()"><i class = "fa fa-caret-left"></i></a>
</div>
<section id = "readContent" class = "section"> </section>

</div>`

sectionHtmlCode = `
<label for = "problemName">Problem name:</label>
<input type = "text" name = "Problem Name" id = "elementName" placeholder = "Problem Name" class = "problemName-input">
<br><br>
<label for = "category">Category:</label>
<select id="category" class = "category-input">
</select>
<br><br>
<label for = "textArea">Content:</label><br><br>
<textarea name = "text" id = "textArea" class = "textArea">WRITE YOUR HTML HERE!!!!
</textarea> <br><br>
<button id = "save" class = "button-save"><i class = "fa fa-check"></i></button>`



function expandProblems() {
    changeMenuStyle("problems");
    document.documentElement.scrollTop = 0;
    document.getElementsByTagName("html")[0].style["overflow-y"] = "hidden";
    getUser(function(user) {
        document.getElementById("wrapper").innerHTML = prbBlogMenuHtmlCode;
        document.getElementById("add").addEventListener("click", function(){
            addContent("problems");
        });
        document.getElementById("edit").addEventListener("click", function(){
            editContent("problems");
        });
        document.getElementById("delete").addEventListener("click", function(){
            deleteContent("problems");
        });
        document.getElementById("read").addEventListener("click", function(){
            readContent("problems");
        });
        showSidebar("problems");
        if (user == "") document.getElementById("actions").style.display = "none";
    });
    document.getElementsByTagName("footer")[0].style.display = "none";
}

function expandBlogs() {
    changeMenuStyle("blogs");
    document.documentElement.scrollTop = 0;
    document.getElementsByTagName("html")[0].style["overflow-y"] = "hidden";
    getUser(function(user) {
        document.getElementById("wrapper").innerHTML = prbBlogMenuHtmlCode;
        document.getElementById("add").addEventListener("click", function(){
            addContent("blogs");
        });
        document.getElementById("edit").addEventListener("click", function(){
            editContent("blogs");
        });
        document.getElementById("delete").addEventListener("click", function(){
            deleteContent("blogs");
        });
        document.getElementById("read").addEventListener("click", function(){
            readContent("blogs");
        });
        showSidebar("blogs");
        if (user == "") document.getElementById("actions").style.display = "none";
    });
    document.getElementsByTagName("footer")[0].style.display = "none";
}

function showSidebar(type, id = 1) {
    let sidebar = document.getElementById("sidebar");
    while (sidebar.firstChild) {    
        sidebar.removeChild(sidebar.firstChild);
    }
    getUser(function(user) {
        getElements(type, function (elements) {
            for (const element of elements) {
                let newElement = document.createElement("a");
                newElement.setAttribute("id", element["id"]);
                newElement.setAttribute("class", "sidebarElement");
                if (user != "" && user[type + element["id"]] && user[type + element["id"]] == 1) newElement.classList.add("done-element");
                newElement.textContent = element["name"];
                newElement.addEventListener("click", function () {
                    showContent(type, element["id"]);
                });
                sidebar.appendChild(newElement);
            }
            showContent(type, id);
        });
    });
}

function resizeReadContent() {
    let arrow = document.getElementsByClassName("divider-arrow")[0].getElementsByTagName("i")[0];
    if (arrow.classList.contains("fa-caret-left")) {
        let sidebar = document.getElementsByClassName("sidebar")[0];
        let section = document.getElementsByClassName("section")[0];
        sidebar.classList.remove("sidebar");
        sidebar.classList.add("sidebarAfter");
        section.classList.remove("section");
        section.classList.add("sectionAfter");
        arrow.classList.remove("fa-caret-left");
        arrow.classList.add("fa-caret-right");
    }
    else {
        let sidebar = document.getElementsByClassName("sidebarAfter")[0];
        let section = document.getElementsByClassName("sectionAfter")[0];
        sidebar.classList.remove("sidebarAfter");
        sidebar.classList.add("sidebar");
        section.classList.remove("sectionAfter");
        section.classList.add("section");
        arrow.classList.remove("fa-caret-right");
        arrow.classList.add("fa-caret-left");
    }
}

function showContent(type, id) {
    let section = document.getElementById("readContent");
    while (section.firstChild) {    
        section.removeChild(section.firstChild);
    }
    let v = document.getElementsByClassName("sidebarElement-active");
    for (let x of v) {
        x.classList.remove("sidebarElement-active");
    }
    document.getElementById(id).classList.add("sidebarElement-active");
    getElement(type, id, function (element) {
        section.innerHTML = element["content"];
    });
}

function addContent(type) {
    getElements("categories", function (categories) {
        let section = document.getElementById("readContent");
        while (section.firstChild) {
            section.removeChild(section.firstChild);
        }
        document.getElementById("readContent").innerHTML = sectionHtmlCode;
        document.getElementById("elementName").placeholder = (type == "problems") ? "Problem Name" : "Blog Name";
        document.getElementById("save").addEventListener("click", function(){
            saveNewContent(type);
        });
        for (const category of categories) {
            let curr = document.createElement("option");
            curr.value = category["id"];
            curr.text = category["name"];
            document.getElementById("category").add(curr);
        }
    });
}

function saveNewContent(type) {
    getUser(function(user) {
        if (user["role"] != "admin" && user["role"] != "user") return;
        const newObj = {
            name: document.getElementById("elementName").value,
            category: document.getElementById("category").value,
            content: document.getElementById("textArea").value
        }
        let curr;
        if (type == "problems") curr = "problem";
        else curr = "blog";
        logg(user["username"] + " added " + curr + " " + newObj["name"] + ".");
        postElement(type, newObj, function (element) {
            showSidebar(type, element["id"]);
        });
    });
}

function editContent(type) {
    getElements("categories", function (categories) {
        let section = document.getElementById("readContent");
        while (section.firstChild) {
            section.removeChild(section.firstChild);
        }
        document.getElementById("readContent").innerHTML = sectionHtmlCode;
        document.getElementById("elementName").placeholder = (type == "problems") ? "Problem Name" : "Blog Name";
        for (const category of categories) {
            let curr = document.createElement("option");
            curr.value = category["id"];
            curr.text = category["name"];
            document.getElementById("category").add(curr);
        }
        let currElement = document.getElementsByClassName("sidebarElement-active")[0];
        getElement(type, Number(currElement.id), function (element) {
            document.getElementById("elementName").value = element["name"];
            document.getElementById("category").value = element["category"];
            document.getElementById("textArea").value = element["content"];
            document.getElementById("save").addEventListener("click", function(){
                editIdContent(type, element["id"]);
            });
        });
    });
}

function editIdContent(type, id) {
    getUser(function(user) {
        if (user["role"] != "admin" && user["role"] != "user") return;
        const newObj = {
            name: document.getElementById("elementName").value,
            category: document.getElementById("category").value,
            content: document.getElementById("textArea").value
        }
        let curr;
        if (type == "problems") curr = "problem";
        else curr = "blog";
        logg(user["username"] + " changed " + curr + " " + newObj["name"] + ".");
        updateElement(type, id, newObj, function() {
            showSidebar(type, id);
        });
    });
}

function deleteContent(type) {
    getUser(function(user) {
        if (user["role"] != "admin" && user["role"] != "user") return;
        let currElement = document.getElementsByClassName("sidebarElement-active")[0];
        if (currElement.id == "1") return;
        if (user != "" && user[type + currElement.id]) {
            user[type + currElement.id] = 0;
            updateUser(user);
        }
        let curr;
        if (type == "problems") curr = "problem";
        else curr = "blog";
        logg(user["username"] + " deleted " + curr + " " + currElement.textContent + ".");
        deleteElement(type, Number(currElement.id), function() {
            showSidebar(type);
        });
    });
}

function readContent(type) {
    getUser(function(user) {
        let currElement = document.getElementsByClassName("sidebarElement-active")[0];
        if (user == "") return;
        getElement(type, Number(currElement.id), function (element) {
            if (!(user[type + element["id"]]) || user[type + element["id"]] == 0) {
                user[type + element["id"]] = 1;
                updateUser(user);
                currElement.classList.add("done-element");
            }
            else {
                user[type + element["id"]] = 0;
                updateUser(user);
                currElement.classList.remove("done-element");
            }
        });
    });
}