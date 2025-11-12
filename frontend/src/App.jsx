import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Component/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Register from "./pages/register/Register";
import Dashboard from "./pages/AdminDashboard/Dashboard";
import Drivers from "./pages/Drivers/Drivers";
import Search from "./pages/Search/Search";
import TalentHub from "./pages/TalentHub/TalentHub";
import Resources from "./pages/Resources/Resources";
import Activity from "./pages/Activity/Activity";
import DetailPage from "./pages/DetailPage/DetailPage";
import SearchDriverRecords from "./pages/SearchDriverRecords/SearchDriverRecords";
import DriverDashboard from "./pages/DriverDashboard/DriverDashboard";
import MyProfile from "./pages/MyProfile/MyProfile";
import Settings from "./pages/Settings/Settings";
import DriverJobs from "./pages/DriverJobs/DriverJobs";
import NotificationPages from "./pages/NotificationPage/NotificationPage";
import AiResume from "./pages/AIResume/AiResume";
import SuperadminDasboard from './pages/SuperAdmin/SuperAdminDashboard/Superadmindashboard';
import ManageDrivers from './pages/SuperAdmin/ManageDrivers/ManageDrivers';
import ManageOwners from './pages/SuperAdmin/ManageOwners/ManageOwner';
import ManageJobs from './pages/SuperAdmin/ManageJobs/ManageJobs';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      {token && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            token ? (
              localStorage.getItem("role") === "superAdmin" ? (
                <Navigate to="/dashboard" replace />
              ) : localStorage.getItem("role") === "owner" ? (
                <Navigate to="/admin-dashboard" replace />
              ) : localStorage.getItem("role") === "driver" ? (
                <Navigate to="/driver-dashboard" replace />
              ) : (
                <Login />
              )
            ) : (
              <Login />
            )
          }
        />


        <Route path="/register" element={<Register />} />
        {token ? (
          <>
            <Route path="/dashboard" element={<SuperadminDasboard />} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/driver-dashboard" element={<DriverDashboard />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/search" element={<Search />} />
            <Route path="/talent-hub" element={<TalentHub />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/detail-page" element={<DetailPage />} />
            <Route path="/search-driver-records" element={<SearchDriverRecords />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/driver-jobs" element={<DriverJobs />} />
            <Route path="/notifications" element={<NotificationPages />} />
            <Route path="/ai-resumes" element={<AiResume />} />
            <Route path="/manage-drivers" element={<ManageDrivers />} />
            <Route path="/manage-owners" element={<ManageOwners />} />
            <Route path="/manage-jobs" element={<ManageJobs />} />
          </>
        ) : (
          // If no token → redirect everything else to "/"
          <Route path="*" element={<Login />} />
        )}

      </Routes>
    </Router>
  );
}

export default App;
