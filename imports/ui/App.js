import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session'
import { withTracker } from 'meteor/react-meteor-data';

import QRCode from 'qrcode.react';

import AccountsUI from './Accounts.js';

const globalRegex = ".*";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: '',
    }
  }

  isAdmin() {
    return this.props.currentUser && this.props.currentUser['username'] === "metta-admin";
  }

  renderUsers() {
    return this.props.users.map((user, index) => {
      if (user.profile)
        return (
          <tr key={user._id}>
            <td>{index + 1}</td>
            <td><a id={user._id} onClick={this.setProfile.bind(this, user.profile)}>{user.username}</a></td>
            <td>{user.profile.score || 0}</td>
            {this.scoreInput(user)}
          </tr>
        );
    });
  }

  setProfile(profile, event) {
    this.setState({ profile });
  }

  clearProfile() {
    this.setState({ profile: '' });
  }

  renderProfile() {
    const profile = this.state.profile;
    console.log(profile);
    if (profile) {
      return (
        <div className="row">
          <div className="col s12">
            <div className="card">
              <div className="card-content">
                <span className="card-title">{profile.name}</span>
                <p>{profile.bio}</p>
                <br/>
                <p>Social Media: {profile.social_media}</p>
                <p>Ethereum Address: {profile.ethereum}</p>
                <br/>
                <QRCode value={profile.ethereum || ""} />
              </div>
              <div className="card-action">

                <a href="#" onClick={this.clearProfile.bind(this)}>Hide Profile</a>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  scoreInput(user) {
    if (this.isAdmin())
      return (
        <span>
          <input id={user._id} value={user.profile.score || 0} type="number" onChange={this.setScore.bind(this)}></input>
        </span>
      )
  }

  setScore(event) {
    if (this.isAdmin()) {
      const userId = event.target.id;
      const score = Number(event.target.value);
      return Meteor.call('score.set', userId, score);
    }
  }

  search(event) {
    if (event.target.value) {
      Session.set("searchTerm", event.target.value);
    } else {
      Session.set("searchTerm", globalRegex)
    }
  }

  render() {
    return (
      <div className="container">

        <AccountsUI currentUser={this.props.currentUser}/>

        <input type="search" placeholder="Search usernames..." onChange={this.search.bind(this)}></input>

        {this.renderProfile()}

        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Score</th>
              {this.isAdmin() && (
                <th>Update Score</th>
              )}
            </tr>
          </thead>

          <tbody>
            {this.renderUsers()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('users');
  let search = Session.get("searchTerm") || globalRegex;

  return {
    currentUser: Meteor.user(),
    users: Meteor.users.find({username: {$regex: new RegExp(search)}}, {sort: { 'profile.score': -1 }}).fetch(),
  };
})(App);
