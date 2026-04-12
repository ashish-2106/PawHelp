import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/about";
import Navbar from "./pages/Navbar";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthSync from "./AuthSync";

import ReportAnimal from "./pages/ReportAnimal";
import History from "./pages/History"; // 🔥 NEW IMPORT

import NgoDashboard from "./pages/NgoDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NgoApply from "./pages/NgoApply";
import NgoPending from "./pages/NgoPending";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      {/* 🌐 COMMON NAVBAR */}
      <AuthSync />
      <Navbar />

      <Routes>
        {/* 🌍 PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 👤 USER ROUTES */}
        <Route
          path="/report"
          element={
            <ProtectedRoute allowedRole="USER">
              <ReportAnimal />
            </ProtectedRoute>
          }
        />

        {/* 🔥 HISTORY PAGE (USER ONLY) */}
        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRole="USER">
              <History />
            </ProtectedRoute>
          }
        />

        {/* 🐾 NGO ROUTES */}
        <Route
          path="/ngo"
          element={
            <ProtectedRoute allowedRole="NGO">
              <NgoDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo-apply"
          element={
            <ProtectedRoute allowedRole="USER">
              <NgoApply />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ngo-pending"
          element={
            <ProtectedRoute allowedRole="NGO">
              <NgoPending />
            </ProtectedRoute>
          }
        />

        {/* 👨‍⚖️ ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;