
function getElements(type, f) {
    fetch(`http://localhost:3000/app/${type}`)
        .then(function (response) {
            response.json().then(function (elements) {
                f(elements);
            });
        });
};

function getElement(type, id, f) {
    fetch(`http://localhost:3000/app/${type}/${id}`)
        .then(function (response) {
            response.json().then(function (element) {
                f(element);
            });
        });
}

function postElement(type, obj, f) {
    fetch(`http://localhost:3000/app/${type}`, {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(obj)
    }).then(function (response) {
        response.json().then(function (element) {
            f(element);  //return the added element
        });
    });
}

function deleteElement(type, id, f) {
    fetch(`http://localhost:3000/app/${type}/${id}`, {
        method: 'DELETE',
    }).then(function () {
        f();
    });
}

function updateElement(type, id, obj, f) {
    fetch(`http://localhost:3000/app/${type}/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(obj)
    }).then(function () {
        f();
    });
}