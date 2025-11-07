"use client";
import React, { useState } from "react";
import type { FormEvent } from "react";

export const App: React.FC = () => {
  const [todoText, setTodoText] = useState("");
  const [incompleteTodos, setIncompleteTodos] = useState<string[]>([]);
  const [completeTodos, setCompleteTodos] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = todoText.trim();
    if (text !== "") {
      setIncompleteTodos((prev) => [...prev, text]);
      setTodoText("");
    }
  };

  // 完了に移動
  const onClickComplete = (index: number) => {
    const todo = incompleteTodos[index];
    setIncompleteTodos((prev) => prev.filter((_, i) => i !== index));
    setCompleteTodos((prev) => [...prev, todo]);
  };

  // 未完リストから削除
  const onClickDeleteIncomplete = (index: number) => {
    setIncompleteTodos((prev) => prev.filter((_, i) => i !== index));
  };
  //編集モードに切り替え
  const onClickEdit = (index: number) => {
    setEditingIndex(index);
    setEditingText(incompleteTodos[index]);
  };
  //入力の変更を受ける
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(e.target.value);
  };
  //編集内容を確定し配列を更新
  const handleSaveEdit = (index: number) => {
    const text = editingText.trim();
    if (text === "") return;
    setIncompleteTodos((prev) => prev.map((t, i) => (i === index ? text : t)));
    setEditingIndex(null);
    setEditingText("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingText("");
  };

  // 完了リストから未完へ戻す
  const onClickReturn = (index: number) => {
    const todo = completeTodos[index];
    setCompleteTodos((prev) => prev.filter((_, i) => i !== index));
    setIncompleteTodos((prev) => [...prev, todo]);
  };
  // 完了リストで削除
  const onClickDeleteComplete = (index: number) => {
    setCompleteTodos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <header className="w-full fixed top-0 left-0 z-20 bg-white/50 dark:bg-black/50 backdrop-blur">
        <div className="w-full flex justify-end items-center p-4">
          <div className="flex items-center gap-3 font-serif italic">
            <button className="px-3 py-1 bg-emerald-400 rounded">signup</button>
            <button className="px-3 py-1 bg-emerald-400 rounded">signin</button>
            <button className="px-3 py-1 bg-emerald-400 rounded">logout</button>
          </div>
        </div>
      </header>
      <form
        onSubmit={handleSubmit}
        className="mt-20 justify-center items-center text-center"
      >
        <h1 className="font-serif italic flex mih-h-[calc(100vh-4rem)] ">
          TODOLIST
        </h1>
        <div className="flex items-center gap-3 ">
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

      <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-6 mt-6">
        <div className="w-full md:w-1/2 border border-green-300 rounded p-4 h-48 flex flex-col">
          <p className="title text-left font-semibold mb-2">未完のTODO</p>
          <div className="overflow-auto w-full">
            <ul className="space-y-2">
              {incompleteTodos.map((todo, index) => (
                <li key={index}>
                  <div className="flex items-center gap-2">
                    {editingIndex === index ? (
                      <>
                        <input
                          className="flex-1 px-2 py-1 border rounded shadow-sm focus:shadow-md focus:outline-none focus:ring-1 focus:ring-emerald-200 transition-shadow"
                          value={editingText}
                          onChange={handleEditChange}
                        />
                        <button
                          className="px-2 py-1 bg-blue-500 text-white rounded"
                          onClick={() => handleSaveEdit(index)}
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
                        <p className="todo-item flex-1">{todo}</p>
                        <button onClick={() => onClickComplete(index)}>
                          完了
                        </button>
                        <button onClick={() => onClickEdit(index)}>編集</button>
                        <button onClick={() => onClickDeleteIncomplete(index)}>
                          削除
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full md:w-1/2 border border-green-300 rounded p-4 h-48 flex flex-col">
          <p className="title text-left font-semibold mb-2">完了のTODO</p>
          <div className="overflow-auto w-full">
            <ul className="space-y-2">
              {completeTodos.map((todo, index) => (
                <li key={index}>
                  <div className="list-row">
                    <p className="todo-item">{todo}</p>
                    <button onClick={() => onClickReturn(index)}>戻す</button>
                    <button onClick={() => onClickDeleteComplete(index)}>
                      削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
