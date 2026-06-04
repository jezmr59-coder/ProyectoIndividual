import { StrictMode } from 'react' // Importa StrictMode para activar comprobaciones adicionales en React
import { createRoot } from 'react-dom/client' // Importa createRoot para renderizar la aplicación en React 18
import './index.css' // Importa los estilos globales
import App from './App.tsx' // Importa el componente raíz de la aplicación

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
