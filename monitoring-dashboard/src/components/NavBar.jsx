import React from "react";

const Navbar = () => {
  return (
    <div className="navbar flex justify-between items-center bg-brown-50/10 shadow-2xl p-4 h-12 rounded-xl font-serif">
      <div className="logo">
        <img
          src="/src/assets/logo2.png"
          alt="Logo"
          className="h-10 rounded-xl"
        />
      </div>
      <div className="nav-links flex items-center space-x-4">
        <a
          href="#"
          className="text-blue-500 cursor-cell hover:text-blue-900"
          onClick={() => alert("Check Back Later!")}
        >
          Support
        </a>
        <div className="language-select">
          <select className="  text-blue-500 hover:text-blue-900 cursor-cell">
            <option value="" disabled selected>
              Admin
            </option>
            <option value="/settings">Settings</option>
            <option value="/profile">Profile</option>
            {/* Add more options here */}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
