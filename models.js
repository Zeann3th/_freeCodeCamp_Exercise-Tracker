import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  }
})

const User = mongoose.model("User", userSchema)

const exerciseSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
})

const Exercise = mongoose.model("Exercise", exerciseSchema)

const logSchema = new mongoose.Schema({
  username: {
    type: String
  },
  count: {
    type: Number,
    default: 0
  },
  log: [{
    description: {
      type: String
    },
    duration: {
      type: Number
    },
    date: {
      type: String
    }
  }]
})

const Log = mongoose.model("Log", logSchema)

export { User, Exercise, Log }
