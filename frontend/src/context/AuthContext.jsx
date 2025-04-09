import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  const decodeJWT = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.exp) return true;

    const expirationTime = decodedToken.exp * 1000;
    const now = Date.now();

    return now >= expirationTime;
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        localStorage.removeItem('token');
        setAuthState({
          token: null,
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
      } else {
        const decodedToken = decodeJWT(storedToken);
        if (decodedToken) {
          setAuthState({
            token: storedToken,
            isAuthenticated: true,
            isLoading: false,
            user: decodedToken,
          });
        } else {
          setAuthState({
            token: null,
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
        }
      }
    } else {
      setAuthState({
        token: null,
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
    setAuthState(prevState => ({ ...prevState, isLoading: false }));
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    const decodedToken = decodeJWT(token);
    setAuthState({
      token: token,
      isAuthenticated: true,
      isLoading: false,
      user: decodedToken,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      token: null,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
  };

  const contextValue = {
    authState,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {authState.isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
