import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { User, Exercise, Log } from "./models.js";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express()

// Middlewares
dotenv.config()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

// Endpoints
const __dirname = import.meta.dirname
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", async (req, res) => {
  const username = req.body.username
  const user = await User.create({
    username: username
  })
  return res.json({
    "username": user.username,
    "__id": user._id
  })
})

app.get("/api/users", async (req, res) => {
  const users = await User.find()
  return res.json(users)
})

app.post("/api/users/:id/exercises", async (req, res) => {
  const id = req.params.id
  let { description, duration, date } = req.body

  if (!date) {
    date = new Date().toDateString()
  } else {
    date = new Date(date).toDateString()
  }

  const user = await User.findById(id)

  const exer = Exercise.create({
    username: user.username,
    description: description,
    duration: Number(duration),
    date: date
  })

  return res.json({
    "username": user.username,
    "description": description,
    "duration": Number(duration),
    "date": date,
    "_id": user._id
  })
})

app.get("/api/users/:id/logs", async (req, res) => {
  const id = req.params.id

  const user = await User.findById(id)
  const exercises = await Exercise.find({ username: user.username })
  const count = await Exercise.countDocuments({ username: user.username })

  const logEntries = exercises.map(exercise => ({
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date
  }))

  const log = await Log.create({
    username: user.username,
    count: count,
    log: logEntries
  })
  return res.json(log)
})

// Connect to db and start server
const port = process.env.PORT || 3000
mongoose.connect(process.env.MONGO_URI, { dbName: "Cooked" })
  .then(
    console.log("Successfully connected to database"),
    app.listen(port, () => {
      console.log('Your app is listening on port ' + port)
    })
  )
  .catch(err => console.log(err))

