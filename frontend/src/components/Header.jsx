import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authState } = useAuth();

  console.log(authState)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-900 text-white py-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap md:flex-nowrap justify-between items-center px-4">
        <div className="flex justify-between items-center w-full md:w-auto">
          <Link to="/" className="logo text-xl md:text-2xl font-bold ml-2">Noted.</Link>

          <button onClick={toggleMenu} className="mobile-menu-button focus:outline-none md:hidden">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav className={`nav-links w-full md:w-auto md:flex md:items-center ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col items-center md:flex-row md:space-x-4 text-center mt-2 md:mt-0">
            {authState.isAuthenticated ? (
              <li><Link to="/admin/dashboard" className="block py-2 px-4 hover:bg-gray-800 rounded">Dashboard</Link></li>
            ) : (
              <>
                <li><Link to="/report" className="block py-2 px-4 hover:bg-gray-800 rounded">Report Incident</Link></li>
                <li><Link to="/signin" className="block py-2 px-4 hover:bg-gray-800 rounded">Admin Login</Link></li>
                <li><Link to="/track" className="block py-2 px-4 hover:bg-gray-800 rounded">Track Report</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
