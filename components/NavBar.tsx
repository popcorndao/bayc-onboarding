import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className='navbar'>
      <div className="flex-row nav-bar-container">
        <img src="images/textLogo.png" alt="popLogo" className="h-8 xl:h-12 2xl:h-18"/>
        <p className="text-xl mx-4 md:mx-8 mt-3">X</p>
        <img src="images/BAYC.svg" alt="baycLogo" className="h-8 xl:h-12 2xl:h-18 mt-2"/>
      </div>
    </nav>
  );
};
export default Navbar;
