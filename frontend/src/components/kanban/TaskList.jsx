import { TaskListItem } from "./TaskListItem";


export function TaskList({ tasks, editingTaskId, onEdit, onDelete, onUpdate, onCancelEdit, }) {

    
  return (
    <ul className="task-items">
      {tasks.map((task) => (
        <TaskListItem
          key={task.id}
          task={task}
          editingTaskId={editingTaskId}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdate={onUpdate}
          onCancelEdit={onCancelEdit}
        />
      ))}
    </ul>
  )
}