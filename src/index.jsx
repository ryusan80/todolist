import ReactDom from "react-dom";
import React, { useState } from "react";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoId, setTodoId] = useState(todos.length + 1);
  const handleAddFormChanges = (e) => {
    setTodoTitle(e.target.value);
  };

  const handleAddTodo = () => {
    setTodos([...todos, { id: todoId, title: todoTitle }]);
    setTodos(todoId + 1);
    setTodoTitle("");
  };

  const handleDeleteTOdo = (targetTodo) => {
    setTodos(todo.filter((todo) => todo !== targetTodo));
  };

  return (
    <>
      <div>
        <input
          type="text"
          label="タイトル"
          value={todoTitle}
          onchange={handleAddFormChanges}
        />
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>
            <button onClick={() => handleDeleteTOdo(todo)}>削除</button>
          </li>
        ))}
      </ul>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
