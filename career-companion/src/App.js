import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import "./index.css";
import RoadmapGenerate from "./pages/RoadmapGenerate";
import RoadmapDetail from "./pages/RoadmapDetail";

// Simple auth guard for routes
function isTokenValid(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')));
    if (!payload || !payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (e) {
    return false;
  }
}

function RequireAuth({ children }) {
  const token = localStorage.getItem('access_token');
  if (!token || !isTokenValid(token)) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '	#1fd655',
            color: '#fff',
          },
          success: {
            icon: '✔',
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/roadmap" element={<RequireAuth><RoadmapGenerate /></RequireAuth>} />
          <Route path="/roadmap/:id" element={<RequireAuth><RoadmapDetail /></RequireAuth>} />
        </Routes>
      </Router>

    </>
  );
}

export default App;