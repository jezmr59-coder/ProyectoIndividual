// src/pages/Dashboard.tsx
// Página principal que muestra la lista de profesores, búsqueda y navegación al perfil.
import { useState, useEffect } from "react"; // Hook para estado y efectos
import { useNavigate } from "react-router-dom"; // Hook para navegar programáticamente
import { professorApi } from "../api/professor.api"; // API para profesores
import { authApi } from "../api/auth.api"; // API para autenticación
import type { Professor } from "../api/types"; // Tipo de profesor

function Flames({ value }: { value: number | null }) {
  if (value === null) return <span style={{ color: "var(--text-muted)" }}>—</span>; // Muestra guión si no hay valor
  return (
    <span title={`Dificultad ${value.toFixed(1)}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < Math.round(value) ? "var(--gold)" : "var(--text-muted)", fontSize: "0.75rem" }}>
          ◆
        </span>
      ))}
    </span>
  );
}

function Badge({ pct }: { pct: number | null }) {
  if (pct === null) return <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Sin reseñas</span>; // Muestra estado sin reseñas
  const good = pct >= 60; // Determina si el profesor es recomendado
  return (
    <span style={{ color: good ? "var(--green-bright)" : "var(--red-bright)", fontFamily: "'Cinzel',serif", fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {good ? "⚔ Recomendado" : "☠ Evitar"} <em style={{ fontStyle: "normal", opacity: 0.7 }}>{pct.toFixed(0)}%</em>
    </span>
  );
}

export default function Dashboard() {
  const navigate = useNavigate(); // Navega entre páginas
  const [professors, setProfessors] = useState<Professor[]>([]); // Lista de profesores
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState<string | null>(null); // Estado de error
  const [search, setSearch] = useState(""); // Término de búsqueda

  useEffect(() => {
    professorApi.getAll()
      .then(setProfessors) // Guarda los profesores en el estado
      .catch((e) => setError(e.message)) // Captura error de carga
      .finally(() => setLoading(false)); // Termina el estado de carga
  }, []); // Solo al montar el componente

  const filtered = professors.filter((p) => {
    if (!search) return true; // Si no hay búsqueda, muestra todos
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.department.toLowerCase().includes(q); // Filtra por nombre o departamento
  });

  const handleLogout = () => { authApi.logout(); navigate("/login"); }; // Cierra sesión y redirige

  return (
    <>
      <style>{`
        .dash-nav { border-bottom:1px solid var(--border); padding:0 2rem; display:flex; align-items:center; justify-content:space-between; height:64px; background:rgba(10,8,6,0.95); position:sticky; top:0; z-index:100; backdrop-filter:blur(8px); }
        .dash-brand { font-family:"Cinzel",serif; font-size:1.1rem; font-weight:900; letter-spacing:0.15em; color:var(--gold); text-transform:uppercase; }
        .dash-brand span { color:var(--text-dim); font-weight:400; }
        .dash-nav-actions { display:flex; gap:1rem; align-items:center; }
        .nav-btn { font-family:"Cinzel",serif; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; padding:0.45rem 1rem; border:1px solid var(--border); background:transparent; color:var(--text-dim); transition:all 0.2s; cursor:pointer; }
        .nav-btn:hover { border-color:var(--gold-dim); color:var(--gold); }
        .nav-btn.danger:hover { border-color:var(--red-bright); color:var(--red-bright); }
        .dash-secret { width:34px; height:34px; display:flex; align-items:center; justify-content:center; border:1px solid var(--border); border-radius:50%; background:transparent; color:var(--text-muted); font-size:1rem; cursor:pointer; transition:all 0.2s; opacity:0; pointer-events:none; }
        .dash-nav:hover .dash-secret { opacity:1; pointer-events:auto; }
        .dash-secret:hover { border-color:var(--gold-dim); color:var(--gold); background:rgba(255,215,0,0.08); }
        .dash-secret { width:34px; height:34px; display:flex; align-items:center; justify-content:center; border:1px solid var(--border); border-radius:50%; background:transparent; color:var(--text-muted); font-size:1rem; cursor:pointer; transition:all 0.2s; }
        .dash-secret:hover { border-color:var(--gold-dim); color:var(--gold); background:rgba(255,215,0,0.08); }

        .dash-hero { text-align:center; padding:3.5rem 2rem 2.5rem; border-bottom:1px solid var(--border); }
        .dash-hero-eyebrow { font-family:"Cinzel",serif; font-size:0.6rem; letter-spacing:0.3em; text-transform:uppercase; color:var(--gold-dim); margin-bottom:1rem; }
        .dash-hero-title { font-family:"Cinzel",serif; font-size:clamp(1.8rem,4vw,3rem); font-weight:900; color:var(--text); line-height:1.1; margin-bottom:0.75rem; }
        .dash-hero-title em { color:var(--gold); font-style:normal; }
        .dash-hero-sub { color:var(--text-dim); font-style:italic; font-size:1.1rem; }

        .dash-filters { padding:1.25rem 2rem; border-bottom:1px solid var(--border); display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center; background:var(--surface); }
        .dash-search { flex:1; min-width:180px; background:var(--bg); border:1px solid var(--border); color:var(--text); font-family:"Crimson Text",serif; font-size:1rem; padding:0.55rem 0.9rem; outline:none; transition:border-color 0.2s; }
        .dash-search::placeholder { color:var(--text-muted); }
        .dash-search:focus { border-color:var(--gold-dim); }
        .dash-count { font-family:"Cinzel",serif; font-size:0.65rem; letter-spacing:0.1em; color:var(--text-muted); text-transform:uppercase; margin-left:auto; }

        .dash-content { max-width:1400px; margin:0 auto; padding:2rem; }
        .professors-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:1.5px; background:var(--border); border:1px solid var(--border); }

        .professor-card { background:var(--surface); padding:1.5rem; cursor:pointer; transition:background 0.15s; position:relative; overflow:hidden; }
        .professor-card::before { content:""; position:absolute; left:0; top:0; bottom:0; width:2px; background:var(--gold); transform:scaleY(0); transition:transform 0.2s; transform-origin:bottom; }
        .professor-card:hover { background:var(--surface2); }
        .professor-card:hover::before { transform:scaleY(1); }

        .pc-name { font-family:"Cinzel",serif; font-size:1.1rem; font-weight:600; color:var(--text); line-height:1.3; margin-bottom:0.2rem; }
        .pc-department { font-size:0.9rem; color:var(--gold); margin-bottom:1rem; font-style:italic; }
        .pc-description { font-size:0.85rem; color:var(--text-dim); margin-bottom:1.1rem; line-height:1.4; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .pc-stats { display:flex; flex-direction:column; gap:0.45rem; }
        .pc-stat-row { display:flex; align-items:center; justify-content:space-between; }
        .pc-stat-label { font-family:"Cinzel",serif; font-size:0.55rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-muted); }
        .pc-footer { margin-top:0.9rem; padding-top:0.9rem; border-top:1px solid var(--text-muted); display:flex; justify-content:space-between; align-items:center; }
        .pc-reviews { font-size:0.78rem; color:var(--text-muted); }
        .pc-arrow { font-family:"Cinzel",serif; font-size:0.58rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--text-muted); transition:color 0.15s; }
        .professor-card:hover .pc-arrow { color:var(--gold); }

        .state-box { text-align:center; padding:5rem 2rem; color:var(--text-dim); }
        .state-box h2 { font-family:"Cinzel",serif; font-size:1.1rem; color:var(--text-muted); margin-bottom:0.5rem; }
        .state-box p { font-style:italic; }
        .spinner { width:28px; height:28px; border:2px solid var(--border); border-top-color:var(--gold); border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 1rem; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <nav className="dash-nav">
        <div className="dash-brand">Tec<span>Souls</span></div>
        <div className="dash-nav-actions">
          <button className="dash-secret" onClick={() => navigate("/dominio-oculto")} title="Dominio oculto">🗃</button>
          <button className="nav-btn danger" onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      <div className="dash-hero">
        <p className="dash-hero-eyebrow">Sistema de calificacion</p>
        <h1 className="dash-hero-title">Conoce a tus <em>profesores</em></h1>
        <p className="dash-hero-sub">Descubre sus especialidades y lee las experiencias de otros estudiantes.</p>
      </div>

      <div className="dash-filters">
        <input className="dash-search" placeholder="Buscar profesor o departamento..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <span className="dash-count">{filtered.length} profesores</span>
      </div>

      <div className="dash-content">
        {loading ? (
          <div className="state-box">
            <div className="spinner"></div>
            <h2>Cargando profesores...</h2>
          </div>
        ) : error ? (
          <div className="state-box">
            <h2>Error al cargar</h2>
            <p>{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="state-box">
            <h2>No se encontraron profesores</h2>
            <p>Intenta con una búsqueda diferente.</p>
          </div>
        ) : (
          <div className="professors-grid">
            {filtered.map((prof) => (
              <div key={prof.id} className="professor-card" onClick={() => navigate(`/professors/${prof.id}`)}>
                <h3 className="pc-name">{prof.name}</h3>
                <p className="pc-department">{prof.department}</p>
                <p className="pc-description">{prof.description}</p>
                <div className="pc-stats">
                  <div className="pc-stat-row">
                    <span className="pc-stat-label">Dificultad</span>
                    <Flames value={prof.avgDifficulty} />
                  </div>
                  <div className="pc-stat-row">
                    <span className="pc-stat-label">Recomendación</span>
                    <Badge pct={prof.recommendPct} />
                  </div>
                </div>
                <div className="pc-footer">
                  <span className="pc-reviews">{prof.totalReviews} reseñas</span>
                  <span className="pc-arrow">VER →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
