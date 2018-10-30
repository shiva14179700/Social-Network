import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

class ChatItem extends Component {
  render() {
    const { chat } = this.props;

    return (
      <div className="card card-body bg-light mb-3">
        <div className="row">
          <div className="col-2">
            <img
              src={chat.avatar}
              alt=""
              className="rounded-circle"
              style={{ width: "40px", marginRight: "5px" }}
            />
          </div>
          <div className="col-lg-6 col-md-4 col-8 text-center">
            <Link to={`/chats/${chat._id}`} className="nav-link">
              <h3>{chat.name}</h3>
            </Link>
          </div>
          <div className="col-md-4 d-none d-md-block">
            <Link to={`/chats/${chat._id}`} className="btn btn-info">
              View Chat
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

ChatItem.propTypes = {
  chat: PropTypes.object.isRequired
};

export default ChatItem;
