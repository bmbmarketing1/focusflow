"use client";

const CATEGORIES = {
  trabalho: { label: "Trabalho", emoji: "💼", color: "#3b82f6" },
  pessoal: { label: "Pessoal", emoji: "🏠", color: "#8b5cf6" },
  estudo: { label: "Estudo", emoji: "📚", color: "#06b6d4" },
  freelance: { label: "Freelance", emoji: "💰", color: "#f59e0b" },
};

const STATUS_CONFIG = {
  ativo: { label: "Ativo", color: "#22c55e", bg: "#dcfce7" },
  pausado: { label: "Pausado", color: "#f59e0b", bg: "#fef3c7" },
  concluido: { label: "Concluído", color: "#6366f1", bg: "#e0e7ff" },
  arquivado: { label: "Arquivado", color: "#94a3b8", bg: "#f1f5f9" },
};

const PRIORITY_CONFIG = {
  urgente: { label: "🔴 Urgente" },
  alta: { label: "🟠 Alta" },
  media: { label: "🟡 Média" },
  baixa: { label: "🟢 Baixa" },
};

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

function DeadlineBadge({ deadline }) {
  const days = daysUntil(deadline);
  if (days === null) return <span className="text-slate-400 text-xs">Sem prazo</span>;
  let color = "#22c55e", bg = "#dcfce7", text = `${days}d restantes`;
  if (days < 0) { color = "#ef4444"; bg = "#fee2e2"; text = `${Math.abs(days)}d atrasado!`; }
  else if (days <= 3) { color = "#ef4444"; bg = "#fee2e2"; text = days === 0 ? "HOJE!" : `${days}d — corre!`; }
  else if (days <= 7) { color = "#f59e0b"; bg = "#fef3c7"; }
  return (
    <span style={{ background: bg, color, padding: "2px 8px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
      ⏰ {text}
    </span>
  );
}

export default function ProjectCard({ project, onClick }) {
  const cat = CATEGORIES[project.category] || CATEGORIES.pessoal;
  const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.ativo;
  const priority = PRIORITY_CONFIG[project.priority] || PRIORITY_CONFIG.media;
  const days = daysUntil(project.deadline);
  const isOverdue = days !== null && days < 0;

  return (
    <div onClick={onClick}
      className={`bg-white rounded-2xl p-5 cursor-pointer border-2 transition-all hover:shadow-lg hover:-translate-y-0.5 ${
        isOverdue ? "border-red-200 overdue-card" : "border-slate-100 hover:border-slate-200"
      }`}
      style={{ borderLeft: `5px solid ${project.color || "#6366f1"}` }}>

      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: cat.color + "18", color: cat.color }}>
            {cat.emoji} {cat.label}
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: status.bg, color: status.color }}>
            {status.label}
          </span>
        </div>
        <span className="text-xs opacity-60">{priority.label}</span>
      </div>

      <h3 className="text-base font-bold text-slate-800 mb-0.5">{project.title}</h3>
      {project.description && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-1">{project.description}</p>
      )}

      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${project.progress}%`, background: project.color || "#6366f1" }} />
        </div>
        <span className="text-xs font-bold min-w-[32px] text-right" style={{ color: project.color || "#6366f1" }}>
          {project.progress}%
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-400">
          {project.context_note ? "🧠 Tem nota de contexto" : ""}
        </span>
        <DeadlineBadge deadline={project.deadline} />
      </div>

      {project.context_note && (
        <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-800">
          <strong>Onde parei:</strong> {project.context_note.slice(0, 80)}
          {project.context_note.length > 80 ? "..." : ""}
        </div>
      )}
    </div>
  );
}
