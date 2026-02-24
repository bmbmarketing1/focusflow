"use client";
import { useState } from "react";

export default function LoginScreen({ onEmailLogin, onEmailSignUp }) {
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
