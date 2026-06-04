// src/pages/ProfessorProfile.tsx
// Perfil de profesor con estadísticas, clases y formulario para enviar reseñas.
import { useState, useEffect } from "react"; // Hooks para manejar estado y ciclos de vida
import type { FormEvent } from "react"; // Tipo TypeScript para eventos de formulario
import { useNavigate, useParams } from "react-router-dom"; // Navegación y parámetros de ruta
import { professorApi } from "../api/professor.api"; // API de profesores
import { authApi } from "../api/auth.api"; // API de autenticación
import type { Professor, ClassSummary } from "../api/types"; // Tipos importados

function Flames({ value }: { value: number | null }) {
  if (value === null) return <span style={{ color: "var(--text-muted)" }}>—</span>; // Si no hay valor, muestra un guión
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
  const good = pct >= 60; // Determina si la recomendación es buena
  return (
    <span style={{ color: good ? "var(--green-bright)" : "var(--red-bright)", fontFamily: "'Cinzel',serif", fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {good ? "⚔ Recomendado" : "☠ Evitar"} <em style={{ fontStyle: "normal", opacity: 0.7 }}>{pct.toFixed(0)}%</em>
    </span>
  );
}

export default function ProfessorProfile() {
  const navigate = useNavigate(); // Hook para navegar a otras páginas
  const { id } = useParams<{ id: string }>(); // Obtiene el id del profesor de la URL
  const [professor, setProfessor] = useState<(Professor & { classes: ClassSummary[] }) | null>(null); // Estado con datos del profesor
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Mensaje de error
  const [showReviewForm, setShowReviewForm] = useState(false); // Controla si mostrar el formulario de reseña
  const [reviewForm, setReviewForm] = useState({ classId: "", difficulty: 3, recommendation: true, comment: "" }); // Estado del formulario
  const [submitting, setSubmitting] = useState(false); // Indicador de envío

  useEffect(() => {
    if (!id) return; // Si no hay id, no hace nada
    professorApi.getById(id)
      .then(setProfessor) // Carga el profesor desde la API
      .catch((e) => setError(e.message)) // Guarda mensaje de error
      .finally(() => setLoading(false)); // Termina la carga
  }, [id]);

  const handleLogout = () => { authApi.logout(); navigate("/login"); }; // Cierra sesión y redirige

  const handleSubmitReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Previene recarga
    if (!id || !reviewForm.classId) return;

    setSubmitting(true);
    try {
      await professorApi.createReview(id, reviewForm); // Envía la reseña a la API
      setShowReviewForm(false); // Oculta el formulario tras enviar
      setReviewForm({ classId: "", difficulty: 3, recommendation: true, comment: "" }); // Reinicia campos
      professorApi.getById(id).then(setProfessor); // Refresca datos del profesor
    } catch (e: any) {
      alert(e.message || "Error al enviar reseña");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--text-dim)" }}>
        <div style={{ width: "28px", height: "28px", border: "2px solid var(--border)", borderTopColor: "var(--gold)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 1rem" }}></div>
        <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.1rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Cargando profesor...</h2>
      </div>
    );
  }

  if (error || !professor) {
    return (
      <div style={{ textAlign: "center", padding: "5rem 2rem", color: "var(--text-dim)" }}>
        <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.1rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Error al cargar</h2>
        <p style={{ fontStyle: "italic" }}>{error || "Profesor no encontrado"}</p>
        <button onClick={() => navigate("/dashboard")} style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "var(--gold)", color: "var(--bg)", border: "none", borderRadius: "4px", cursor: "pointer" }}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .prof-nav { border-bottom:1px solid var(--border); padding:0 2rem; display:flex; align-items:center; justify-content:space-between; height:64px; background:rgba(10,8,6,0.95); position:sticky; top:0; z-index:100; backdrop-filter:blur(8px); }
        .prof-brand { font-family:"Cinzel",serif; font-size:1.1rem; font-weight:900; letter-spacing:0.15em; color:var(--gold); text-transform:uppercase; cursor:pointer; }
        .prof-brand span { color:var(--text-dim); font-weight:400; }
        .prof-nav-actions { display:flex; gap:1rem; align-items:center; }
        .nav-btn { font-family:"Cinzel",serif; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; padding:0.45rem 1rem; border:1px solid var(--border); background:transparent; color:var(--text-dim); transition:all 0.2s; cursor:pointer; }
        .nav-btn:hover { border-color:var(--gold-dim); color:var(--gold); }
        .nav-btn.danger:hover { border-color:var(--red-bright); color:var(--red-bright); }

        .prof-hero { text-align:center; padding:3.5rem 2rem 2.5rem; border-bottom:1px solid var(--border); }
        .prof-hero-eyebrow { font-family:"Cinzel",serif; font-size:0.6rem; letter-spacing:0.3em; text-transform:uppercase; color:var(--gold-dim); margin-bottom:1rem; }
        .prof-hero-title { font-family:"Cinzel",serif; font-size:clamp(1.8rem,4vw,3rem); font-weight:900; color:var(--text); line-height:1.1; margin-bottom:0.75rem; }
        .prof-hero-title em { color:var(--gold); font-style:normal; }
        .prof-hero-sub { color:var(--text-dim); font-style:italic; font-size:1.1rem; }

        .prof-content { max-width:1000px; margin:0 auto; padding:2rem; }
        .prof-info { background:var(--surface); border:1px solid var(--border); padding:2rem; margin-bottom:2rem; }
        .prof-name { font-family:"Cinzel",serif; font-size:2rem; font-weight:900; color:var(--text); margin-bottom:0.5rem; }
        .prof-dept { font-size:1.1rem; color:var(--gold); margin-bottom:1rem; }
        .prof-desc { font-size:1rem; color:var(--text-dim); line-height:1.6; margin-bottom:2rem; }
        .prof-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1rem; }
        .prof-stat { text-align:center; }
        .prof-stat-label { font-family:"Cinzel",serif; font-size:0.7rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.5rem; }
        .prof-stat-value { font-size:1.2rem; font-weight:600; }

        .prof-classes { margin-bottom:2rem; }
        .prof-classes-title { font-family:"Cinzel",serif; font-size:1.5rem; font-weight:600; color:var(--text); margin-bottom:1rem; }
        .classes-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1rem; }

        .class-card { background:var(--surface); border:1px solid var(--border); padding:1.5rem; cursor:pointer; transition:background 0.15s; }
        .class-card:hover { background:var(--surface2); }
        .cc-subject { font-family:"Cinzel",serif; font-size:1rem; font-weight:600; color:var(--text); margin-bottom:0.2rem; }
        .cc-code { font-size:0.85rem; color:var(--text-dim); margin-bottom:0.5rem; }
        .cc-semester { font-family:"Cinzel",serif; font-size:0.6rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--gold-dim); }
        .cc-stats { margin-top:1rem; }
        .cc-stat-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem; }
        .cc-stat-label { font-family:"Cinzel",serif; font-size:0.55rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-muted); }

        .review-section { background:var(--surface); border:1px solid var(--border); padding:2rem; }
        .review-title { font-family:"Cinzel",serif; font-size:1.5rem; font-weight:600; color:var(--text); margin-bottom:1rem; }
        .review-btn { font-family:"Cinzel",serif; font-size:0.7rem; letter-spacing:0.1em; text-transform:uppercase; padding:0.6rem 1.2rem; background:var(--gold); color:var(--bg); border:none; border-radius:4px; cursor:pointer; transition:background 0.2s; }
        .review-btn:hover { background:var(--gold-dim); }

        .review-form { margin-top:1.5rem; }
        .form-group { margin-bottom:1rem; }
        .form-label { display:block; font-family:"Cinzel",serif; font-size:0.7rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-muted); margin-bottom:0.5rem; }
        .form-select, .form-textarea { width:100%; background:var(--bg); border:1px solid var(--border); color:var(--text); font-family:"Crimson Text",serif; font-size:1rem; padding:0.6rem; outline:none; }
        .form-select:focus, .form-textarea:focus { border-color:var(--gold-dim); }
        .form-textarea { resize:vertical; min-height:100px; }
        .form-row { display:flex; gap:1rem; }
        .form-row .form-group { flex:1; }
        .form-actions { margin-top:1.5rem; display:flex; gap:1rem; justify-content:flex-end; }
        .cancel-btn { font-family:"Cinzel",serif; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; padding:0.5rem 1rem; border:1px solid var(--border); background:transparent; color:var(--text-dim); cursor:pointer; }
        .cancel-btn:hover { border-color:var(--gold-dim); color:var(--gold); }
        .submit-btn { font-family:"Cinzel",serif; font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; padding:0.5rem 1rem; background:var(--gold); color:var(--bg); border:none; cursor:pointer; }
        .submit-btn:hover { background:var(--gold-dim); }
        .submit-btn:disabled { opacity:0.6; cursor:not-allowed; }

        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      <nav className="prof-nav">
        <div className="prof-brand" onClick={() => navigate("/dashboard")}>Tec<span>Souls</span></div>
        <div className="prof-nav-actions">
          <button className="nav-btn danger" onClick={handleLogout}>Salir</button>
        </div>
      </nav>

      <div className="prof-hero">
        <p className="prof-hero-eyebrow">Perfil del profesor</p>
        <h1 className="prof-hero-title">{professor.name}</h1>
        <p className="prof-hero-sub">Descubre más sobre este profesor y sus clases.</p>
      </div>

      <div className="prof-content">
        <div className="prof-info">
          <h2 className="prof-name">{professor.name}</h2>
          <p className="prof-dept">{professor.department}</p>
          <p className="prof-desc">{professor.description}</p>
          <div className="prof-stats">
            <div className="prof-stat">
              <div className="prof-stat-label">Total de reseñas</div>
              <div className="prof-stat-value">{professor.totalReviews}</div>
            </div>
            <div className="prof-stat">
              <div className="prof-stat-label">Dificultad promedio</div>
              <div className="prof-stat-value"><Flames value={professor.avgDifficulty} /></div>
            </div>
            <div className="prof-stat">
              <div className="prof-stat-label">Recomendación</div>
              <div className="prof-stat-value"><Badge pct={professor.recommendPct} /></div>
            </div>
          </div>
        </div>

        <div className="prof-classes">
          <h3 className="prof-classes-title">Clases impartidas</h3>
          <div className="classes-grid">
            {professor.classes.map((cls) => (
              <div key={cls.id} className="class-card" onClick={() => navigate(`/classes/${cls.id}`)}>
                <h4 className="cc-subject">{cls.subject.name}</h4>
                <p className="cc-code">{cls.subject.code}</p>
                <p className="cc-semester">{cls.semester} - Grupo {cls.group}</p>
                <div className="cc-stats">
                  <div className="cc-stat-row">
                    <span className="cc-stat-label">Dificultad</span>
                    <Flames value={cls.avgDifficulty} />
                  </div>
                  <div className="cc-stat-row">
                    <span className="cc-stat-label">Recomendación</span>
                    <Badge pct={cls.recommendPct} />
                  </div>
                  <div className="cc-stat-row">
                    <span className="cc-stat-label">Reseñas</span>
                    <span>{cls.totalReviews}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="review-section">
          <h3 className="review-title">Deja tu reseña</h3>
          <p style={{ color: "var(--text-dim)", marginBottom: "1rem" }}>Comparte tu experiencia con este profesor para ayudar a otros estudiantes.</p>

          {!showReviewForm ? (
            <button className="review-btn" onClick={() => setShowReviewForm(true)}>
              Escribir reseña
            </button>
          ) : (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <div className="form-group">
                <label className="form-label">Clase</label>
                <select
                  className="form-select"
                  value={reviewForm.classId}
                  onChange={(e) => setReviewForm({ ...reviewForm, classId: e.target.value })}
                  required
                >
                  <option value="">Selecciona una clase</option>
                  {professor.classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.subject.name} - {cls.semester} Grupo {cls.group}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Dificultad (1-5)</label>
                  <select
                    className="form-select"
                    value={reviewForm.difficulty}
                    onChange={(e) => setReviewForm({ ...reviewForm, difficulty: parseInt(e.target.value) })}
                  >
                    <option value={1}>1 - Muy fácil</option>
                    <option value={2}>2 - Fácil</option>
                    <option value={3}>3 - Moderada</option>
                    <option value={4}>4 - Difícil</option>
                    <option value={5}>5 - Muy difícil</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Recomendación</label>
                  <select
                    className="form-select"
                    value={reviewForm.recommendation ? "yes" : "no"}
                    onChange={(e) => setReviewForm({ ...reviewForm, recommendation: e.target.value === "yes" })}
                  >
                    <option value="yes">Recomendado</option>
                    <option value="no">No recomendado</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Comentario</label>
                <textarea
                  className="form-textarea"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={5}
                  placeholder="Describe tu experiencia con el profesor y la clase..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowReviewForm(false)}>Cancelar</button>
                <button type="submit" className="submit-btn" disabled={submitting || !reviewForm.comment.trim()}>
                  {submitting ? "Enviando..." : "Enviar reseña"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
