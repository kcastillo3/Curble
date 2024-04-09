import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './AuthContext'; // Ensure this path matches my AuthContext file location
import Header from './Header';
import Home from './Home';
import About from './About';
import Register from './Register';
import Login from './Login';
import Account from './Account';
import Browse from './Browse';
import SuccessfulMessage from './SuccessfulMessage';

const App = () => {
  return (
    <AuthProvider> {/* Wrap my app in the AuthProvider to make auth context available */}
      <Router>
        <div className="app">
          <Header />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/browse" component={Browse} />
            <Route path="/successful-message" component={SuccessfulMessage} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/account" component={Account} />
            {/* Redirect unauthenticated users from Account to Login */}
            <Redirect from="/account" to="/login" />
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;