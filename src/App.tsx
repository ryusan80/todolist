"use client";
import React, { useState } from "react";
import type { FormEvent } from "react";

export const App: React.FC = () => {
  const [todoText, setTodoText] = useState("");
  const [incompleteTodos, setIncompleteTodos] = useState<string[]>([]);
  const [completeTodos, setCompleteTodos] = useState<string[]>([]);

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
      <header className="flex-justify-between mx-auto container  text-right">
        <div className="self-auto font-serif italic justify-self-end ml-auto space-x-6">
          <button className="flex-16 bg-emerald-400">signup</button>
          <button className="flex-16 bg-emerald-400">signin</button>
          <button className="flex-16 bg-emerald-400">logout</button>
        </div>
      </header>
      <form onSubmit={handleSubmit}>
        <h1 className="font-serif italic flex text-center">TODOLIST</h1>
        <input
          type="text"
          placeholder="TODOを入力"
          value={todoText}
          onChange={handleChange}
        />
        <button type="submit" className=" bg-green-100 ">
          追加
        </button>
      </form>

      <div className="flex w-1/2 border border-gray-300 rounded p-4 mr-4">
        <p className="text-lg font-semibold mb-2">未完のTODO</p>
        
        <ul>
          {incompleteTodos.map((todo, index) => (
            <li key={index}>
              <div className="list-row">
                <p className="todo-item">{todo}</p>
                <button onClick={() => onClickComplete(index)}>完了</button>
                <button onClick={() => onClickDeleteIncomplete(index)}>
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-1/2 border border-gray-300 rounded p-4 mr-4">
      <p className="text-lg font-semibold mb-2 ">完了のTODO</p>
        <ul>
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
    </>
  );
};
