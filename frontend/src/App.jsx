import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Component/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Register from "./pages/register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
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
              localStorage.getItem("role") === "driver" ? (
                <Navigate to="/driver-dashboard" replace />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            ) : (
              <Login />
            )
          }
        />

        <Route path="/register" element={<Register />} />
        {token ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
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
