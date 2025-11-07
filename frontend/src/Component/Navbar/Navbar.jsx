import React from 'react';
import TopBar from '../TopBar/TopBar';
import MenuItems from '../MenuItems/MenuItems';


const Navbar = () => {
    return (
        <div className="flex">
            <div className="w-56 bg-white fixed h-full left-0 top-0 ">
                <MenuItems />
            </div>
            <div className="w-full ml-56 ">
                <TopBar />
            </div>
        </div>
    );
};

export default Navbar;