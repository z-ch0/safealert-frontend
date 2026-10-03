import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Contacts from "./pages/Contacts";
import Videos from "./pages/Videos";
import EmergencyCard from "./pages/EmergencyCard";
// inside <Routes>:
<Route path="/emergency-card" element={<EmergencyCard />} />

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/emergency-card" element={<EmergencyCard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}