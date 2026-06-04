// Carga variables de entorno desde el archivo .env usando dotenv
import "dotenv/config";

// Importa la aplicación Express configurada en src/app.js
import app from "./src/app.js";

// Configura el puerto del servidor, usa la variable de entorno PORT si está definida
const PORT = process.env.PORT || 3000;

// Inicia el servidor y escucha en el puerto definido
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Mensaje en consola indicando que el servidor está activo
});

