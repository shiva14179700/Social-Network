import React from "react";
import io from "socket.io-client";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "",
      messages: [],
      status: ""
    };

    const update = setTimeout(function() {
      var elem = document.getElementById("scroll");
      elem.scrollTop = elem.scrollHeight;
    }, 1000);

    const { user } = this.props.auth;

    const chatid = this.props.match.params.id;

    this.socket = io.connect("localhost:4000");

    const chatdata = {
      chatid: chatid,
      name: user.name
    };

    this.socket.emit("start", chatdata);

    this.socket.on("output", function(data) {
      addMessage(data);
    });

    const addMessage = data => {
      if (Object.prototype.toString.call(data) === "[object Array]") {
        data.map(item => {
          this.setState({ messages: [...this.state.messages, item] });
        });
      } else {
        this.setState({ messages: [...this.state.messages, data] });
      }
      console.log(this.state.messages);
    };

    // Get Status From Server
    this.socket.on("Status", function(data) {
      addStatus(data);
    });

    const addStatus = info => {
      if (typeof info === "object") {
        statusUpdate(info.message);
      } else {
        statusUpdate(info);
      }
    };

    const updateScrolling = () => {
      setTimeout(function() {
        var elem = document.getElementById("scroll");
        elem.scrollTop = elem.scrollHeight;
      }, 1000);
    };

    const statusUpdate = s => {
      // Set status
      this.setState({ status: s });
      if (s !== "") {
        var delay = setTimeout(function() {
          statusUpdate("");
        }, 4000);
      }
    };

    this.onChange = e => {
      this.setState({ [e.target.name]: e.target.value });
    };

    this.sendMessage = e => {
      e.preventDefault();

      const newMessage = {
        message: this.state.message,
        chatid: chatid,
        name: user.name
      };

      this.socket.emit("input", newMessage);
      this.setState({ message: "" });
      updateScrolling();
    };
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="card-title">Chat</div>
                <hr />
                <div className="messages scroll" id="scroll">
                  {this.state.messages.map(message => {
                    return (
                      <div>
                        {message.name}: {message.message}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div id="status">{this.state.status}</div>
              <div className="card-footer">
                <input
                  type="text"
                  name="message"
                  placeholder="Message"
                  className="form-control"
                  value={this.state.message}
                  onChange={this.onChange}
                />
                <br />
                <button
                  onClick={this.sendMessage}
                  className="btn btn-primary form-control"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Chat.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Chat);
