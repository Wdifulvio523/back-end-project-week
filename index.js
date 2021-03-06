require('dotenv').config()
const express = require("express");
const knex = require("knex");
const cors = require("cors");
const knexConfig = require("./knexfile");
const db = knex(knexConfig.development);

// const db = require('./data/db');

const server = express();
server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
  res.send("We are runnin....");
});

//Get Notes
//Endpoint Works
server.get("/api/notes", (req, res) => {
  db("notes")
    .then(notes => {
      res.status(200).json(notes);
    })
    .catch(err => res.status(500).json( {err}));
});

//Post New Note
//Endpoint Works
server.post("/api/notes", (req, res) => {
  const { title, content } = req.body;
  db()
    .insert({ title, content })
    .into("notes")
    .then(
      response => {
      res.status(201).json(response.data);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//Get Specific Note By ID
//Endpoint Works
server.get("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  db("notes")
    .where("id", Number(id))
    .then(note => {
      if (note.length === 0) {
        res
          .status(404)
          .json({ mesage: "The note with the specified ID does not exist." });
      }
      res.status(200).json(note);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//Update Note
//Endpoint Works
server.put("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  db("notes")
    .where("id", Number(id))
    .update({ title, content })
    .then(note => {
      res.status(201).json(note);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//Delete Note
//Endpoint Works
server.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;
  db("notes")
    .where("id", Number(id))
    .delete()
    .then(note => {
      if (note.length === 0) {
        res.status(404).json({ message: "That ID doesn't exists" });
      }
      res.status(200).json({ message: "Success in deleting" });
    })
    .catch(error => {
      res.status(500).json({ error: "Error Deleting note" });
    });
});


const port = process.env.PORT || 9000;
server.listen(port, () => console.log(`API is running on ${port}`))