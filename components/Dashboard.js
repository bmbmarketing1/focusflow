"use client";
import { useState, useMemo } from "react";
import { useProjects } from "../lib/hooks";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import NewProjectModal from "./NewProjectModal";

const CATEGORIES = {
  trabalho: { label: "Trabalho", emoji: "💼", color: "#3b82f6" },
  pessoal: { label: "Pessoal", emoji: "🏠", color: "#8b5cf6" },
  estudo: { label: "Estudo", emoji: "📚", color: "#06b6d4" },
  freelance: { label: "Freelance", emoji: "💰", color: "#f59e0b" },
};

const PRIORITY_WEIGHT = { urgente: 4, alta: 3, media: 2, baixa: 1 };

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function StatsBar({ projects }) {
  const active = projects.filter((p) => p.status === "ativo").length;
  const overdue = projects.filter((p) => { const d = daysUntil(p.deadline); return d !== null && d < 0 && p.status === "ativo"; }).length;
  const dueSoon = projects.filter((p) => { const d = daysUntil(p.deadline); return d !== null && d >= 0 && d <= 3 && p.status === "ativo"; }).length;

  const stats = [
    { label: "Ativos", value: active, color: "#22c55e", icon: "🚀" },
    { label: "Atrasados", value: overdue, color: "#ef4444", icon: "🚨" },
    { label: "Vence logo", value: dueSoon, color: "#f59e0b", icon: "⏰" },
    { label: "Total", value: projects.length, color: "#6366f1", icon: "📊" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-100 text-center">
          <div className="text-2xl">{s.icon}</div>
          <div className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</div>
          <div className="text-xs text-slate-400 font-semibold">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ user, onSignOut }) {
  const { projects, loading, createProject, updateProject, deleteProject, refresh } = useProjects(user.id);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [filter, setFilter] = useState("todos");
  const [categoryFilter, setCategoryFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("priority");

  const filtered = useMemo(() => {
    return projects
      .filter((p) => filter === "todos" || p.status === filter)
      .filter((p) => categoryFilter === "todos" || p.category === categoryFilter)
      .sort((a, b) => {
        if (sortBy === "priority") return (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0);
        if (sortBy === "deadline") {
          const da = daysUntil(a.deadline), db = daysUntil(b.deadline);
          if (da === null && db === null) return 0;
          if (da === null) return 1;
          if (db === null) return -1;
          return da - db;
        }
        if (sortBy === "progress") return a.progress - b.progress;
        return 0;
      });
  }, [projects, filter, categoryFilter, sortBy]);

  const overdueProjects = projects.filter((p) => {
    const d = daysUntil(p.deadline);
    return p.status === "ativo" && d !== null && d < 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">⚡</div>
          <p className="text-slate-500 text-sm">Carregando projetos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="text-white" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
        <div className="max-w-4xl mx-auto px-5 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">⚡ FocusFlow</h1>
              <p className="text-sm opacity-80 mt-1">
                Olá, {user.email?.split("@")[0]}! Seus projetos num lugar só.
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button onClick={() => setShowNewProject(true)}
                className="bg-white/20 backdrop-blur border border-white/30 text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-white/30 transition-all">
                + Novo
              </button>
              <button onClick={onSignOut}
                className="bg-white/10 border border-white/20 text-white/80 rounded-xl px-3 py-2 text-xs hover:bg-white/20 transition-all">
                Sair
              </button>
            </div>
          </div>

          {overdueProjects.length > 0 && (
            <div className="mt-3 bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-2 text-sm">
              🚨 <strong>Atenção!</strong> {overdueProjects.length} projeto(s) atrasado(s):{" "}
              {overdueProjects.map((p) => p.title).join(", ")}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-6">
        <StatsBar projects={projects} />

        <div className="flex flex-wrap gap-2 mb-5 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {[
              { key: "todos", label: "Todos" },
              { key: "ativo", label: "🟢 Ativos" },
              { key: "pausado", label: "⏸ Pausados" },
              { key: "concluido", label: "✅ Concluídos" },
            ].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filter === f.key
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                }`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 bg-white">
              <option value="todos">Todas categorias</option>
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>{v.emoji} {v.label}</option>
              ))}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 bg-white">
              <option value="priority">Prioridade</option>
              <option value="deadline">Prazo</option>
              <option value="progress">Progresso</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <div className="text-5xl mb-3">
              {projects.length === 0 ? "✨" : "🔍"}
            </div>
            <p className="text-base">
              {projects.length === 0
                ? "Nenhum projeto ainda. Crie o primeiro!"
                : "Nenhum projeto com esses filtros."}
            </p>
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          userId={user.id}
          onClose={() => setSelectedProject(null)}
          onUpdate={async (id, updates) => {
            const { data } = await updateProject(id, updates);
            if (data) setSelectedProject(data);
          }}
          onDelete={async (id) => {
            await deleteProject(id);
            setSelectedProject(null);
          }}
        />
      )}
      {showNewProject && (
        <NewProjectModal
          onClose={() => setShowNewProject(false)}
          onSave={async (project) => {
            await createProject(project);
            setShowNewProject(false);
          }}
        />
      )}
    </div>
  );
                }
