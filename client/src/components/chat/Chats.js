import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import { getChats } from "../../actions/chatActions";
import ChatItem from "./ChatItem";
import { Link } from "react-router-dom";

class Chats extends Component {
  componentDidMount() {
    this.props.getChats();
  }

  render() {
    const { chats, loading } = this.props.chat;

    let chatItems;

    if (chats === null || loading) {
      chatItems = <Spinner />;
    } else {
      if (chats.length > 0) {
        chatItems = chats.map(chat => <ChatItem key={chat._id} chat={chat} />);
      } else {
        chatItems = <h4>No chats Found...</h4>;
      }
    }

    return (
      <div className="chats">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="col-md-6">
                <Link
                  to="/createchat"
                  className="btn btn-light mb-3 float-left"
                >
                  Create chat
                </Link>
              </div>
              <h1 className="display-4 text-center">Developer chats</h1>
              {chatItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Chats.propTypes = {
  getChats: PropTypes.func.isRequired,
  chat: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  chat: state.chat
});

export default connect(
  mapStateToProps,
  { getChats }
)(Chats);
