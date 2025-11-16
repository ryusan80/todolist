"use client";
import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "./lib/supabaseClient";
import { signIn, signUp, signOut, getCurrentUser } from "./lib/auth";

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

  // Auth state
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Check if user is already signed in on mount
  useEffect(() => {
    (async () => {
      try {
        console.log("Checking for existing user session...");
        const user = await getCurrentUser();
        console.log("Current user:", user);
        if (user) {
          setIsSignedIn(true);
          console.log("User is signed in:", user.email);
        } else {
          console.log("No user session found");
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        // If there's an error, assume not signed in
        setIsSignedIn(false);
      }
    })();
  }, []);

  const handleAuthSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError("");

    console.log("Auth attempt:", authMode, "Email:", email);

    if (authMode === "signup") {
      const { data, error } = await signUp(email, password);
      console.log("SignUp result:", { data, error });
      console.log("SignUp data details:", JSON.stringify(data, null, 2));
      console.log("SignUp error details:", JSON.stringify(error, null, 2));

      if (error) {
        let errorMsg = error.message;
        if (error.message.includes("already registered")) {
          errorMsg =
            "このメールアドレスは既に登録されています。ログインしてください。";
        }
        setAuthError(`登録エラー: ${errorMsg}`);
      } else if (data?.user) {
        console.log("User created:", data.user);
        console.log("Email confirmed at:", data.user.email_confirmed_at);
        console.log("Session:", data.session);

        // Check if email confirmation is required
        if (data.session) {
          // Session exists, email confirmation not required or already confirmed
          console.log("Session exists, signing in automatically");
          setIsSignedIn(true);
          setShowAuthForm(false);
          setEmail("");
          setPassword("");
        } else {
          // Email confirmation required
          console.log("No session, email confirmation required");
          setAuthError(
            "確認メールを送信しました。メールを確認してからログインしてください。"
          );
          setShowAuthForm(false);
          setEmail("");
          setPassword("");
        }
      } else {
        setAuthError(
          "登録は完了しましたが、メール確認が必要な場合があります。"
        );
        setShowAuthForm(false);
        setEmail("");
        setPassword("");
      }
    } else {
      const { data, error } = await signIn(email, password);
      console.log("SignIn result:", { data, error });
      console.log("Full error object:", JSON.stringify(error, null, 2));
      if (error) {
        // Display more specific error messages
        let errorMsg = error.message;
        if (error.message.includes("Invalid login credentials")) {
          errorMsg = "メールアドレスまたはパスワードが正しくありません";
        } else if (error.message.includes("Email not confirmed")) {
          errorMsg =
            "⚠️ メールアドレスが確認されていません\n\n解決方法:\n1. 受信したメール内の確認リンクをクリック\n2. または、Supabaseダッシュボードで「Confirm email」設定をOFFにしてください";
        }
        setAuthError(`${errorMsg}`);
        console.error("Login error details:", error);
      } else if (data?.user) {
        console.log("Login successful, user:", data.user);
        setIsSignedIn(true);
        setShowAuthForm(false);
        setEmail("");
        setPassword("");
      } else {
        setAuthError("ログインに失敗しました。データが取得できませんでした。");
      }
    }
  };

  const handleSignInClick = () => {
    setAuthMode("signin");
    setShowAuthForm(true);
    setAuthError("");
  };

  const handleSignUpClick = () => {
    setAuthMode("signup");
    setShowAuthForm(true);
    setAuthError("");
  };

  const handleLogout = async () => {
    await signOut();
    setIsSignedIn(false);
    setTodos([]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value);
  };

  // fetch todos on mount (only if signed in)
  useEffect(() => {
    if (!isSignedIn) {
      console.log("Not signed in, skipping todo fetch");
      return;
    }

    console.log("Fetching todos...");
    (async () => {
      try {
        const { data, error } = await supabase
          .from("todos")
          .select("id, text, completed, inserted_at")
          .order("inserted_at", { ascending: true });
        if (error) {
          console.error("Error fetching todos:", error);
          return;
        }
        console.log("Todos fetched:", data?.length || 0);
        setTodos((data as Todo[]) || []);
      } catch (err) {
        console.error("Unexpected error fetching todos:", err);
      }
    })();
  }, [isSignedIn]);

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
                  onClick={handleSignUpClick}
                >
                  signup
                </button>
                <button
                  className="px-3 py-1 bg-emerald-400 rounded"
                  onClick={handleSignInClick}
                >
                  signin
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthForm && (
        <div className="fixed inset-0 bg-black/50 z-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-96 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              {authMode === "signin" ? "ログイン" : "新規登録"}
            </h2>
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="6文字以上"
                />
              </div>
              {authError && (
                <div
                  className={`text-sm whitespace-pre-wrap ${
                    authError.includes("確認メール") ||
                    authError.includes("成功")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {authError}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-500 text-white py-2 rounded-md hover:bg-emerald-600 transition-colors"
                >
                  {authMode === "signin" ? "ログイン" : "登録"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthForm(false);
                    setAuthError("");
                    setEmail("");
                    setPassword("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isSignedIn ? (
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
      ) : (
        <div
          className="flex flex-col items-center justify-center"
          style={{ marginTop: "120px" }}
        >
          <h1 className="font-serif italic text-4xl mb-6 text-gray-800">
            TODOLIST
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            TODOリストを使用するにはログインしてください
          </p>
          <div className="flex gap-4">
            <button
              className="px-6 py-3 bg-emerald-500 text-white text-lg rounded-lg hover:bg-emerald-600 transition-colors"
              onClick={handleSignUpClick}
            >
              新規登録
            </button>
            <button
              className="px-6 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition-colors"
              onClick={handleSignInClick}
            >
              ログイン
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
