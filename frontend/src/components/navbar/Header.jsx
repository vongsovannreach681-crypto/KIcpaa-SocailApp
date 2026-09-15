import React, { useState } from "react";
import logo from "../../assets/KicpaaLogo.png";
import avartat from "../../assets/image/avarta.png";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `poppins text-md font-semibold transition-colors duration-300 ${
      isActive ? "text-blue-700" : "text-blue-950 hover:text-blue-700"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `poppins text-md font-semibold transition-colors duration-300 block px-4 py-3 rounded-md ${
      isActive ? "text-blue-700 bg-blue-50" : "text-blue-950 hover:bg-gray-100"
    }`;

  return (
    <>
      <header className="bg-white shadow-md py-2 w-[95%] m-auto rounded-xl mt-3 px-6 flex items-center justify-between">
        <div className="poppins">
          <img className="h-14 md:h-20" src={logo} alt="Logo" />
        </div>

        {/* Desktop Navbar */}
        <div className="hidden md:block">
          <nav className="flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Template
            </NavLink>

            <NavLink to="/themelist" className={navLinkClass}>
              Theme
            </NavLink>

            <NavLink to="/setting" className={navLinkClass}>
              Setting
            </NavLink>

            <NavLink to="/previewpage" className={navLinkClass}>
              Preview
            </NavLink>
          </nav>
        </div>

        {/* Desktop Avatar */}
        <NavLink to="/setting" className="hidden md:block">
          <div className="hover:border-1 hover:border-blue-950 cursor-pointer pr-3 hover:bg-gray-200 rounded-xl">
            <div className="flex items-center gap-2">
              <img
                className="h-18 w-18 rounded-full"
                src={avartat}
                alt="Avatar"
              />
              <div>
                <span className="poppins text-blue-950 font-bold">
                  KICPAA TEAM
                </span>
                <br />
                <span className="poppins font-medium text-blue-950">
                  IT TEAM
                </span>
              </div>
            </div>
          </div>
        </NavLink>

        {/* Burger button — small devices only */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="md:hidden text-blue-950 text-2xl px-2"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <i className={`fa-solid ${isMenuOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      </header>

      {/* Mobile dropdown menu */}
      {isMenuOpen && (
        <div className="md:hidden w-[95%] m-auto bg-white shadow-md rounded-xl mt-2 px-2 py-3">
          <nav className="flex flex-col">
            <NavLink
              to="/"
              end
              className={mobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Template
            </NavLink>

            <NavLink
              to="/themelist"
              className={mobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Theme
            </NavLink>

            <NavLink
              to="/setting"
              className={mobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Setting
            </NavLink>

            <NavLink
              to="/previewpage"
              className={mobileNavLinkClass}
              onClick={() => setIsMenuOpen(false)}
            >
              Preview
            </NavLink>
          </nav>

          <NavLink
            to="/setting"
            onClick={() => setIsMenuOpen(false)}
            className="block mt-2 pt-3 border-t border-gray-100"
          >
            <div className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer">
              <img
                className="h-12 w-12 rounded-full"
                src={avartat}
                alt="Avatar"
              />
              <div>
                <span className="poppins text-blue-950 font-bold block">
                  KICPAA TEAM
                </span>
                <span className="poppins font-medium text-blue-950 text-sm">
                  IT TEAM
                </span>
              </div>
            </div>
          </NavLink>
        </div>
      )}
    </>
  );
};

export default Header;