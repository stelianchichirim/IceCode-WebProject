function changeMenuStyle(str) {
    let v = document.getElementsByClassName("menu-item-active");
    for (let x of v) {
        x.classList.remove("menu-item-active");
    }
    let curr = document.getElementById(str);
    curr.classList.add("menu-item-active");
}

/// Home Menu

homeHtmlCode =
`<div id ="homeContainer" class = "homeContainer">WELCOME TO MY WEBSITE !</div>`

function expandHome() {
    changeMenuStyle("home");
    document.getElementsByTagName("html")[0].style["overflow-y"] = "visible";
    document.getElementById("wrapper").innerHTML = homeHtmlCode;
    document.getElementsByTagName("footer")[0].style.display = "block";
}

expandHome();