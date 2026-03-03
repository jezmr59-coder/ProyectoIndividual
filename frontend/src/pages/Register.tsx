import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/auth.api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authApi.register(name, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem; }
        .auth-page::before { content:""; position:fixed; inset:0; background:radial-gradient(ellipse at 50% 40%, rgba(200,150,12,0.06) 0%, transparent 65%); pointer-events:none; }
        .auth-card { width:100%; max-width:400px; background:var(--surface); border:1px solid var(--border); padding:3rem 2.5rem; position:relative; animation:fadeUp 0.4s ease both; }
        .auth-card::before, .auth-card::after { content:"⚔"; position:absolute; color:var(--gold-dim); font-size:0.7rem; }
        .auth-card::before { top:0.75rem; left:0.75rem; }
        .auth-card::after { bottom:0.75rem; right:0.75rem; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .auth-brand { text-align:center; margin-bottom:2.5rem; }
        .auth-brand-name { font-family:"Cinzel",serif; font-size:2rem; font-weight:900; letter-spacing:0.15em; color:var(--gold); text-transform:uppercase; }
        .auth-brand-name span { color:var(--text-dim); font-weight:400; }
        .auth-brand-sub { font-size:0.8rem; color:var(--text-muted); letter-spacing:0.2em; text-transform:uppercase; font-family:"Cinzel",serif; margin-top:0.3rem; }
        .auth-divider { border:none; border-top:1px solid var(--border); margin-bottom:2rem; }
        .auth-field { display:flex; flex-direction:column; gap:0.4rem; margin-bottom:1.25rem; }
        .auth-label { font-family:"Cinzel",serif; font-size:0.6rem; letter-spacing:0.2em; text-transform:uppercase; color:var(--text-muted); }
        .auth-input { background:var(--bg); border:1px solid var(--border); color:var(--text); font-size:1rem; padding:0.7rem 0.9rem; outline:none; width:100%; transition:border-color 0.2s; }
        .auth-input::placeholder { color:var(--text-muted); }
        .auth-input:focus { border-color:var(--gold-dim); }
        .auth-error { background:rgba(139,26,26,0.2); border:1px solid var(--red); color:#e07070; font-size:0.85rem; padding:0.6rem 0.9rem; margin-bottom:1.25rem; font-style:italic; }
        .auth-btn { width:100%; background:transparent; border:1px solid var(--gold); color:var(--gold); font-family:"Cinzel",serif; font-size:0.75rem; letter-spacing:0.2em; text-transform:uppercase; padding:0.85rem; margin-top:0.5rem; transition:all 0.2s; cursor:pointer; }
        .auth-btn:hover:not(:disabled) { background:var(--gold); color:var(--bg); }
        .auth-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .auth-footer { text-align:center; margin-top:1.75rem; font-size:0.9rem; color:var(--text-muted); }
        .auth-footer a { color:var(--gold-dim); transition:color 0.2s; }
        .auth-footer a:hover { color:var(--gold); }
      `}</style>
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="auth-brand-name">Tec<span>Souls</span></div>
            <div className="auth-brand-sub">Inscripcion al grimorio</div>
          </div>
          <hr className="auth-divider" />
          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}
            <div className="auth-field">
              <label className="auth-label">Nombre</label>
              <input className="auth-input" type="text" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
            </div>
            <div className="auth-field">
              <label className="auth-label">Correo</label>
              <input className="auth-input" type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="auth-field">
              <label className="auth-label">Contrasena</label>
              <input className="auth-input" type="password" placeholder="..." value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
            </div>
            <button className="auth-btn" type="submit" disabled={loading}>{loading ? "Inscribiendo..." : "Unirse"}</button>
          </form>
          <div className="auth-footer">Ya tienes cuenta? <Link to="/login">Iniciar sesion</Link></div>
        </div>
      </div>
    </>
  );
}
