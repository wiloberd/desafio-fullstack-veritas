import { apiClient } from './apiClient';

export const taskService = {
  getAllTasks: () => apiClient('/tasks'),
  
  createTask: (taskData) => apiClient('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),
  
  updateTask: (id, taskData) => apiClient(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  }),
  
  deleteTask: (id) => apiClient(`/tasks/${id}`, {
    method: 'DELETE',
  }),
};