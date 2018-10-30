const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const client = require("socket.io").listen(4000).sockets;

//chatbox model
const ChatBox = require("../../models/Chatbox");

//chat model
const Chat = require("../../models/Chat");

//Validation
const validateChatInput = require("../../validations/chatbox");

//@route GET api/chats/test
//@description Tests chats route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "chats works!" }));

//@route POST api/chats/
//@description creating chat with others
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateChatInput(req.body.touser);

    //Check validation
    if (!isValid) {
      //return any errors with 400 status
      return res.status(400).json(errors);
    }

    var data = req.body;

    User.findOne({ _id: data.touser })
      .then(data1 => {
        //get chats from mongo collection
        ChatBox.findOne({
          $or: [
            {
              $and: [{ fromuser: req.user.id }, { touser: data.touser }]
            },
            { $and: [{ touser: req.user.id }, { fromuser: data.touser }] }
          ]
        })
          .then(chatbox => {
            if (chatbox) {
              errors.touser = "Chat with this user already exists!";
              return res.json(errors);
            } else {
              const chatt = {
                fromuser: req.user.id,
                touser: data.touser,
                name: data1.name,
                avatar: data1.avatar
              };

              new ChatBox(chatt).save().then(chatbox => res.json(chatbox));
            }
          })
          .catch(err => res.json(err));
      })
      .catch(err => console.log(err));
  }
);

//@route GET api/chats
//@description Get Chats by from userid
//@access Private
router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    ChatBox.find({ $or: [{ fromuser: req.user.id }, { touser: req.user.id }] })
      .sort({ date: -1 })
      .then(chats => res.json(chats))
      .catch(err => res.status(404).json({ nochatsfound: "No chats found" }));
  }
);

//connect to socket.io
client.on("connection", socket => {
  //create a function to send status
  sendStatus = function(s) {
    socket.emit("Status", s);
  };

  socket.on("start", data => {
    Chat.find({ chatid: data.chatid })
      .sort({ date: 1 })
      .limit(100)
      .then(res => {
        console.log(res);
        //Emit the messages
        socket.emit("output", res);
      })
      .catch(err => {
        throw err;
      });
  });

  //Handle input events
  socket.on("input", data => {
    let message = data.message;
    let chatid = data.chatid;
    let name = data.name;

    //check for name and message
    if (message == "") {
      //send err status
      sendStatus("Please enter a proper details");
    } else {
      //insert message to database
      const newChat = new Chat({
        message: message,
        chatid: chatid,
        name: name
      });

      newChat
        .save()
        .then(chat => {
          client.emit("output", data);
          //send status
          sendStatus({
            message: "message sent",
            clear: true
          });
        })
        .catch(err => console.log(err));
    }
  });

  //Handle clear
  socket.on("clear", data => {
    //remove all chats from collection
    Chat.find().then(chat => {
      chat.splice(0, chat.length);
      //save
      Chat.save().then(chat => {
        //Emit cleared
        socket.emit("cleared!");
      });
    });
  });
});

module.exports = router;
