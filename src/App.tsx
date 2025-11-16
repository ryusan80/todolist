"use client";
import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "./lib/supabaseClient";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  inserted_at?: string;
};

export const App: React.FC = () => {
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  // simple auth state for UI toggling
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignIn = () => setIsSignedIn(true);
  const handleSignUp = () => setIsSignedIn(true);
  const handleLogout = () => setIsSignedIn(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value);
  };

  // fetch todos on mount
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("id, text, completed, inserted_at")
        .order("inserted_at", { ascending: true });
      if (error) return console.error(error);
      setTodos((data as Todo[]) || []);
    })();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = todoText.trim();
    if (text === "") return;
    const { data, error } = await supabase
      .from("todos")
      .insert({ text, completed: false })
      .select("id, text, completed, inserted_at")
      .single();
    if (error) return console.error(error);
    setTodos((prev) => [...prev, data as Todo]);
    setTodoText("");
  };

  const onClickComplete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ completed: true })
        .eq("id", id);
      if (error) throw error;
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const onClickDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const onClickEdit = (id: string) => {
    const t = todos.find((x) => x.id === id);
    if (!t) return;
    setEditingId(id);
    setEditingText(t.text);
  };

  const handleSaveEdit = async (id: string) => {
    const text = editingText.trim();
    if (text === "") return;
    try {
      const { error } = await supabase
        .from("todos")
        .update({ text })
        .eq("id", id);
      if (error) throw error;
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
      setEditingId(null);
      setEditingText("");
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const onClickReturn = async (id: string) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ completed: false })
        .eq("id", id);
      if (error) throw error;
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: false } : t))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <header className="w-full fixed top-0 left-0 z-20 bg-white/50 dark:bg-black/50 backdrop-blur">
        <div className="w-full flex justify-end items-center p-4">
          <div className="flex items-center gap-3 font-serif italic">
            {isSignedIn ? (
              <button
                className="px-3 py-1 bg-emerald-400 rounded"
                onClick={handleLogout}
              >
                logout
              </button>
            ) : (
              <>
                <button
                  className="px-3 py-1 bg-emerald-400 rounded"
                  onClick={handleSignUp}
                >
                  signup
                </button>
                <button
                  className="px-3 py-1 bg-emerald-400 rounded"
                  onClick={handleSignIn}
                >
                  signin
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "80px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <h1 className="font-serif italic text-3xl mb-4">TODOLIST</h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "824px",
            }}
          >
            <input
              type="text"
              placeholder="TODOを入力"
              value={todoText}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border rounded shadow-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-shadow"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-emerald-500 text-white font-serif italic"
            >
              追加
            </button>
          </div>
        </form>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "24px",
            marginTop: "24px",
            height: "calc(100vh - 14rem)",
            width: "824px",
          }}
        >
          <div
            className="border border-green-300 rounded p-4 flex flex-col bg-white"
            style={{ height: "100%", width: "400px", minWidth: "400px" }}
          >
            <p className="text-lg font-bold mb-3 text-gray-900 bg-green-100 px-2 py-1 rounded">
              未完のTODO
            </p>
            <div className="overflow-auto w-full flex-1">
              <ul className="space-y-2">
                {todos
                  .filter((t) => !t.completed)
                  .map((todo) => (
                    <li key={todo.id}>
                      <div className="flex items-center gap-2">
                        {editingId === todo.id ? (
                          <>
                            <input
                              className="flex-1 px-2 py-1 border rounded shadow-sm focus:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-200 transition-shadow"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                            />
                            <button
                              className="px-2 py-1 bg-blue-500 text-white rounded"
                              onClick={() => handleSaveEdit(todo.id)}
                            >
                              保存
                            </button>
                            <button
                              className="px-2 py-1 bg-gray-300 rounded"
                              onClick={handleCancelEdit}
                            >
                              キャンセル
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="flex-1 break-words pr-2 min-w-0">
                              {todo.text}
                            </p>
                            <div className="flex gap-1 shrink-0">
                              <button
                                className="px-2 py-1 bg-green-500 text-white rounded text-sm whitespace-nowrap"
                                onClick={() => onClickComplete(todo.id)}
                              >
                                完了
                              </button>
                              <button
                                className="px-2 py-1 bg-blue-500 text-white rounded text-sm whitespace-nowrap"
                                onClick={() => onClickEdit(todo.id)}
                              >
                                編集
                              </button>
                              <button
                                className="px-2 py-1 bg-red-500 text-white rounded text-sm whitespace-nowrap"
                                onClick={() => onClickDelete(todo.id)}
                              >
                                削除
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div
            className="border border-green-300 rounded p-4 flex flex-col bg-white"
            style={{ height: "100%", width: "400px", minWidth: "400px" }}
          >
            <p className="text-lg font-bold mb-3 text-gray-900 bg-green-100 px-2 py-1 rounded">
              完了のTODO
            </p>
            <div className="overflow-auto w-full flex-1">
              <ul className="space-y-2">
                {todos
                  .filter((t) => t.completed)
                  .map((todo) => (
                    <li key={todo.id}>
                      <div className="flex items-center gap-2">
                        <p className="flex-1 break-words pr-2 min-w-0">
                          {todo.text}
                        </p>
                        <div className="flex gap-1 shrink-0">
                          <button
                            className="px-2 py-1 bg-yellow-500 text-white rounded text-sm whitespace-nowrap"
                            onClick={() => onClickReturn(todo.id)}
                          >
                            戻す
                          </button>
                          <button
                            className="px-2 py-1 bg-red-500 text-white rounded text-sm whitespace-nowrap"
                            onClick={() => onClickDelete(todo.id)}
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
