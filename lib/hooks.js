"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
  };

  const signInWithEmail = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signUpWithEmail = async (email, password) => {
    return await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    });
  };

  const signOut = async () => { await supabase.auth.signOut(); };

  return { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut };
}

export function useProjects(userId) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("projects").select("*").eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error) setProjects(data || []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = async (project) => {
    const { data, error } = await supabase
      .from("projects").insert([{ ...project, user_id: userId }]).select().single();
    if (!error && data) setProjects((prev) => [data, ...prev]);
    return { data, error };
  };

  const updateProject = async (id, updates) => {
    const { data, error } = await supabase
      .from("projects").update(updates).eq("id", id).select().single();
    if (!error && data) setProjects((prev) => prev.map((p) => (p.id === id ? data : p)));
    return { data, error };
  };

  const deleteProject = async (id) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (!error) setProjects((prev) => prev.filter((p) => p.id !== id));
    return { error };
  };

  return { projects, loading, createProject, updateProject, deleteProject, refresh: fetchProjects };
}

export function useTasks(projectId, userId) {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    const { data } = await supabase
      .from("tasks").select("*").eq("project_id", projectId)
      .order("sort_order", { ascending: true });
    setTasks(data || []);
  }, [projectId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTask = async (title) => {
    const { data } = await supabase
      .from("tasks").insert([{ title, project_id: projectId, user_id: userId, sort_order: tasks.length }])
      .select().single();
    if (data) setTasks((prev) => [...prev, data]);
  };

  const toggleTask = async (taskId, completed) => {
    const { data } = await supabase
      .from("tasks").update({ completed: !completed }).eq("id", taskId).select().single();
    if (data) setTasks((prev) => prev.map((t) => (t.id === taskId ? data : t)));
  };

  const deleteTask = async (taskId) => {
    await supabase.from("tasks").delete().eq("id", taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return { tasks, addTask, toggleTask, deleteTask, refresh: fetchTasks };
}

export function useNotes(projectId, userId) {
  const [notes, setNotes] = useState([]);

  const fetchNotes = useCallback(async () => {
    if (!projectId) return;
    const { data } = await supabase
      .from("quick_notes").select("*").eq("project_id", projectId)
      .order("created_at", { ascending: false });
    setNotes(data || []);
  }, [projectId]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const addNote = async (content) => {
    const { data } = await supabase
      .from("quick_notes").insert([{ content, project_id: projectId, user_id: userId }])
      .select().single();
    if (data) setNotes((prev) => [data, ...prev]);
  };

  const deleteNote = async (noteId) => {
    await supabase.from("quick_notes").delete().eq("id", noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  return { notes, addNote, deleteNote, refresh: fetchNotes };
}