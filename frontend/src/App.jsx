import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/search" element={<Search />} />
        <Route path="/talent-hub" element={<TalentHub />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/detail-page" element={<DetailPage />} />
        <Route path="/search-driver-records" element={<SearchDriverRecords />} />

      </Routes>
    </Router>
  );
}

export default App;
