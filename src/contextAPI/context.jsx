
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create Context
const UserContext = createContext();

// Custom Hook to use UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// Provider Component
export const UserProvider = ({ children }) => {
  const [email, setEmail] = useState(null);
  const [role,setRole] = useState('CUSTOMER')
  // Initialize email state from localStorage if it's available
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []); // This runs once when the component mounts
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []); 
  const login = (email) => {
    setEmail(email);
    localStorage.setItem('email', email); // Store email in localStorage
  };
  const log =(role)=>{
    setRole(role)
    localStorage.setItem('role',role)
  }
  const logo=()=>{
    setRole('CUSTOMER')
    localStorage.removeItem('role');
  }
  const logout = () => {
    setEmail(null);
    localStorage.removeItem('email'); // Remove email from localStorage
  };

  return (
    <UserContext.Provider value={{ email, login, logout,role,log,logo }}>
      {children}
    </UserContext.Provider>
  );
};
