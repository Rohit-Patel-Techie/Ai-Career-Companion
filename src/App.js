import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HeroSection from "./components/HeroSection";
import HomePage from "./pages/HomePage";
import "./index.css";

function App() {
    return (
    <Router>
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/HomePage" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
