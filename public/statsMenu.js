statsMenuHtmlCode = 
`<div id = "statsActions" class = "statsActions">
<label for = "categoryName">ADD NEW CATEGORY:</label>
<input type = "text" id = "categoryName" placeholder = "Category name" class = "categoryName-input">
<button id = "addCategory" class = "button-addCategory" onclick = "addCategory()"><i class = "fa fa-check"></i></button>
</div>
<div id = "statsContainer" class = "statsContainer"> </div>`

statsHtmlCode = 
`<div class = "statName">DATA STRUCTURE</div><br><br>
<div class = "progressbar"><div class = "barPercentage">100%</div></div>`

statsGuestHtmlCode =
`<div id ="homeContainer" class = "homeContainer">YOU NEED TO BE LOGGED IN TO SEE THIS PAGE !</div>`

function expandStats() {
    changeMenuStyle("stats");
    document.getElementsByTagName("html")[0].style["overflow-y"] = "visible";
    getUser(function(user) {
        if (user == "") document.getElementById("wrapper").innerHTML = statsGuestHtmlCode;
        else {
            document.getElementById("wrapper").innerHTML = statsMenuHtmlCode;
            if (user["role"] == "user") {
                document.getElementsByTagName("label")[0].innerText = "Just admins can add categories !";
                document.getElementById("categoryName").style.display = "none";
                document.getElementById("addCategory").style.display = "none";
            }
            showStats();
        }
    });
    document.getElementsByTagName("footer")[0].style.display = "block";
}

function showStats() {
    let stats = document.getElementById("statsContainer");
    while (stats.firstChild) {    
        stats.removeChild(stats.firstChild);
    }
    getUser(function(user) {
        getElements("categories", function (elements) {
            getElements("problems", function (problems) {
                getElements("blogs", function (blogs) {
                    for (const element of elements) {
                        let newElement = document.createElement("div");
                        newElement.setAttribute("id", element["id"]);
                        newElement.setAttribute("class", "categoryStat");
                        newElement.innerHTML = statsHtmlCode;
                        let aux = newElement.getElementsByTagName("div");
                        aux[0].textContent = element["name"];
                        let allCategories = 0, markedCategories = 0;
                        for (const curr of problems)
                            if (Number(curr.category) == element.id) {
                                allCategories++;
                                if (user["problems" + curr.id]) markedCategories += Number(user["problems" + curr.id]);
                            }
                        for (const curr of blogs)
                            if (Number(curr.category) == element.id) {
                                allCategories++;
                                if (user["blogs" + curr.id]) markedCategories += Number(user["blogs" + curr.id]);
                            }
                        if (allCategories > 0) {
                            let percent = Math.floor((markedCategories * 100) / allCategories);
                            let bar = aux[1].getElementsByTagName("div")[0];
                            bar.textContent = percent + "%";
                            bar.style.width = percent + "%";
                        }
                        if (element["name"] != "nothing") stats.appendChild(newElement);
                    }
                });
            });
        });
    });
}

function addCategory() {
    const newObj = {
        name: document.getElementById("categoryName").value,
    }
    getUser(function(user) {
        if (user["role"] != "admin") return;
        logg(user["username"] + " added a new category called " + newObj["name"] + ".");
        document.getElementById("categoryName").value = "";
        postElement("categories", newObj, function (element) {
            showStats();
        });
    });
}