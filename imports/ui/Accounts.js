import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base';

const logoUrl = "https://images.squarespace-cdn.com/content/v1/5b54239650a54fc2b95cc3a6/1561395156714-BPNJTTOFOK39XP7HKN8Y/ke17ZwdGBToddI8pDm48kMBe37n5uHjw923-ICrDLRYUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcZGylpbuh_3TpKhuPz_XlC0okPVCbmoF88VrYcEFo9yF0JmtxfiR3BQO1cm4-mGSR/Bitb2019logo.png?format=750w";

export default class AccountsUI extends Component {

  constructor(props) {
    super(props);

    this.state = {
      register: false,
      login: false,
    }
  }

  renderLogin() {
    return (
      <div className="row">

        <form className="col s12" style={{ display: this.state.login ? 'block' : 'none' }}>

          <div className="row">
            <input placeholder="Username" ref="username" className="validate" required></input>
            <label htmlFor="username">Username or Email</label>
          </div>

          <div className="row">
            <input type="password" placeholder="Password" ref="password" className="validate"></input>
            <label htmlFor="password">Password</label>
          </div>

          <div className="row" onClick={this.login.bind(this)}>
            <a className="waves-effect waves-light btn purple">Login</a>
          </div>

        </form>

      </div>
    )
  }

  login() {
    const user = ReactDOM.findDOMNode(this.refs.username).value;
    const password = ReactDOM.findDOMNode(this.refs.password).value;
    return Meteor.loginWithPassword(user, password, (err) => { if (err) alert("Incorrect username or password!") });
  }

  toggleLogin() {
    this.setState({ login: !this.state.login });
    this.setState({ register: false });
  }

  renderLogout() {
    return (
      <nav>
        <div className="nav-wrapper purple">
          <a href="#" className="brand-logo right"><img style={{height: '64px'}} src={logoUrl}/></a>
          <ul id="nav-mobile" className="left">
            <li><a onClick={this.logout.bind(this)}>Logout</a></li>
          </ul>
        </div>
      </nav>
    )
  }

  logout() {
    return Meteor.logout();
  }

  toggleRegistration() {
    this.setState({ register: !this.state.register });
    this.setState({ login: false });
  }

  renderRegistration() {
    return (
      <div className="row">

        <form className="col s12" style={{ display: this.state.register ? 'block' : 'none' }}>

          <div className="row">
            <input placeholder="Full Name (must match your ID!)" ref="full_name" className="validate" required></input>
            <label htmlFor="full_name">Full Name (must match your ID!)</label>
          </div>

          <div className="row">
            <input placeholder="Username" ref="reg_username" className="validate" required></input>
            <label htmlFor="reg_username">Username</label>
          </div>

          <div className="row">
            <input placeholder="Email" ref="email" className="validate" required></input>
            <label htmlFor="email">Email</label>
          </div>

          <div className="row">
            <input placeholder="Social Media Link" ref="social_media" className="validate" required></input>
            <label htmlFor="social_media">Social Media Link</label>
          </div>

          <div className="row">
            <input placeholder="Ethereum Address" ref="ethereum" className="validate"></input>
            <label htmlFor="etherum">Ethereum Address</label>
          </div>

          <div className="row">
            <input placeholder="Short Bio" ref="bio" className="validate" required></input>
            <label htmlFor="bio">Short Bio</label>
          </div>

          <div className="row">
            <input type="password" placeholder="Password" ref="reg_password" className="validate"></input>
            <label htmlFor="reg_password">Password</label>
          </div>

          <div className="row">
            <input type="password" placeholder="Password Confirmation" ref="reg_password_confirm" className="validate"></input>
            <label htmlFor="reg_password_confirm">Password Confirmation</label>
          </div>

          <div className="row" onClick={this.register.bind(this)}>
            <a className="waves-effect waves-light btn purple">Create Account!</a>
          </div>

        </form>

      </div>
    )
  }

  register() {
    const user = {
      username: ReactDOM.findDOMNode(this.refs.reg_username).value,
      email: ReactDOM.findDOMNode(this.refs.email).value,
      password: ReactDOM.findDOMNode(this.refs.reg_password).value,
      profile: {
        name: ReactDOM.findDOMNode(this.refs.full_name).value,
        bio: ReactDOM.findDOMNode(this.refs.bio).value,
        social_media: ReactDOM.findDOMNode(this.refs.social_media).value,
        ethereum: ReactDOM.findDOMNode(this.refs.ethereum).value,
        score: 0,
      }
    }

    if (user.password !== ReactDOM.findDOMNode(this.refs.reg_password_confirm).value) {
      return alert("Passwords do not match!")
    }

    return Accounts.createUser(user, (err) => { if (err) alert(err) });
  }

  render() {
    return (
      <div>
        {!this.props.currentUser && (
          <nav>
            <div className="nav-wrapper purple">
              <a href="#" className="brand-logo right"><img style={{height: '64px'}} src={logoUrl}/></a>
              <ul id="nav-mobile" className="left">
                <li><a onClick={this.toggleRegistration.bind(this)}>Register</a></li>
                <li><a onClick={this.toggleLogin.bind(this)}>Login</a></li>
              </ul>
            </div>
          </nav>
        )}
        {!this.props.currentUser && this.renderRegistration()}
        {!this.props.currentUser && this.renderLogin()}
        {this.props.currentUser && this.renderLogout()}
      </div>
    );
  }
}
