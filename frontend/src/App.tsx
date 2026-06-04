import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Importa el router y componentes de rutas
import Login from "./pages/Login"; // Importa página de login
import Register from "./pages/Register"; // Importa página de registro
import Dashboard from "./pages/Dashboard"; // Importa página principal
import ClassDetail from "./pages/ClassDetail"; // Importa vista de detalle de clase
import ProfessorProfile from "./pages/ProfessorProfile"; // Importa perfil de profesor
import SecretVault from "./pages/SecretVault"; // Importa dominio oculto
import { getToken } from "./api/client"; // Importa función para obtener token

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return getToken() ? <>{children}</> : <Navigate to="/login" replace />; // Protege rutas, redirige si no hay token
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
        <Route path="/dominio-oculto" element={<PrivateRoute><SecretVault /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App; // Exporta el componente principal
