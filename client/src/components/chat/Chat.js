import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import Spinner from "../common/Spinner";
import { getUsers } from "../../actions/authActions";
import { addChatbox } from "../../actions/chatActions";
import { getCurrentProfile } from "../../actions/profileActions";

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkedBox: ""
    };

    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentProfile();
    this.props.getUsers();
  }

  handleCheckbox(e) {
    if (e.target.checked) {
      this.setState({ checkedBox: e.target.value });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const newChatbox = {
      touser: this.state.checkedBox
    };
    console.log(newChatbox);
    this.props.addChatbox(newChatbox, this.props.history);
    this.setState({ checkedBox: "" });
  }

  render() {
    const { user, users, loading } = this.props.user;

    let userItems;

    if (users === null || loading) {
      userItems = <Spinner />;
    } else {
      if (users.length > 0) {
        const newusers = users.filter(el => el._id !== user.id);
        userItems = newusers.map(user => (
          <div className="users" key={user.id}>
            <div className="row">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <input
                      type="checkbox"
                      aria-label="Checkbox for following text input"
                      checked={this.state.checkedBox === user._id}
                      onChange={this.handleCheckbox}
                      value={user._id}
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <img
                    src={user.avatar}
                    alt=""
                    className="rounded-circle"
                    style={{ width: "20px", marginRight: "5px" }}
                  />
                </div>
                <div className="ml-2">
                  <p className="lead">{user.name}</p>
                </div>
              </div>
            </div>
          </div>
        ));
      } else {
        userItems = <h4>No users Found...</h4>;
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Developer Users</h1>
              <form onSubmit={this.onSubmit}>
                {userItems}
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info mt-4"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Chat.propTypes = {
  getUsers: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  addChatbox: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, getUsers, addChatbox }
)(withRouter(Chat));
