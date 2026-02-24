"use client";
import { useState } from "react";

const CATEGORIES = [
  { key: "pessoal", label: "\uD83C\uDFE0 Pessoal" },
  { key: "trabalho", label: "\uD83D\uDCBC Trabalho" },
  { key: "estudo", label: "\uD83D\uDCDA Estudo" },
  { key: "freelance", label: "\uD83D\uDCB0 Freelance" },
];

const PRIORITIES = [
  { key: "urgente", label: "\uD83D\uDD34 Urgente" },
  { key: "alta", label: "\uD83D\uDFE0 Alta" },
  { key: "media", label: "\uD83D\uDFE1 M\u00E9dia" },
  { key: "baixa", label: "\uD83D\uDFE2 Baixa" },
];

const COLORS = ["#6366f1", "#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6"];

export default function NewProjectModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "pessoal",
    priority: "media",
    color: "#6366f1",
    deadline: "",
    context_note: "",
  });

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      priority: form.priority,
      color: form.color,
      deadline: form.deadline || null,
      context_note: form.context_note.trim() || null,
      status: "ativo",
      progress: 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-slate-800 mb-5">\u2728 Novo Projeto</h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Nome do projeto *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Redesign do site"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Descri\u00E7\u00E3o</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Breve descri\u00E7\u00E3o..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Categoria</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
                {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Prioridade</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white">
                {PRIORITIES.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Prazo</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Cor</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <div key={c} onClick={() => setForm({ ...form, color: c })}
                  className="w-7 h-7 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: c,
                    border: form.color === c ? "3px solid #1e293b" : "3px solid transparent",
                  }} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">\uD83E\uDDE0 Contexto inicial (opcional)</label>
            <input value={form.context_note} onChange={(e) => setForm({ ...form, context_note: e.target.value })}
              placeholder="Ex: Preciso primeiro fazer X, depois Y..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-400" />
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-500 cursor-pointer hover:bg-slate-50">
            Cancelar
          </button>
          <button onClick={handleSave}
            className="px-6 py-2.5 rounded-xl border-none text-white text-sm font-bold cursor-pointer"
            style={{ background: form.color }}>
            Criar Projeto
          </button>
        </div>
      </div>
    </div>
  );
}