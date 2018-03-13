import React, { Component } from 'react';

import './App.css';
import Auth from './components/Auth/Signup/Signup';
import Login from './components/Auth/Login/Login'
// import Logout from './components/Auth/Logout/Logout'
import ChatView from './components/Chat/ChatView/ChatView';

import { Route, Switch } from 'react-router-dom';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route path="/register" component={Auth} />
          <Route path="/login"  component={Login} />
          <Route path="/" exact component={ChatView} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;