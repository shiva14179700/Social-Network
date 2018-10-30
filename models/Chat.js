const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create schema
const ChatSchema = new Schema({
  chatid: {
    type: Schema.Types.ObjectId,
    ref: "Chatbox"
  },
  message: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Chat = mongoose.model("Chat", ChatSchema);
