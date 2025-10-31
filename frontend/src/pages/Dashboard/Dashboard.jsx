import React from "react";
import Dashboardimg from '../../../public/Dashboard.jpg'

const Dashboard = () => {
    return (
        <div className="relative lg:ml-60 min-h-screen w-full">
            <img
                src={Dashboardimg}
                alt="Dashboard"
                className="w-full h-full object-cover"
            />
        </div>
    );
};

export default Dashboard;
