// src/pages/ClassDetail.tsx
// Página de detalle de clase que muestra notas, estadísticas y permite dejar reseñas.
import { useState, useEffect } from "react"; // Hooks para estado y efectos
import { useParams, useNavigate } from "react-router-dom"; // Hooks de React Router para parámetros y navegación
import { classApi } from "../api/class.api"; // API para datos de clases
import { noteApi } from "../api/note.api"; // API para notas de clase
import { reactionApi } from "../api/reaction.api"; // API para reacciones
import { getToken } from "../api/client"; // Función para obtener token guardado
import type { ClassDetail, Note, Reaction } from "../api/types"; // Tipos TypeScript importados

function Flames({ value }: { value: number | null }) {
  if (value === null) return <span style={{ color: "var(--text-muted)" }}>—</span>; // Si no hay valor, muestra un guión
  return (
    <span>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < value ? "var(--gold)" : "var(--text-muted)", fontSize: "0.8rem" }}>◆</span>
      ))}
    </span>
  );
}

function Badge({ pct }: { pct: number | null }) {
  if (pct === null) return <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Sin reseñas</span>;
  const good = pct >= 60;
  return (
    <span style={{ color: good ? "var(--green-bright)" : "var(--red-bright)", fontFamily: "'Cinzel',serif", fontSize: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
      {good ? "⚔ Recomendado" : "☠ Evitar"} <em style={{ fontStyle: "normal", opacity: 0.7 }}>{pct.toFixed(0)}%</em>
    </span>
  );
}

interface NoteCardProps {
  note: Note;
  myReactions: Reaction[];
  onReact: (noteId: string, type: "USEFUL" | "NOT_USEFUL") => void;
  currentUserId?: string;
  onDelete: (noteId: string) => void;
}

function NoteCard({ note, myReactions, onReact, currentUserId, onDelete }: NoteCardProps) {
  const myReaction = myReactions.find((r) => r.noteId === note.id); // Busca mi reacción a esta nota
  const isOwn = currentUserId === note.userId; // Determina si la nota es propia
  const date = new Date(note.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" }); // Formatea fecha

  return (
    <div className="note-card">
      <div className="note-header">
        <div className="note-meta">
          <span className="note-author">{note.user.name}</span>
          <span className="note-date">{date}</span>
        </div>
        <div className="note-header-right">
          <Flames value={note.difficulty} />
          <span className={`note-rec ${note.recommendation ? "good" : "bad"}`}>
            {note.recommendation ? "Recomendado" : "No recomendado"}
          </span>
        </div>
      </div>
      <p className="note-comment">{note.comment}</p>
      <div className="note-footer">
        <div className="note-reactions">
          <button
            className={`react-btn ${myReaction?.type === "USEFUL" ? "active-useful" : ""}`}
            onClick={() => onReact(note.id, "USEFUL")}
            title="Util"
          >
            ⚔ {note.usefulCount}
          </button>
          <button
            className={`react-btn ${myReaction?.type === "NOT_USEFUL" ? "active-not" : ""}`}
            onClick={() => onReact(note.id, "NOT_USEFUL")}
            title="No util"
          >
            ☠ {note.notUsefulCount}
          </button>
        </div>
        {isOwn && (
          <button className="delete-btn" onClick={() => onDelete(note.id)}>Eliminar</button>
        )}
      </div>
    </div>
  );
}

interface NoteFormProps {
  classId: string;
  onCreated: (note: Note) => void;
}

function NoteForm({ classId, onCreated }: NoteFormProps) {
  const [difficulty, setDifficulty] = useState(3); // Estado para dificultad seleccionada
  const [recommendation, setRecommendation] = useState(true); // Estado para recomendación
  const [comment, setComment] = useState(""); // Comentario del usuario
  const [loading, setLoading] = useState(false); // Indicador de envío
  const [error, setError] = useState<string | null>(null); // Mensaje de error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene recarga de página
    setError(null); // Limpia error previo
    setLoading(true); // Activa indicador de carga
    try {
      const note = await noteApi.create({ classId, difficulty, recommendation, comment }); // Crea la nota en la API
      onCreated(note); // Notifica al padre
      setComment(""); // Resetea el formulario
      setDifficulty(3);
      setRecommendation(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false); // Desactiva indicador
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div className="nf-title">Dejar una nota</div>
      {error && <div className="nf-error">{error}</div>}
      <div className="nf-row">
        <div className="nf-field">
          <label className="nf-label">Dificultad</label>
          <div className="nf-flames">
            {[1,2,3,4,5].map((n) => (
              <button key={n} type="button" className={`flame-btn ${n <= difficulty ? "on" : ""}`} onClick={() => setDifficulty(n)}>
                ◆
              </button>
            ))}
          </div>
        </div>
        <div className="nf-field">
          <label className="nf-label">Recomendacion</label>
          <div className="nf-toggle">
            <button type="button" className={`toggle-btn ${recommendation ? "active-good" : ""}`} onClick={() => setRecommendation(true)}>
              Recomendado
            </button>
            <button type="button" className={`toggle-btn ${!recommendation ? "active-bad" : ""}`} onClick={() => setRecommendation(false)}>
              No recomendado
            </button>
          </div>
        </div>
      </div>
      <div className="nf-field">
        <label className="nf-label">Comentario <span className="nf-counter">{comment.length}/200</span></label>
        <textarea
          className="nf-textarea"
          placeholder="Tips, advertencias, consejos para futuros alumnos..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={200}
          required
          rows={3}
        />
      </div>
      <button className="nf-submit" type="submit" disabled={loading || !comment.trim()}>
        {loading ? "Inscribiendo nota..." : "⚔ Dejar nota"}
      </button>
    </form>
  );
}

export default function ClassDetailPage() {
  const { id } = useParams<{ id: string }>(); // Obtiene el id de la clase desde la URL
  const navigate = useNavigate(); // Hook para navegar
  const [classData, setClassData] = useState<ClassDetail | null>(null); // Datos de la clase
  const [notes, setNotes] = useState<Note[]>([]); // Lista de notas
  const [myReactions, setMyReactions] = useState<Reaction[]>([]); // Reacciones propias
  const [loading, setLoading] = useState(true); // Carga inicial
  const [error, setError] = useState<string | null>(null); // Error de carga
  const isLoggedIn = !!getToken(); // Comprueba si hay token

  useEffect(() => {
    if (!id) return; // Si no hay id, no hace nada
    classApi.getById(id)
      .then((data) => {
        setClassData(data); // Guarda datos de clase
        setNotes(data.notes ?? []); // Guarda notas asociadas
        if (data.notes?.length && isLoggedIn) {
          reactionApi.getMine(data.notes.map((n) => n.id)).then(setMyReactions).catch(() => {}); // Carga reacciones del usuario
        }
      })
      .catch((e) => setError(e.message)) // Captura errores
      .finally(() => setLoading(false)); // Finaliza estado de carga
  }, [id, isLoggedIn]);

  const handleReact = async (noteId: string, type: "USEFUL" | "NOT_USEFUL") => {
    if (!isLoggedIn) { navigate("/login"); return; } // Si usuario no está autenticado, redirige a login
    try {
      await reactionApi.toggle(noteId, type); // Cambia la reacción
      const updatedReactions = await reactionApi.getMine(notes.map((n) => n.id)); // Vuelve a cargar reacciones propias
      setMyReactions(updatedReactions);
      const updatedNotes = await noteApi.getByClass(id!); // Vuelve a cargar notas actualizadas
      setNotes(updatedNotes);
    } catch {
      // Ignora error por ahora
    }
  };

  const handleNoteCreated = (note: Note) => {
    setNotes((prev) => [note, ...prev]); // Añade nota nueva al principio
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Eliminar esta nota?")) return; // Pide confirmación al eliminar
    try {
      await noteApi.remove(noteId); // Elimina nota en la API
      setNotes((prev) => prev.filter((n) => n.id !== noteId)); // Actualiza la lista local
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh" }}>
      <div style={{ textAlign:"center", color:"var(--text-dim)" }}>
        <div className="spinner" style={{ width:28, height:28, border:"2px solid var(--border)", borderTopColor:"var(--gold)", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 1rem" }} />
        <p style={{ fontStyle:"italic" }}>Convocando el alma de la clase...</p>
      </div>
    </div>
  );
  if (error) return <div style={{ padding:"4rem", textAlign:"center", color:"var(--red-bright)" }}>{error}</div>;
  if (!classData) return null;

  const { stats } = classData; // Estadísticas generales

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .cd-nav { border-bottom:1px solid var(--border); padding:0 2rem; display:flex; align-items:center; gap:1.5rem; height:64px; background:rgba(10,8,6,0.95); position:sticky; top:0; z-index:100; backdrop-filter:blur(8px); }
        .cd-back { font-family:"Cinzel",serif; font-size:0.62rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-dim); background:none; border:1px solid var(--border); padding:0.4rem 0.8rem; transition:all 0.2s; cursor:pointer; }
        .cd-back:hover { border-color:var(--gold-dim); color:var(--gold); }
        .cd-brand { font-family:"Cinzel",serif; font-size:1rem; font-weight:900; letter-spacing:0.15em; color:var(--gold); text-transform:uppercase; }
        .cd-brand span { color:var(--text-dim); font-weight:400; }

        .cd-header { padding:2.5rem 2rem 2rem; border-bottom:1px solid var(--border); background:var(--surface); }
        .cd-header-inner { max-width:1000px; margin:0 auto; }
        .cd-eyebrow { font-family:"Cinzel",serif; font-size:0.58rem; letter-spacing:0.25em; text-transform:uppercase; color:var(--gold-dim); margin-bottom:0.75rem; }
        .cd-subject { font-family:"Cinzel",serif; font-size:clamp(1.5rem,4vw,2.5rem); font-weight:900; color:var(--text); line-height:1.1; margin-bottom:0.3rem; }
        .cd-code { font-size:0.9rem; color:var(--text-dim); margin-bottom:0.5rem; }
        .cd-professor { font-size:1.1rem; color:var(--gold); margin-bottom:1.5rem; cursor:pointer; }
        .cd-professor:hover { text-decoration:underline; }
        .cd-stats-row { display:flex; gap:1px; background:var(--border); border:1px solid var(--border); width:fit-content; flex-wrap:wrap; }
        .cd-stat { background:var(--surface2); padding:0.75rem 1.25rem; display:flex; flex-direction:column; gap:0.25rem; min-width:100px; }
        .cd-stat-label { font-family:"Cinzel",serif; font-size:0.52rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--text-muted); }
        .cd-stat-value { font-family:"Cinzel",serif; font-size:1.4rem; font-weight:900; color:var(--gold); line-height:1; }
        .cd-stat-value small { font-size:0.65rem; color:var(--text-dim); font-weight:400; margin-left:0.2rem; }

        .cd-body { max-width:1000px; margin:0 auto; padding:2rem; display:grid; grid-template-columns:1fr 360px; gap:2rem; align-items:start; }
        @media (max-width:800px) { .cd-body { grid-template-columns:1fr; } }

        .cd-notes-header { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:1.25rem; padding-bottom:0.75rem; border-bottom:1px solid var(--border); }
        .cd-notes-title { font-family:"Cinzel",serif; font-size:0.7rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold-dim); }
        .cd-notes-count { font-size:0.85rem; color:var(--text-muted); }
        .notes-list { display:flex; flex-direction:column; gap:1px; background:var(--border); border:1px solid var(--border); }
        .notes-empty { padding:3rem; text-align:center; color:var(--text-muted); font-style:italic; background:var(--surface); border:1px solid var(--border); }

        .note-card { background:var(--surface); padding:1.25rem; transition:background 0.15s; }
        .note-card:hover { background:var(--surface2); }
        .note-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem; }
        .note-meta { display:flex; flex-direction:column; gap:0.15rem; }
        .note-author { font-family:"Cinzel",serif; font-size:0.72rem; letter-spacing:0.05em; color:var(--text); }
        .note-date { font-size:0.75rem; color:var(--text-muted); }
        .note-header-right { display:flex; flex-direction:column; align-items:flex-end; gap:0.25rem; }
        .note-rec { font-family:"Cinzel",serif; font-size:0.58rem; letter-spacing:0.08em; text-transform:uppercase; }
        .note-rec.good { color:var(--green-bright); }
        .note-rec.bad { color:var(--red-bright); }
        .note-comment { font-size:0.95rem; color:var(--text); line-height:1.5; margin-bottom:0.75rem; }
        .note-footer { display:flex; justify-content:space-between; align-items:center; }
        .note-reactions { display:flex; gap:0.5rem; }
        .react-btn { background:transparent; border:1px solid var(--border); color:var(--text-dim); font-size:0.78rem; padding:0.3rem 0.7rem; transition:all 0.15s; cursor:pointer; font-family:"Cinzel",serif; letter-spacing:0.05em; }
        .react-btn:hover { border-color:var(--gold-dim); color:var(--text); }
        .react-btn.active-useful { border-color:var(--gold); color:var(--gold); }
        .react-btn.active-not { border-color:var(--red-bright); color:var(--red-bright); }
        .delete-btn { background:transparent; border:none; color:var(--text-muted); font-size:0.78rem; cursor:pointer; font-family:"Cinzel",serif; letter-spacing:0.05em; transition:color 0.15s; padding:0.2rem 0.5rem; }
        .delete-btn:hover { color:var(--red-bright); }
        .note-form { border:1px solid var(--border); background:var(--surface); padding:1.5rem; margin-top:1.5rem; }
        .nf-title { font-family:"Cinzel",serif; font-size:1rem; font-weight:700; margin-bottom:1rem; color:var(--text); }
        .nf-error { margin-bottom:1rem; color:var(--red-bright); }
        .nf-row { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:1rem; }
        .nf-field { flex:1; min-width:140px; display:flex; flex-direction:column; gap:0.45rem; }
        .nf-label { font-family:"Cinzel",serif; font-size:0.7rem; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-muted); }
        .nf-flames { display:flex; gap:0.4rem; }
        .flame-btn { background:transparent; border:1px solid var(--border); color:var(--text-muted); font-size:0.9rem; padding:0.45rem 0.6rem; cursor:pointer; }
        .flame-btn.on { border-color:var(--gold); color:var(--gold); }
        .nf-toggle { display:flex; gap:0.5rem; }
        .toggle-btn { flex:1; border:1px solid var(--border); background:transparent; color:var(--text-muted); padding:0.6rem 0.9rem; cursor:pointer; }
        .toggle-btn.active-good { border-color:var(--gold); color:var(--gold); }
        .toggle-btn.active-bad { border-color:var(--red-bright); color:var(--red-bright); }
        .nf-textarea { width:100%; min-height:100px; border:1px solid var(--border); background:var(--bg); color:var(--text); padding:0.75rem; resize:vertical; }
        .nf-submit { margin-top:1rem; width:100%; padding:0.9rem; font-family:"Cinzel",serif; letter-spacing:0.1em; text-transform:uppercase; border:none; background:var(--gold); color:var(--bg); cursor:pointer; }
        .nf-submit:disabled { opacity:0.6; cursor:not-allowed; }
      `}</style>

      <div className="cd-nav">
        <button className="cd-back" onClick={() => navigate(-1)}>Volver</button>
        <div className="cd-brand">Tec<span>Souls</span></div>
      </div>

      <header className="cd-header">
        <div className="cd-header-inner">
          <div className="cd-eyebrow">Detalle de clase</div>
          <h1 className="cd-subject">{classData.subject.name}</h1>
          <div className="cd-code">{classData.subject.code} · Semestre {classData.semester}</div>
          <button className="cd-professor" onClick={() => navigate(`/professors/${classData.professor.id}`)}>{classData.professor.name}</button>
          <div className="cd-stats-row">
            <div className="cd-stat">
              <div className="cd-stat-label">Reseñas</div>
              <div className="cd-stat-value">{stats.totalReviews}</div>
            </div>
            <div className="cd-stat">
              <div className="cd-stat-label">Dificultad</div>
              <div className="cd-stat-value"><Flames value={stats.avgDifficulty} /></div>
            </div>
            <div className="cd-stat">
              <div className="cd-stat-label">Recomendación</div>
              <div className="cd-stat-value"><Badge pct={stats.recommendPct} /></div>
            </div>
          </div>
        </div>
      </header>

      <main className="cd-body">
        <section>
          <div className="cd-notes-header">
            <div>
              <div className="cd-notes-title">Notas de alumnos</div>
              <div className="cd-notes-count">{notes.length} entradas</div>
            </div>
          </div>

          {notes.length === 0 ? (
            <div className="notes-empty">Todavía no hay notas para esta clase. Sé el primero en compartir tu experiencia.</div>
          ) : (
            <div className="notes-list">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  myReactions={myReactions}
                  onReact={handleReact}
                  currentUserId={note.userId}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </section>

        <aside>
          <NoteForm classId={id!} onCreated={handleNoteCreated} />
        </aside>
      </main>
    </>
  );
}
