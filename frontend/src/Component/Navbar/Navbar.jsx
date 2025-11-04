import React from 'react';
import { Home, Search, Users, Briefcase, FileText } from 'lucide-react';
import logoimage from '../../assets/image.png';
import { Link } from 'react-router-dom';


const Navbar = () => {
    return (
        <div className="w-56 bg-white fixed h-full left-0 top-0 shadow-lg">
            {/* Logo Section */}
            <div className="p-3 pl-12 flex justify-start">
                <img src={logoimage} alt="Logo" className="w-28 h-28 object-contain" />
            </div>

            {/* Menu Items */}
            <nav className="px-4 space-y-2">
                <Link to="/dashboard" 
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Home className="w-5 h-5 mr-3" />
                    Dashboard
                </Link>

                <Link to="/search"
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Search className="w-5 h-5 mr-3" />
                    Search
                </Link>

                <Link to="/drivers"
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Users className="w-5 h-5 mr-3" />
                    My Drivers
                </Link>

                <Link to="/talent-hub"
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Briefcase className="w-5 h-5 mr-3" />
                    Talent Hub
                </Link>

               <Link to="/resources"
                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <FileText className="w-5 h-5 mr-3" />
                    Resources
                </Link>
            </nav>

            {/* Upgrade Card */}
            <div className="absolute bottom-8 left-4 right-4">
                <div className="bg-blue-600 rounded-lg p-4 text-white relative overflow-hidden">
                    {/* Decorative dots */}
                    <div className="absolute top-2 right-2 grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="w-1 h-1 bg-white rounded-full opacity-30"></div>
                        ))}
                    </div>

                    <h3 className="font-semibold text-sm mb-1">Upgrade your</h3>
                    <h3 className="font-semibold text-sm mb-3">Account to Pro</h3>

                    <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">
                        Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;