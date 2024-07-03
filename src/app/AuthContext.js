'use client';
import { useState } from "react";
import { createContext } from "react";

const AuthContext = createContext();

//https://www.telerik.com/blogs/react-basics-how-when-use-react-context
// modified to store only access tokens
const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
  
    const value = {
      token,
      setToken,
    };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };
  
  export { AuthContext, AuthProvider };