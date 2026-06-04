// src/pages/SecretVault.tsx
// Página de dominio oculto para subir y listar archivos comprimidos con contexto de tareas.
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"; // Hooks y tipos para formularios
import { useNavigate } from "react-router-dom"; // Hook de navegación
import { authApi } from "../api/auth.api"; // API de autenticación
import { uploadApi } from "../api/uploads.api"; // API de subidas
import type { UploadItem } from "../api/types"; // Tipo de elemento subido

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`; // Tamaño en bytes
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`; // Tamaño en KB
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`; // Tamaño en MB
}

export default function SecretVault() {
  const navigate = useNavigate(); // Hook para redirigir
  const [uploads, setUploads] = useState<UploadItem[]>([]); // Lista de archivos subidos
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Archivo seleccionado
  const [description, setDescription] = useState(""); // Descripción del archivo
  const [error, setError] = useState<string | null>(null); // Mensaje de error
  const [submitting, setSubmitting] = useState(false); // Indicador de envío

  const loadUploads = async () => {
    try {
      const result = await uploadApi.list(); // Carga archivos desde la API
      setUploads(result);
    } catch (err: any) {
      setError(err.message || "No se pudieron cargar los trabajos.");
    }
  };

  useEffect(() => {
    loadUploads(); // Carga los archivos al montar el componente
  }, []);

  const handleLogout = () => {
    authApi.logout(); // Cierra sesión
    navigate("/login"); // Redirige a login
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Evita recarga de página
    setError(null); // Limpia error anterior

    if (!selectedFile) {
      setError("Selecciona un archivo ZIP o RAR antes de subir.");
      return;
    }

    const name = selectedFile.name.toLowerCase();
    if (!name.endsWith(".zip") && !name.endsWith(".rar")) {
      setError("Solo se permiten archivos .zip y .rar.");
      return;
    }

    setSubmitting(true); // Activa el estado de envío
    try {
      await uploadApi.create(selectedFile, description.trim()); // Envía el archivo y la descripción
      setSelectedFile(null); // Resetea selector
      setDescription(""); // Limpia descripción
      await loadUploads(); // Recarga la lista de archivos
    } catch (err: any) {
      setError(err.message || "Error al subir el archivo.");
    } finally {
      setSubmitting(false); // Desactiva el estado de envío
    }
  };

  return (
    <>
      <style>{`
        .vault-shell { min-height:100vh; background:radial-gradient(circle at top left, rgba(255,215,0,0.12), transparent 25%), linear-gradient(180deg, #0b0b0d 0%, #090708 100%); color: var(--text); }
        .vault-header { display:flex; justify-content:space-between; align-items:center; padding:1.25rem 2rem; border-bottom:1px solid var(--border); background:rgba(0,0,0,0.3); position:sticky; top:0; z-index:10; backdrop-filter:blur(10px); }
        .vault-title { font-family:"Cinzel",serif; font-size:1.35rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--gold); }
        .vault-actions { display:flex; gap:0.75rem; }
        .vault-btn { font-family:"Cinzel",serif; font-size:0.75rem; text-transform:uppercase; padding:0.55rem 1rem; border:1px solid var(--border); background:transparent; color:var(--text-dim); cursor:pointer; transition:all 0.18s ease; }
        .vault-btn:hover { border-color:var(--gold); color:var(--gold); }
        .vault-content { max-width:1000px; margin:0 auto; padding:2rem; }
        .vault-card { background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:1.75rem; margin-bottom:1.75rem; }
        .vault-card h2 { font-family:"Cinzel",serif; font-size:1.5rem; margin-bottom:0.75rem; }
        .vault-card p { color:var(--text-dim); line-height:1.7; }
        .vault-form { display:grid; gap:1rem; }
        .vault-label { display:block; font-family:"Cinzel",serif; font-size:0.75rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.4rem; }
        .vault-input, .vault-textarea { width:100%; border:1px solid var(--border); background:var(--bg); color:var(--text); padding:0.85rem 1rem; border-radius:8px; font-family:"Crimson Text",serif; font-size:1rem; }
        .vault-textarea { min-height:120px; resize:vertical; }
        .vault-actions-row { display:flex; flex-wrap:wrap; gap:1rem; justify-content:flex-end; margin-top:0.75rem; }
        .vault-submit { background:var(--gold); color:var(--bg); border:none; border-radius:8px; padding:0.85rem 1.2rem; cursor:pointer; transition:background 0.18s ease; }
        .vault-submit:disabled { opacity:0.6; cursor:not-allowed; }
        .vault-list { display:grid; gap:1rem; }
        .vault-item { background:rgba(255,255,255,0.02); border:1px solid var(--border); border-radius:14px; padding:1.5rem; display:grid; gap:0.75rem; }
        .vault-item-header { display:flex; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; }
        .vault-item-name { font-size:1rem; font-weight:700; color:var(--text); }
        .vault-item-meta { color:var(--text-muted); font-size:0.9rem; }
        .vault-item-desc { color:var(--text-dim); line-height:1.6; }
        .vault-item-actions { display:flex; flex-wrap:wrap; gap:0.75rem; align-items:center; }
        .vault-link { color:var(--gold); text-decoration:none; font-weight:600; }
        .vault-error { color: var(--red-bright); font-size:0.95rem; }
      `}</style>

      <div className="vault-shell">
        <header className="vault-header">
          <div>
            <div className="vault-title">Dominio Oculto</div>
            <div style={{ color: "var(--text-dim)", fontSize: "0.9rem", marginTop: "0.35rem" }}>
              Zona secreta para subir trabajos comprimidos y compartir contextos de tareas repetidas.
            </div>
          </div>
          <div className="vault-actions">
            <button className="vault-btn" onClick={() => navigate("/dashboard")}>Volver</button>
            <button className="vault-btn" onClick={handleLogout}>Salir</button>
          </div>
        </header>

        <main className="vault-content">
          <section className="vault-card">
            <h2>Sube trabajos de profesores</h2>
            <p>
              Aquí puedes almacenar archivos en formato <strong>ZIP</strong> o <strong>RAR</strong> con trabajos que se repiten cada semestre.
              Al subir un archivo, se guardará su nombre y la descripción que añadas para que otros usuarios recuerden el contexto.
            </p>
            <form className="vault-form" onSubmit={handleSubmit}>
              <div>
                <label className="vault-label">Archivo ZIP/RAR</label>
                <input
                  className="vault-input"
                  type="file"
                  accept=".zip,.rar"
                  onChange={(event: ChangeEvent<HTMLInputElement>) =>
                    setSelectedFile(event.target.files?.[0] ?? null)
                  }
                />
              </div>

              <div>
                <label className="vault-label">Descripción</label>
                <textarea
                  className="vault-textarea"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Añade una breve descripción del trabajo: materia, semestre, tipo de entrega, observaciones..."
                  maxLength={220}
                />
              </div>

              {error && <div className="vault-error">{error}</div>}

              <div className="vault-actions-row">
                <button type="submit" className="vault-submit" disabled={submitting}>
                  {submitting ? "Subiendo..." : "Guardar trabajo"}
                </button>
              </div>
            </form>
          </section>

          <section className="vault-card">
            <h2>Trabajos subidos</h2>
            {uploads.length === 0 ? (
              <p style={{ color: "var(--text-dim)" }}>Todavía no hay trabajos en este dominio oculto.</p>
            ) : (
              <div className="vault-list">
                {uploads.map((item) => (
                  <article key={item.id} className="vault-item">
                    <div className="vault-item-header">
                      <div className="vault-item-name">{item.originalName}</div>
                      <div className="vault-item-meta">{formatSize(item.size)} · {new Date(item.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="vault-item-desc">{item.description}</div>
                    <div className="vault-item-actions">
                      <a className="vault-link" href={item.fileUrl} download={item.originalName}>
                        Descargar archivo
                      </a>
                      <span className="vault-item-meta">Tipo: {item.originalName.toLowerCase().endsWith(".zip") ? "ZIP" : "RAR"}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
