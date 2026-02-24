"use client";
import { useState } from "react";
import { useAuth, useProjects } from "../lib/hooks";
import LoginScreen from "../components/LoginScreen";
import Dashboard from "../components/Dashboard";
export default function Home() {
  const { user, loading, signInWithEmail, signUpWithEmail, signOut } = useAuth();
  if (loading) return (<div className="min-h-screen flex items-center justify-center"><div className="text-center"><div className="text-4xl mb-4 animate-bounce">⚡</div><p className="text-slate-500 text-sm font-medium">Carregando FocusFlow...</p></div></div>);
  if (!user) return <LoginScreen onEmailLogin={signInWithEmail} onEmailSignUp={signUpWithEmail} />;
  return <Dashboard user={user} onSignOut={signOut} />;
}
