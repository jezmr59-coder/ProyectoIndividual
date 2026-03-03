import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ClassDetail from "./pages/ClassDetail";
import ProfessorProfile from "./pages/ProfessorProfile";
import { getToken } from "./api/client";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return getToken() ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/classes/:id" element={<ClassDetail />} />
        <Route path="/professors/:id" element={<ProfessorProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
