import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { classApi } from "../api/class.api";
import { noteApi } from "../api/note.api";
import { reactionApi } from "../api/reaction.api";
import { getToken } from "../api/client";
import type { ClassDetail, Note, Reaction } from "../api/types";

function Flames({ value }: { value: number }) {
  return (
    <span>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < value ? "var(--gold)" : "var(--text-muted)", fontSize: "0.8rem" }}>◆</span>
      ))}
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
  const myReaction = myReactions.find((r) => r.noteId === note.id);
  const isOwn = currentUserId === note.userId;
  const date = new Date(note.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "short", day: "numeric" });

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
  const [difficulty, setDifficulty] = useState(3);
  const [recommendation, setRecommendation] = useState(true);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const note = await noteApi.create({ classId, difficulty, recommendation, comment });
      onCreated(note);
      setComment("");
      setDifficulty(3);
      setRecommendation(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [classData, setClassData] = useState<ClassDetail | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [myReactions, setMyReactions] = useState<Reaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = !!getToken();

  useEffect(() => {
    if (!id) return;
    classApi.getById(id)
      .then((data) => {
        setClassData(data);
        setNotes(data.notes ?? []);
        if (data.notes?.length && isLoggedIn) {
          reactionApi.getMine(data.notes.map((n) => n.id)).then(setMyReactions).catch(() => {});
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleReact = async (noteId: string, type: "USEFUL" | "NOT_USEFUL") => {
    if (!isLoggedIn) { navigate("/login"); return; }
    try {
      await reactionApi.toggle(noteId, type);
      const updatedReactions = await reactionApi.getMine(notes.map((n) => n.id));
      setMyReactions(updatedReactions);
      const updatedNotes = await noteApi.getByClass(id!);
      setNotes(updatedNotes);
    } catch {}
  };

  const handleNoteCreated = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Eliminar esta nota?")) return;
    try {
      await noteApi.remove(noteId);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
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

  const { stats } = classData;

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
        .cd-professor { font-size:1.1rem; color:var(--gold); font-style:italic; margin-bottom:1.5rem; cursor:pointer; }
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

        .note-form { background:var(--surface); border:1px solid var(--border); padding:1.5rem; position:sticky; top:80px; }
        .nf-title { font-family:"Cinzel",serif; font-size:0.7rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold-dim); margin-bottom:1.25rem; padding-bottom:0.75rem; border-bottom:1px solid var(--border); }
        .nf-error { background:rgba(139,26,26,0.2); border:1px solid var(--red); color:#e07070; font-size:0.82rem; padding:0.5rem 0.75rem; margin-bottom:1rem; font-style:italic; }
        .nf-row { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:1rem; }
        .nf-field { display:flex; flex-direction:column; gap:0.4rem; }
        .nf-label { font-family:"Cinzel",serif; font-size:0.55rem; letter-spacing:0.15em; text-transform:uppercase; color:var(--text-muted); display:flex; justify-content:space-between; }
        .nf-counter { font-style:italic; color:var(--text-muted); }
        .nf-flames { display:flex; gap:4px; }
        .flame-btn { background:none; border:none; font-size:1rem; cursor:pointer; color:var(--text-muted); transition:color 0.1s; padding:0; line-height:1; }
        .flame-btn.on { color:var(--gold); }
        .nf-toggle { display:flex; gap:1px; background:var(--border); }
        .toggle-btn { background:var(--bg); border:none; font-family:"Cinzel",serif; font-size:0.58rem; letter-spacing:0.08em; text-transform:uppercase; padding:0.4rem 0.7rem; color:var(--text-muted); cursor:pointer; transition:all 0.15s; }
        .toggle-btn.active-good { background:var(--green); color:var(--green-bright); }
        .toggle-btn.active-bad { background:var(--red); color:#e07070; }
        .nf-textarea { background:var(--bg); border:1px solid var(--border); color:var(--text); font-size:0.95rem; padding:0.65rem 0.85rem; outline:none; width:100%; resize:vertical; transition:border-color 0.2s; line-height:1.5; }
        .nf-textarea::placeholder { color:var(--text-muted); }
        .nf-textarea:focus { border-color:var(--gold-dim); }
        .nf-submit { width:100%; background:transparent; border:1px solid var(--gold); color:var(--gold); font-family:"Cinzel",serif; font-size:0.68rem; letter-spacing:0.15em; text-transform:uppercase; padding:0.8rem; margin-top:0.5rem; transition:all 0.2s; cursor:pointer; }
        .nf-submit:hover:not(:disabled) { background:var(--gold); color:var(--bg); }
        .nf-submit:disabled { opacity:0.45; cursor:not-allowed; }
        .login-prompt { background:var(--surface); border:1px solid var(--border); padding:1.5rem; text-align:center; }
        .lp-text { color:var(--text-dim); font-style:italic; margin-bottom:1rem; }
        .lp-btn { font-family:"Cinzel",serif; font-size:0.68rem; letter-spacing:0.15em; text-transform:uppercase; padding:0.7rem 1.5rem; border:1px solid var(--gold); background:transparent; color:var(--gold); cursor:pointer; transition:all 0.2s; }
        .lp-btn:hover { background:var(--gold); color:var(--bg); }
      `}</style>

      <nav className="cd-nav">
        <button className="cd-back" onClick={() => navigate(-1)}>Volver</button>
        <span className="cd-brand">Tec<span>Souls</span></span>
      </nav>

      <div className="cd-header">
        <div className="cd-header-inner">
          <p className="cd-eyebrow">Semestre {classData.semester} &nbsp;·&nbsp; Grupo {classData.group}</p>
          <h1 className="cd-subject">{classData.subject.name}</h1>
          <p className="cd-code">{classData.subject.code}</p>
          <p className="cd-professor" onClick={() => navigate(`/professors/${classData.professor.id}`)}>
            {classData.professor.name} &rarr;
          </p>
          <div className="cd-stats-row">
            <div className="cd-stat">
              <span className="cd-stat-label">Notas</span>
              <span className="cd-stat-value">{stats.totalReviews}</span>
            </div>
            <div className="cd-stat">
              <span className="cd-stat-label">Dificultad</span>
              <span className="cd-stat-value">
                {stats.avgDifficulty !== null ? stats.avgDifficulty.toFixed(1) : "—"}
                {stats.avgDifficulty !== null && <small>/5</small>}
              </span>
            </div>
            <div className="cd-stat">
              <span className="cd-stat-label">Recomendado</span>
              <span className="cd-stat-value">
                {stats.recommendPct !== null ? `${stats.recommendPct.toFixed(0)}%` : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="cd-body">
        <div>
          <div className="cd-notes-header">
            <span className="cd-notes-title">Notas de alumnos</span>
            <span className="cd-notes-count">{notes.length} {notes.length === 1 ? "nota" : "notas"}</span>
          </div>
          {notes.length === 0 ? (
            <div className="notes-empty">Ninguna nota aun. Se el primero en dejar una.</div>
          ) : (
            <div className="notes-list">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  myReactions={myReactions}
                  onReact={handleReact}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          {isLoggedIn ? (
            <NoteForm classId={id!} onCreated={handleNoteCreated} />
          ) : (
            <div className="login-prompt">
              <p className="lp-text">Inicia sesion para dejar una nota</p>
              <button className="lp-btn" onClick={() => navigate("/login")}>Iniciar sesion</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
