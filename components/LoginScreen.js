"use client";
import { useState } from "react";

export default function LoginScreen({ onGoogleLogin, onEmailLogin, onEmailSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (isSignUp) {
      const { error } = await onEmailSignUp(email, password);
      if (error) setError(error.message);
      else setMessage("Verifique seu email para confirmar o cadastro!");
    } else {
      const { error } = await onEmailLogin(email, password);
      if (error) setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)" }}>
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">FocusFlow</h1>
          <p className="text-slate-500 mt-2 text-sm">
            Organize seus projetos sem perder o foco.<br />
            Feito pra quem tem mil coisas na cabeça.
          </p>
        </div>

        <button onClick={onGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 rounded-xl py-3 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs text-slate-400 font-medium">ou com email</span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com" required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha (min. 6 caracteres)" required minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
          {message && <p className="text-green-600 text-xs font-medium">{message}</p>}
          <button type="submit"
            className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            {isSignUp ? "Criar Conta" : "Entrar"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          {isSignUp ? "Já tem conta?" : "Não tem conta?"}{" "}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(""); setMessage(""); }}
            className="text-indigo-500 font-semibold hover:underline bg-transparent border-none cursor-pointer">
            {isSignUp ? "Entrar" : "Criar conta"}
          </button>
        </p>
      </div>
    </div>
  );
}
