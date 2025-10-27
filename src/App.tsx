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
  const onClickDelete = (index: number) => {
    setIncompleteTodos((prev) => prev.filter((_, i) => i !== index));
  };

  // 完了リストから未完へ戻す
  const onClickReturn = (index: number) => {
    const todo = completeTodos[index];
    setCompleteTodos((prev) => prev.filter((_, i) => i !== index));
    setIncompleteTodos((prev) => [...prev, todo]);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="TODOを入力"
          value={todoText}
          onChange={handleChange}
        />
        <button type="submit">追加</button>
      </form>

      <div>
        <p className="title">未完のTODO</p>
        <ul>
          {incompleteTodos.map((todo, index) => (
            <li key={index}>
              <div className="list-row">
                <p className="todo-item">{todo}</p>
                <button onClick={() => onClickComplete(index)}>完了</button>
                <button onClick={() => onClickDelete(index)}>削除</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="title">完了のTODO</p>
        <ul>
          {completeTodos.map((todo, index) => (
            <li key={index}>
              <div className="list-row">
                <p className="todo-item">{todo}</p>
                <button onClick={() => onClickReturn(index)}>戻す</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
