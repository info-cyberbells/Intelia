import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Component/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Register from "./pages/register/Register";
import Dashboard from "./pages/AdminDashboard/Dashboard";
import Drivers from "./pages/Drivers/Drivers";
// import Search from "./pages/Search/Search";
import TalentHub from "./pages/TalentHub/TalentHub";
import OwnerJobs from "./pages/OwnerJobs/OwnerJobs";
import Resources from "./pages/Resources/Resources";
import Activity from "./pages/Activity/Activity";
import DetailPage from "./pages/DetailPage/DetailPage";
import SearchDriverRecords from "./pages/SearchDriverRecords/SearchDriverRecords";
import DriverDashboard from "./pages/DriverDashboard/DriverDashboard";
import MyProfile from "./pages/MyProfile/MyProfile";
import Settings from "./pages/Settings/Settings";
import DriverJobs from "./pages/DriverJobs/DriverJobs";
import NotificationPages from "./pages/NotificationPage/NotificationPage";
import OwnerNotificationFullPage from "./pages/NotificationPage/OwnerNotificationFullPage";
import AiResume from "./pages/AIResume/AiResume";
import SuperadminDasboard from './pages/SuperAdmin/SuperAdminDashboard/Superadmindashboard';
import ManageDrivers from './pages/SuperAdmin/ManageDrivers/ManageDrivers';
import ManageOwners from './pages/SuperAdmin/ManageOwners/ManageOwner';
import ManageJobs from './pages/SuperAdmin/ManageJobs/ManageJobs';
import MyApplications from './pages/MyApplications/MyApplications';
import AddDriver from './pages/Model/AddDriver/AddDriver';
import AddOwner from './pages/Model/AddOwner/AddOwner';
import DriverReviews from './pages/DriverReviews/DriverReviews';
import DriverReviewByOwnerside from './pages/DriverReviews/DriverReviewByOwnerside';
import AddDriverReview from './pages/DriverReviews/AddDriverReview';
import MyReviews from "./pages/MyReviews/MyReviews";
import MyVehicle from "./pages/MyVehicle/MyVehicle";
import AddJobManually from "./pages/AddJobManually/AddJobManually";


function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    setToken(storedToken);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserRole(user?.role);
    }

    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      const newUser = localStorage.getItem("user");

      setToken(newToken);
      if (newUser) {
        const user = JSON.parse(newUser);
        setUserRole(user?.role);
      } else {
        setUserRole(null);
      }
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
            !token ? (
              <Login />
            ) : userRole === "superAdmin" ? (
              <Navigate to="/dashboard" replace />
            ) : userRole === "owner" ? (
              <Navigate to="/admin-dashboard" replace />
            ) : userRole === "driver" ? (
              <Navigate to="/driver-dashboard" replace />
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
            {/* <Route path="/search" element={<Search />} /> */}
            <Route path="/talent-hub" element={<TalentHub />} />
              <Route path="/owner-jobs" element={<OwnerJobs />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/detail-page" element={<DetailPage />} />
            <Route path="/search-driver-records" element={<SearchDriverRecords />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/driver-jobs" element={<DriverJobs />} />
            <Route path="/notifications" element={<NotificationPages />} />
            <Route path="/all-notifications" element={<OwnerNotificationFullPage />} />
            <Route path="/ai-resumes" element={<AiResume />} />
            <Route path="/manage-drivers" element={<ManageDrivers />} />
            <Route path="/manage-owners" element={<ManageOwners />} />
            <Route path="/manage-jobs" element={<ManageJobs />} />
            <Route path="/add-driver" element={<AddDriver />} />
            <Route path="/edit-driver/:id" element={<AddDriver />} />
            <Route path="/add-owner" element={<AddOwner />} />
            <Route path="/edit-owner/:id" element={<AddOwner />} />
            <Route path="/driver-reviews" element={<DriverReviews />} />
            <Route path="/view-rating/:id" element={<DriverReviews />} />
            <Route path="/view-review/:id" element={<DriverReviewByOwnerside />} />
            <Route path="/add-review/:id" element={<AddDriverReview />} />
            <Route path="/my-reviews" element={<MyReviews />} />
            <Route path="/my-vehicle" element={<MyVehicle />} />
            <Route path="/add-job-manually" element={<AddJobManually />} />
            <Route path="/edit-job-manually/:jobId?" element={<AddJobManually />} />
            


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
