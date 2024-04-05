import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Register from './components/Register';
import Login from './components/Login';
import Account from './components/Account';
import Browse from './components/Browse';

const App = () => {
  // Logged in if userId is stored in localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('userId') ? true : false);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

  useEffect(() => {
    // Syncing isLoggedIn state with localStorage
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
          <Route path="/register" render={(props) => isLoggedIn ? <Redirect to="/" /> : <Register {...props} onSignUp={handleSignUp} />} />
          <Route path="/login" render={(props) => isLoggedIn ? <Redirect to="/" /> : <Login {...props} onLogin={handleLogin} />} />
          <Route path="/account" render={(props) => isLoggedIn ? <Account {...props} userId={userId} onLogout={handleLogout} /> : <Redirect to="/login" />} />
          <Route path="/browse" component={Browse} />
          {/* Redirect to Home if no match */}
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;