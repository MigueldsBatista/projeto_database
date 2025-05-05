import React from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../NavBar';

const ConditionalNavBar = () => {
  const location = useLocation();
  
  // List of paths where the NavBar should be hidden
  const hideNavBarPaths = ['/', '/register'];
  
  // Check if the current path is in the hideNavBarPaths list
  const shouldShowNavBar = !hideNavBarPaths.includes(location.pathname);
  
  // Only render NavBar if not on login or register pages
  return shouldShowNavBar ? <NavBar /> : null;
};

export default ConditionalNavBar;