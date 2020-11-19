const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

app.get("/api/workouts", (req, res) => {
  db.Workout.find()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json(err);
    });
});

app.post("/api/workouts", (req,res) => {
    db.Workout.create({exercises: []})
    .then(data => res.json(data))
    .catch(err => console.log(err));
  }
);

app.get("/exercise", (req, res) => {
  const id = req.query.id;
  console.log(id);
  
  db.Workout.findOne({_id: id})
    .then(data => {
      res.sendFile(path.join(__dirname, './public', '/exercise.html'));
    })
    .catch(err => {
      res.json(err);
    });
});

app.put("/api/workouts/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  console.log(req.body);

  db.Workout.updateOne({_id: id}, {$push: {"exercises":  req.body}})
  .then(data => res.json(data))
  .catch(error => console.log(error));
  
});

app.get("/api/workouts/range", (req,res) => {
  db.Workout.find()
  .then(data => {
    res.json(data);
  })
  .catch(err => {
    res.json(err);
  });
});

app.get("/stats", (req,res) => {
  res.sendFile(path.join(__dirname, './public', '/stats.html'));
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});