// components/ProtectedLayout.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const isLoggedIn = () => {
  // Add real auth check here (e.g. token check)
  return !!localStorage.getItem('token');
};

function ProtectedLayout() {
  if (!isLoggedIn()) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default ProtectedLayout;
