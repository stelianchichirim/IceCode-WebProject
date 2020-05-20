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

function expandStats() {
    changeMenuStyle("stats");
    document.getElementsByTagName("html")[0].style["overflow-y"] = "visible";
    document.getElementById("wrapper").innerHTML = statsMenuHtmlCode;
    showStats();
    document.getElementsByTagName("footer")[0].style.display = "block";
}

function showStats() {
    let stats = document.getElementById("statsContainer");
    while (stats.firstChild) {    
        stats.removeChild(stats.firstChild);
    }
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
                            if (localStorage["problems" + curr.id]) markedCategories += Number(localStorage["problems" + curr.id]);
                        }
                    for (const curr of blogs)
                        if (Number(curr.category) == element.id) {
                            allCategories++;
                            if (localStorage["blogs" + curr.id]) markedCategories += Number(localStorage["blogs" + curr.id]);
                        }
                    if (allCategories > 0) {
                        let percent = Math.floor((markedCategories * 100) / allCategories);
                        console.log(markedCategories);
                        let bar = aux[1].getElementsByTagName("div")[0];
                        bar.textContent = percent + "%";
                        bar.style.width = percent + "%";
                    }
                    if (element["name"] != "nothing") stats.appendChild(newElement);
                }
            });
        });
    });
}

function addCategory() {
    const newObj = {
        name: document.getElementById("categoryName").value,
    }
    document.getElementById("categoryName").value = "";
    postElement("categories", newObj, function (element) {
        showStats();
    });
}