
export function TaskCard({ task, onEdit, onDelete }) {


  const handleDragStart = (e) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  return (
    <li className="task-item"
      draggable 
      onDragStart={handleDragStart} 
      style={{ cursor: 'grab' }} // Deixa o mouse com ícone de mãozinha
    >
      <div className="task-item-box">
        <div className="task-item-header-box">
          <h3>{task?.title}</h3>
          <div className="task-item-actions">
            <button
              type="button"
              className="task-item-btn"
              aria-label="Editar tarefa"
              onClick={() => onEdit?.(task)}>
              ✏️
            </button>
            <button
              type="button"
              className="task-item-btn"
              aria-label="Excluir tarefa"
              onClick={() => onDelete?.(task?.id)}>
              ❌
            </button>
          </div>
        </div>

        {task?.description && (
          <div className="task-item-description-box">
            <p>{task?.description}</p>
          </div>
        )}
      </div>
    </li>
  );
}