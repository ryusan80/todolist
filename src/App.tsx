import "./styles.css";
import { useState } from "react"
export default function App() {
    const [tooText, setTodoText] = useState("");
    const [incompleteTodos, setIncompleteTOdos] = useState ([
    ]);
    const [completeTodos, SetIncompleteTOdos] = useState ([
    ]);

    const onChengTodoText = (event) => setIncompleteTOdos(event.target.value);
    
    const onClickAdd = () => {
        if (todoText ==="") return;
        const newTodos = [...incompleteTodos, todoText];
        setIncompleteTOdos(newTodos);
        setTodoText("");
    };

    const onClickDelete = (index) => {
        const newTodos = [...incompleteTodos];
        newTodos.splice(index,1);
        setIncompleteTOdos(newTOdos);
    };

    const onClickComplete = (index) => {
         const newIncompleteTodos = [...incompleteTodos];
        newTodos.splice(index,1);

        const newCompleteTodos = [...completeTOdos, incompleteTOdos[index]];
        setIncompleteTOdos(newIncompleteTOdos);
        setCompleteTodos(newCompleteTOdos);
    };

    const onClickBac= (index) => {
const newCompleteTodos = [...completeTodos];
newCompleteTOdos.splice(index,1);

const newCompleteTOdos = [...incompleteTodos, completeTodos[index]];
 setCompleteTodos(newCompleteTOdos);
 setIncompleteTOdos(newIncompleteTOdos);
    }
    return (
        <>
       <inputTodo/>
        <div className="input-area">
            <p className="title">未完了のTODO</p>
            <ul>
            {incompleteTodos.map((todo, index) => (
            
                <li key={todo}>
                 <div className="list-row">
                    <p className="todo-item">{TODO}</p>
                    <button onClick={() => onClickComplete(index)}>完了</button>
                    <button onClick={() => onClickDelete(index)}>削除</button>
                 </div>
                </li>
        ))}
                <li>
                    <div className="list-row">
                     <p className="todo-item">TODOです</p>
                     <button>完了</button>
                     <button>削除</button>
                    </div>
                </li>
            </ul>
        </div>
        <div className="input-area"> 
            <p className="title">未完了のTODO</p>
            <ul>
                {completeTOdos.map((todo,index) => (
              <li key={todo}>
                <div className="List-row">
                    <p className="Todo-item">TODOでした</p>
                    <button onClick={() => onClickBack(index)}>戻す</button>
                    <p className="todo-item">TODOでした</p>
                    <button>戻す</button>
                </div>
              </li>
             ))}
            </ul>   
        </div>
    </>    
)}