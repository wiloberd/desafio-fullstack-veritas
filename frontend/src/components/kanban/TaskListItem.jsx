import { TaskCard } from "./TaskCard"
import { TaskUpdateForm } from "./TaskUpdateForm"

export function TaskListItem({task, editingTaskId, onEdit, onDelete, onUpdate, onCancelEdit, }) {
  const isEditing = editingTaskId === task.id

  // Se a tarefa estiver em edição, renderiza o formulário no lugar do card (ou abaixo dele)
  if (isEditing) {
    
    return (
      <TaskUpdateForm
        task={task}
        onUpdate={onUpdate}
        onCancel={onCancelEdit}
      />
    )
  }

  return (
    <TaskCard
      task={task}
      onEdit={() => onEdit(task.id)}
      onDelete={onDelete}
    />
  )
}