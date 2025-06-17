// src/components/Layout.jsx
import React from 'react';
import Navbar from './navbar.jsx';
import Footer from './Footer.jsx';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;