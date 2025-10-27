"use Client";
import React, { useState } from "react";

export const App: React.FC = () => {
  const [todoText, setTodoText] = useState("");
  const [IncompleteTodos, setIncompleteTodos] = useState<string[]>([]);
  const [completeTodo, setCompleteTodo] = useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoText(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (todoText.trim() !== "") {
      setIncompleteTodos([...IncompleteTodos, todoText]);
      setTodoText("");
    }
  };
  //完了の処理
  const onClickComplete = (todo) => {
    console.log("完了:", todo);
    const newTodos = IncompleteTodos.map((t) => {});
  };

  //削除の処理
  const onClickDelete = (todo) => {
    console.log("削除:", todo);
    const newTodos = IncompleteTodos.filter((t) => t.id !== todo.id);
    setIncompleteTodos(newTodos);
  };

  return (
    <>
      <div onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="TODOを入力"
          value={todoText}
          onChange={handleChange}
        ></input>
        <button>追加</button>
      </div>
      <div>
        <p className="title">未完のTODO</p>
        <ul>
          {
            (IncompleteTodos,
            map(
              (todo = (
                <div key={todo.id} todo={todo}>
                  <div className="list-row">
                    <p className="todo-item">{todo}</p>
                    <button onClick={() => onClickComplete(todo)}>完了</button>
                    <button onClick={() => onClickDelete(todo)}>削除</button>
                  </div>
                </div>
              ))
            ))
          }
          ;
        </ul>
      </div>
      <div>
        <p className="title">完了のTODO</p>
        <ul>
          {completeTodo.map((todo) => (
            <li key={todo}>
              <div className="list-row">
                <p className="todo-item">{todo}</p>
                <button onClick={() => returnTodoText}>戻す</button>
              </div>
            </li>
          ))}
          ;
        </ul>
      </div>
    </>
  );
};
