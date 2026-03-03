import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { classApi } from "../api/class.api";
import { subjectApi } from "../api/subject.api";
import { professorApi } from "../api/professor.api";
import { authApi } from "../api/auth.api";
import type { ClassSummary, Subject, Professor } from "../api/types";

function Flames({ value }: { value: number | null }) {
  if (value === null) return <span style={{ color: "var(--text-muted)" }}>—</span>;
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
  if (pct === null) return <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Sin reseñas</span>;
  const good = pct >= 60;
  return (
    <span style={{ color: good ? "var(--green-bright)" : "var(--red-bright)", fontFamily: "'Cinzel',serif", fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {good ? "⚔ Recomendado" : "☠ Evitar"} <em style={{ fontStyle: "normal", opacity: 0.7 }}>{pct.toFixed(0)}%</em>
    </span>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassSummary[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [semesters, setSemesters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterProfessor, setFilterProfessor] = useState("");

  useEffect(() => {
    Promise.all([classApi.getSemesters(), subjectApi.getAll(), professorApi.getAll()])
      .then(([sem, subs, profs]) => { setSemesters(sem); setSubjects(subs); setProfessors(profs); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    classApi.getAll({ semester: filterSemester || undefined, professorId: filterProfessor || undefined, subjectId: filterSubject || undefined })
      .then(setClasses)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [filterSemester, filterProfessor, filterSubject]);

  const filtered = classes.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.subject.name.toLowerCase().includes(q) || c.subject.code.toLowerCase().includes(q) || c.professor?.name?.toLowerCase().includes(q);
  });

  const handleLogout = () => { authApi.logout(); navigate("/login"); };

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

        .dash-hero { text-align:center; padding:3.5rem 2rem 2.5rem; border-bottom:1px solid var(--border); }
        .dash-hero-eyebrow { font-family:"Cinzel",serif; font-size:0.6rem; letter-spacing:0.3em; text-transform:uppercase; color:var(--gold-dim); margin-bottom:1rem; }
        .dash-hero-title { font-family:"Cinzel",serif; font-size:clamp(1.8rem,4vw,3rem); font-weight:900; color:var(--text); line-height:1.1; margin-bottom:0.75rem; }
        .dash-hero-title em { color:var(--gold); font-style:normal; }
        .dash-hero-sub { color:var(--text-dim); font-style:italic; font-size:1.1rem; }

        .dash-filters { padding:1.25rem 2rem; border-bottom:1px solid var(--border); display:flex; gap:0.75rem; flex-wrap:wrap; align-items:center; background:var(--surface); }
        .dash-search { flex:1; min-width:180px; background:var(--bg); border:1px solid var(--border); color:var(--text); font-family:"Crimson Text",serif; font-size:1rem; padding:0.55rem 0.9rem; outline:none; transition:border-color 0.2s; }
        .dash-search::placeholder { color:var(--text-muted); }
        .dash-search:focus { border-color:var(--gold-dim); }
        .dash-select { background:var(--bg); border:1px solid var(--border); color:var(--text); font-family:"Crimson Text",serif; font-size:0.9rem; padding:0.55rem 0.9rem; outline:none; cursor:pointer; }
        .dash-select:focus { border-color:var(--gold-dim); }
        .dash-count { font-family:"Cinzel",serif; font-size:0.65rem; letter-spacing:0.1em; color:var(--text-muted); text-transform:uppercase; margin-left:auto; }

        .dash-content { max-width:1400px; margin:0 auto; padding:2rem; }
        .classes-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:1.5px; background:var(--border); border:1px solid var(--border); }

        .class-card { background:var(--surface); padding:1.5rem; cursor:pointer; transition:background 0.15s; position:relative; overflow:hidden; }
        .class-card::before { content:""; position:absolute; left:0; top:0; bottom:0; width:2px; background:var(--gold); transform:scaleY(0); transition:transform 0.2s; transform-origin:bottom; }
        .class-card:hover { background:var(--surface2); }
        .class-card:hover::before { transform:scaleY(1); }

        .cc-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; }
        .cc-semester { font-family:"Cinzel",serif; font-size:0.58rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold-dim); border:1px solid var(--gold-dim); padding:0.2rem 0.45rem; }
        .cc-group { font-family:"Cinzel",serif; font-size:0.6rem; color:var(--text-muted); letter-spacing:0.1em; }
        .cc-subject { font-family:"Cinzel",serif; font-size:0.95rem; font-weight:600; color:var(--text); line-height:1.3; margin-bottom:0.2rem; }
        .cc-code { font-size:0.82rem; color:var(--text-dim); margin-bottom:0.65rem; }
        .cc-professor { font-size:0.9rem; color:var(--gold); margin-bottom:1.1rem; font-style:italic; }
        .cc-stats { display:flex; flex-direction:column; gap:0.45rem; }
        .cc-stat-row { display:flex; align-items:center; justify-content:space-between; }
        .cc-stat-label { font-family:"Cinzel",serif; font-size:0.55rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-muted); }
        .cc-footer { margin-top:0.9rem; padding-top:0.9rem; border-top:1px solid var(--text-muted); display:flex; justify-content:space-between; align-items:center; }
        .cc-reviews { font-size:0.78rem; color:var(--text-muted); }
        .cc-arrow { font-family:"Cinzel",serif; font-size:0.58rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--text-muted); transition:color 0.15s; }
        .class-card:hover .cc-arrow { color:var(--gold); }

        .state-box { text-align:center; padding:5rem 2rem; color:var(--text-dim); }
        .state-box h2 { font-family:"Cinzel",serif; font-size:1.1rem; color:var(--text-muted); margin-bottom:0.5rem; }
        .state-box p { font-style:italic; }
        .spinner { width:28px; height:28px; border:2px solid var(--border); border-top-color:var(--gold); border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 1rem; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <nav className="dash-nav">
        <div className="dash-brand">Tec<span>Souls</span></div>
        <div className="dash-nav-actions">
          <button className="nav-btn danger" onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      <div className="dash-hero">
        <p className="dash-hero-eyebrow">Sistema de calificacion</p>
        <h1 className="dash-hero-title">Conoce tu <em>destino academico</em></h1>
        <p className="dash-hero-sub">Consejos de alumnos que sobrevivieron. Advertencias de los que no.</p>
      </div>

      <div className="dash-filters">
        <input className="dash-search" placeholder="Buscar materia, codigo o profesor..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="dash-select" value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)}>
          <option value="">Todos los semestres</option>
          {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="dash-select" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
          <option value="">Todas las materias</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select className="dash-select" value={filterProfessor} onChange={(e) => setFilterProfessor(e.target.value)}>
          <option value="">Todos los profesores</option>
          {professors.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <span className="dash-count">{filtered.length} clases</span>
      </div>

      <div className="dash-content">
        {loading ? (
          <div className="state-box"><div className="spinner" /><p>Consultando los pergaminos...</p></div>
        ) : error ? (
          <div className="state-box"><h2>Error al cargar</h2><p>{error}</p></div>
        ) : filtered.length === 0 ? (
          <div className="state-box"><h2>Ningun vestigio encontrado</h2><p>No hay clases que coincidan.</p></div>
        ) : (
          <div className="classes-grid">
            {filtered.map((c) => (
              <div key={c.id} className="class-card" onClick={() => navigate(`/classes/${c.id}`)}>
                <div className="cc-header">
                  <span className="cc-semester">{c.semester}</span>
                  <span className="cc-group">Grupo {c.group}</span>
                </div>
                <div className="cc-subject">{c.subject.name}</div>
                <div className="cc-code">{c.subject.code}</div>
                <div className="cc-professor">{c.professor?.name ?? "Sin profesor"}</div>
                <div className="cc-stats">
                  <div className="cc-stat-row">
                    <span className="cc-stat-label">Dificultad</span>
                    <Flames value={c.avgDifficulty} />
                  </div>
                  <div className="cc-stat-row">
                    <span className="cc-stat-label">Veredicto</span>
                    <Badge pct={c.recommendPct} />
                  </div>
                </div>
                <div className="cc-footer">
                  <span className="cc-reviews">{c.totalReviews} {c.totalReviews === 1 ? "nota" : "notas"}</span>
                  <span className="cc-arrow">Ver notas</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
