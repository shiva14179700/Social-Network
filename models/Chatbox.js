const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema
const ChatboxSchema = new Schema({
  fromuser: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  group: {
    type: String
  },
  touser: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  name: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Chatbox = mongoose.model("Chatbox", ChatboxSchema);
