"use client";
import { useState } from "react";
import { useTasks, useNotes } from "../lib/hooks";

const CATEGORIES = {
  trabalho: { label: "Trabalho", emoji: "\uD83D\uDCBC", color: "#3b82f6" },
  pessoal: { label: "Pessoal", emoji: "\uD83C\uDFE0", color: "#8b5cf6" },
  estudo: { label: "Estudo", emoji: "\uD83D\uDCDA", color: "#06b6d4" },
  freelance: { label: "Freelance", emoji: "\uD83D\uDCB0", color: "#f59e0b" },
};

const STATUS_OPTIONS = [
  { key: "ativo", label: "\uD83D\uDFE2 Ativo" },
  { key: "pausado", label: "\u23F8 Pausado" },
  { key: "concluido", label: "\u2705 Conclu\u00EDdo" },
  { key: "arquivado", label: "\uD83D\uDCE6 Arquivado" },
];

export default function ProjectModal({ project, userId, onClose, onUpdate, onDelete }) {
  const { tasks, addTask, toggleTask, deleteTask } = useTasks(project.id, userId);
  const { notes, addNote, deleteNote } = useNotes(project.id, userId);
  const [tab, setTab] = useState("tasks");
  const [newTask, setNewTask] = useState("");
  const [newNote, setNewNote] = useState("");
  const [contextNote, setContextNote] = useState(project.context_note || "");
  const [editingContext, setEditingContext] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    await addTask(newTask.trim());
    setNewTask("");
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    await addNote(newNote.trim());
    setNewNote("");
  };

  const handleSaveContext = async () => {
    await onUpdate(project.id, { context_note: contextNote });
    setEditingContext(false);
  };

  const handleStatusChange = async (newStatus) => {
    await onUpdate(project.id, { status: newStatus });
  };

  const color = project.color || "#6366f1";
  const cat = CATEGORIES[project.category] || CATEGORIES.pessoal;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-auto shadow-2xl">

        <div className="p-5 border-b border-slate-100" style={{ borderLeft: \`5px solid \${color}\` }}>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex gap-1.5 flex-wrap mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: cat.color + "18", color: cat.color }}>
                  {cat.emoji} {cat.label}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">{project.title}</h2>
              {project.description && <p className="text-sm text-slate-500 mt-1">{project.description}</p>}
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl bg-transparent border-none cursor-pointer p-1">
              \u00D7
            </button>
          </div>

          <div className="flex gap-1.5 mt-3 flex-wrap">
            {STATUS_OPTIONS.map((s) => (
              <button key={s.key} onClick={() => handleStatusChange(s.key)}
                className={\`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer \${
                  project.status === s.key
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                }\`}>
                {s.label}
              </button>
            ))}
          </div>

          <div className="mt-3">
            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: \`\${project.progress}%\`, background: color }} />
            </div>
            <div className="text-xs text-slate-400 mt-1">{project.progress}% completo</div>
          </div>
        </div>

        <div className="px-5 py-3 bg-amber-50 border-b border-amber-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-amber-800">\uD83E\uDDE0 Onde eu parei</span>
            <button onClick={() => setEditingContext(!editingContext)}
              className="text-xs font-semibold text-amber-600 bg-transparent border-none cursor-pointer hover:underline">
              {editingContext ? "Cancelar" : "Editar"}
            </button>
          </div>
          {editingContext ? (
            <div className="flex gap-2">
              <input value={contextNote} onChange={(e) => setContextNote(e.target.value)}
                placeholder="Ex: Parei no componente X, pr\u00F3ximo: fazer Y..."
                className="flex-1 px-3 py-2 rounded-lg border border-amber-200 text-sm bg-white outline-none" />
              <button onClick={handleSaveContext}
                className="bg-amber-500 text-white border-none rounded-lg px-3 py-2 text-sm font-semibold cursor-pointer">
                Salvar
              </button>
            </div>
          ) : (
            <p className="text-sm text-amber-900 m-0">
              {project.context_note || "Nenhuma nota. Clique em editar para adicionar."}
            </p>
          )}
        </div>

        <div className="flex border-b border-slate-100">
          {[
            { key: "tasks", label: \`\u2705 Tarefas (\${tasks.length})\` },
            { key: "notes", label: \`\uD83D\uDCDD Notas (\${notes.length})\` },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex-1 py-3 text-xs font-semibold border-none cursor-pointer transition-all"
              style={{
                background: tab === t.key ? "#f8fafc" : "#fff",
                color: tab === t.key ? color : "#94a3b8",
                borderBottom: tab === t.key ? \`2px solid \${color}\` : "2px solid transparent",
              }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "tasks" && (
            <>
              <div className="flex gap-2 mb-3">
                <input value={newTask} onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Nova tarefa..." onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-300" />
                <button onClick={handleAddTask} style={{ background: color }}
                  className="text-white border-none rounded-lg px-3 py-2 text-sm font-bold cursor-pointer">+</button>
              </div>
              <div className="space-y-1">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 group">
                    <div onClick={() => toggleTask(task.id, task.completed)}
                      className="w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer shrink-0 transition-all"
                      style={{
                        borderColor: task.completed ? color : "#d1d5db",
                        background: task.completed ? color : "#fff",
                      }}>
                      {task.completed && <span className="text-white text-xs">\u2713</span>}
                    </div>
                    <span className={\`text-sm flex-1 \${task.completed ? "text-slate-400 line-through" : "text-slate-700"}\`}>
                      {task.title}
                    </span>
                    <button onClick={() => deleteTask(task.id)}
                      className="text-slate-300 hover:text-red-400 bg-transparent border-none cursor-pointer text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      \u2715
                    </button>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-6">Nenhuma tarefa. Adicione uma acima!</p>
                )}
              </div>
            </>
          )}

          {tab === "notes" && (
            <>
              <div className="flex gap-2 mb-3">
                <input value={newNote} onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Nota r\u00E1pida..." onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-indigo-300" />
                <button onClick={handleAddNote} style={{ background: color }}
                  className="text-white border-none rounded-lg px-3 py-2 text-sm font-bold cursor-pointer">+</button>
              </div>
              <div className="space-y-2">
                {notes.map((note) => (
                  <div key={note.id} className="bg-slate-50 rounded-lg p-3 group" style={{ borderLeft: \`3px solid \${color}\` }}>
                    <div className="flex justify-between">
                      <p className="text-sm text-slate-700 m-0">{note.content}</p>
                      <button onClick={() => deleteNote(note.id)}
                        className="text-slate-300 hover:text-red-400 bg-transparent border-none cursor-pointer text-xs opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                        \u2715
                      </button>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(note.created_at).toLocaleDateString("pt-BR")}</span>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-center text-slate-400 text-sm py-6">Nenhuma nota. Adicione uma acima!</p>
                )}
              </div>
            </>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100">
            {showDelete ? (
              <div className="flex gap-2 items-center justify-center">
                <span className="text-xs text-red-500 font-semibold">Tem certeza?</span>
                <button onClick={() => onDelete(project.id)}
                  className="bg-red-500 text-white border-none rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer">
                  Sim, deletar
                </button>
                <button onClick={() => setShowDelete(false)}
                  className="bg-slate-100 text-slate-500 border-none rounded-lg px-3 py-1.5 text-xs cursor-pointer">
                  Cancelar
                </button>
              </div>
            ) : (
              <button onClick={() => setShowDelete(true)}
                className="text-xs text-slate-400 hover:text-red-400 bg-transparent border-none cursor-pointer w-full text-center">
                \uD83D\uDDD1 Deletar projeto
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}