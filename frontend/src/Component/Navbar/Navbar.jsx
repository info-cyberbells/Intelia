import React, { useState } from 'react';
import TopBar from '../TopBar/TopBar';
import MenuItems from '../MenuItems/MenuItems';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}


            <div className={`
                fixed h-full left-0 top-0 z-50 bg-white transform transition-transform duration-300
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:w-56
            `}>
                <MenuItems onClose={() => setIsMobileMenuOpen(false)} />
            </div>


            <div className="w-full lg:ml-56">
                <TopBar
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />
            </div>
        </>
    );
};

export default Navbar;