import React from "react";
import logo from "../../assets/KicpaaLogo.png";
import avartat from "../../assets/image/avarta.png";
import { NavLink } from "react-router-dom";

const Header = () => {
  const navLinkClass = ({ isActive }) =>
    `poppins text-md font-semibold transition-colors duration-300 ${
      isActive ? "text-blue-700" : "text-blue-950 hover:text-blue-700"
    }`;

  return (
    <>
      <header className="bg-white shadow-md py-2 w-[95%] m-auto rounded-xl mt-3 px-6 flex items-center justify-between">
        <div className="poppins">
          <img className=" h-20" src={logo} alt="Logo" />
        </div>
        {/* Navbar */}

        <div>
          <nav className="flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Template
            </NavLink>
            
            <NavLink to="/themelist" className={navLinkClass}>
              Theme
            </NavLink>

            <NavLink to="/previewpage" className={navLinkClass}>
              Preview
            </NavLink>
          </nav>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <img
              className="h-18 w-18 rounded-full"
              src={avartat}
              alt="Avatar"
            />
            <div>
              <span className="poppins text-blue-950 font-bold">
                KICPAA ADMIN
              </span>
              <br />
              <span className="poppins font-medium text-blue-950">IT TEAM</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
