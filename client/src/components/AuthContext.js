import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isLoggedIn: !!localStorage.getItem('access_token'),
        userId: localStorage.getItem('userId'),
        username: localStorage.getItem('username'),
    });

    const login = async (credentials) => {
      try {
          const response = await axios.post('/login', credentials);
          // Assuming my backend sends the access token, user ID, and username correctly
          if (response.data.access_token) {
              // Confirm these paths are correct based on my actual API response structure
              const { access_token, user_id, username } = response.data;
  
              localStorage.setItem('access_token', access_token);
              // Using the optional chaining operator (?) to avoid errors if user_id or username are undefined
              localStorage.setItem('userId', user_id?.toString());
              localStorage.setItem('username', username);
  
              setAuthState({
                  isLoggedIn: true,
                  userId: user_id?.toString(), // Handles potential undefined values safely
                  username: username,
              });
          }
      } catch (error) {
          console.error("Login failed:", error.response ? error.response.data : error);
      }
  };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        setAuthState({
            isLoggedIn: false,
            userId: null,
            username: null,
        });
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};