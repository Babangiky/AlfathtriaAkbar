import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

function App() {
  return (
    <>
      <SmoothCursor />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
