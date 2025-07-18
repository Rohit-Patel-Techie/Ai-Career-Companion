import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import { Toaster } from "react-hot-toast";
import "./index.css";

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
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>

    </>
  );
}

export default App;