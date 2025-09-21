import "./styles.css";

export const TOdo = () => {
   const [todoText, setCompleteTodos] = useState({
        "todoです1":
        "todoです2"
        });
   const [completeTodos, setIncompleteTodos] = useState({
        "todoでした1":
        "todoでした2"
        });
       
        const onChangeTodoText = (event) => setTodotext{event.target.value;}


  return (
    <>
      <div className="input-area">
        <input placeholder="TODOを入力" value={todoText} onChenge={/>
        <button>追加</button>
      </div>
         <div className="incomplete-area">"
            <p className="title">未完のTODO</p>
            <ul>
              {incompleteTodos,map((todo) => (
            <li key={todo}>
             <div className="list-row">
                <p className="todo-item">{todo}</p>
                 <button>完了</button>
                 <button>削除</button>
             </div>
            </li>
           ))}
          </ul>
          <div className="complete-area">
            <p className="title">完了のTODO</p>
          </div>
        <ul>
          {completeTodos.map((todo) =>(
          <li key={todo}>
            <div className="list-row">
              <p className="todo-item">{todo}</p>
              <button>戻す</button>
            </div>  
          </li>
          ))}
         </ul> 
      </div>
    </>
  );
};
