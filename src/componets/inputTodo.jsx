export const InputTOdo = () => {
    return (
 <div className="input-area">
            <input placeholder="TODOを入力" value={todoText} onCheng={("")} />
            <button onClick={onClickAdd}>追加</button>
        </div>
    );
};