import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './Navbar'; // Assuming Navbar.js is in the same directory as App.js
import Home from './Home';
import About from './About';
import Register from './Register';
import Login from './Login';
import Account from './Account';
import Browse from './Browse';
import SuccessfulMessage from './SuccessfulMessage'; // Make sure all these files are directly under src/components

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('userId') ? true : false);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

  useEffect(() => {
    // Sync isLoggedIn state with localStorage
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      localStorage.removeItem('isLoggedIn');
    }
  }, [isLoggedIn]);

  const handleLogin = (userIdParam) => {
    setIsLoggedIn(true);
    setUserId(userIdParam);
    localStorage.setItem('userId', userIdParam);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId('');
    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');
  };

  const handleSignUp = (userIdParam) => {
    setIsLoggedIn(true);
    setUserId(userIdParam);
    localStorage.setItem('userId', userIdParam);
  };

  return (
    <Router>
      <div className="app">
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/register" render={(props) => isLoggedIn ? <Redirect to="/successful-message" /> : <Register {...props} onSignUp={handleSignUp} />} />
          <Route path="/login" render={(props) => isLoggedIn ? <Redirect to="/successful-message" /> : <Login {...props} onLogin={handleLogin} />} />
          <Route path="/account" render={(props) => isLoggedIn ? <Account {...props} userId={userId} onLogout={handleLogout} /> : <Redirect to="/login" />} />
          <Route path="/browse" component={Browse} />
          <Route path="/successful-message" render={(props) => isLoggedIn ? <SuccessfulMessage {...props} /> : <Redirect to="/" />} />
          {/* Redirect to Home if no match */}
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;