'use client';
import { useState } from "react";
import { createContext } from "react";

const AuthContext = createContext();

//https://www.telerik.com/blogs/react-basics-how-when-use-react-context
// modified to store only access tokens
const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);

    var bp = require('/src/app/Path.js');

    const getUsername = async (fToken=0) => {
      if (fToken==0) {
        fToken = await refreshToken();
      } 
      
      
      const response = await fetch(bp.buildPath('api/getProfile'), {
          method: 'POST',
          headers: { "Content-Type": "application/json",
            "authorization": fToken,
          },

      });
      if (response.ok) {
        const data = await response.json();
        setUsername(data.res);
        return data.res;
      } else {
        return null;
      }
    }

    const refreshToken = async () => {

      const response = await fetch(bp.buildPath('api/refresh'), {
          method: 'POST',
          credentials: 'include',
          headers: { "Content-Type": "application/json"},
      });

      if (response.ok) {
          const data = await response.json();
          setToken(data.accessToken);
          return data.accessToken;
      } else {
          return null;
      }
  };

  
    const value = {
      token,
      setToken,
      refreshToken,
      username,
      setUsername,
      getUsername,
    };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  
  export { AuthContext, AuthProvider };