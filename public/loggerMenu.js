function getCurrTime() {
    let today = new Date();
    let h = today.getHours();
    if (h < 10) h = "0" + h;
    let m = today.getMinutes();
    if (m < 10) m = "0" + m;
    let s = today.getSeconds();
    if (s < 10) s = "0" + s;
    let currTime = h + ":" + m + ":" + s;
    return currTime;
}

function getCurrDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    today = dd + '/' + mm + '/' + yyyy;
    return today;
}

function logg(message) {
    let currTime = getCurrTime();
    let today = getCurrDate();
    const newLog = {
        date: today,
        time: currTime,
        info: message
    }
    postElement("logger", newLog, function (element) {} );
}

function expandLogger() {
    getElements("logger", function(logs) {
        changeMenuStyle("profile");
        document.getElementsByTagName("html")[0].style["overflow-y"] = "visible";
        document.getElementsByTagName("footer")[0].style.display = "block";
        let container = document.getElementById("wrapper");
        while (container.firstChild) {    
            container.removeChild(container.firstChild);
        }
        for (let i = logs.length - 1; i >= 0; --i) {
            let msg = "[" + logs[i]["date"] + ", " + logs[i]["time"] + "] " + logs[i]["info"];
            let log = document.createElement("div");
            log.innerText = msg;
            log.classList.add("logStyle");
            container.appendChild(log); 
        }
    });
}