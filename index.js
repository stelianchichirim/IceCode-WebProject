const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const uuid = require("uuid");
const path = require('path');
const fs = require("fs");

const app = express();

const allTypes = ['problems', 'blogs', 'categories'];

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());

// Create
app.post("/app/:type", (req, res) => {
    const elements = readJSONFile();
    const newElement = req.body;
    const type = req.params.type;
    if (!allTypes.includes(type)) res.status(404).send(`Type not found`);
    else {
        newElement.id = 1;
        if (elements[type].length > 0) newElement.id = elements[type][elements[type].length - 1].id + 1;
        elements[type].push(newElement);
        writeJSONFile(elements);
        res.json(elements[type][elements[type].length - 1]);
    }
});

// Read one
app.get("/app/:type/:id", (req, res) => {
    const elements = readJSONFile();
    const id = req.params.id;
    const type = req.params.type;
    if (!allTypes.includes(type)) res.status(404).send(`Type not found`);
    else {
        let found = false;
        let element;
        for (const x of elements[type])
            if (x.id == id) {
                element = x;
                found = true;
            }
        if (found) res.json(element);
        else res.status(404).send(`Element ${id} was not found`);
    }
});

// Read all
app.get("/app/:type", (req, res) => {
    const elements = readJSONFile();
    const type = req.params.type;
    if (!allTypes.includes(type)) res.status(404).send(`Type not found`);
    else {
        res.json(elements[type]);
    }
});

// Update
app.put("/app/:type/:id", (req, res) => {
    const elements = readJSONFile();
    const type = req.params.type;
    if (!allTypes.includes(type)) res.status(404).send(`Type not found`);
    else {
        const newElement = req.body;
        const id = req.params.id;
        newElement.id = id;
        let found = false;
        for (let i = 0; i < elements[type].length; ++i)
            if (elements[type][i].id == id) {
                found = true;
                elements[type][i] = newElement;
                break;
            }
        writeJSONFile(elements);
        if (found) res.json(newElement);
        else res.status(404).send(`Element ${id} was not found`);
    }
});

// Delete
app.delete("/app/:type/:id", (req, res) => {
    const elements = readJSONFile();
    const type = req.params.type;
    if (!allTypes.includes(type)) res.status(404).send(`Type not found`);
    else {
        const id = req.params.id;
        let pos = -1;
        for (let i = 0; i < elements[type].length; ++i)
            if (elements[type][i].id == id) {
                pos = i;
                break;
            }
        if (pos == -1) res.status(404).send(`Element ${id} was not found`);
        else {
            elements[type].splice(pos, 1);
            res.status(200).send(`Artist ${id} was removed`);
            writeJSONFile(elements);
        }
    }
});

function readJSONFile() {
  return JSON.parse(fs.readFileSync("db.json"));
}

function writeJSONFile(content) {
  fs.writeFileSync(
    "db.json",
    JSON.stringify(content),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}

app.use(express.static(path.join(__dirname, 'public')));

app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);