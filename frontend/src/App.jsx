import { useEffect, useState } from 'react'
import './App.css'
import logo from './assets/logo.png'
import { TaskCreateForm } from './components/kanban/TaskCreateForm'
import { TaskList } from './components/kanban/TaskList'
import { taskService } from './services/api'

function App() {
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const todo = tasks.filter((task) => task?.status === 'todo')
  const progress = tasks.filter((task) => task?.status === 'in_progress')
  const done = tasks.filter((task) => task?.status === 'done')


  const handleCreateTask = async (taskData) => {
    const newTaskPayload = {
      title: taskData.title,
      description: taskData.description,
    };

    try {
      
      const createdTask = await taskService.createTask(newTaskPayload);
      
      // Atualiza o estado adicionando a nova tarefa no final da lista
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      
    } catch (error) {
      const backendError = error.payload?.error || error.payload?.message;
      
      const messageCombined = `${backendError} (Status Code: ${error.status})`

      // Se não vier mensagem do backend, usa uma mensagem fallback com o status
      const mensagemFinal = backendError ? messageCombined : `Falha na requisição (Status: ${error.status})`;
      
      alert('Erro ao criar tarefa: ' + mensagemFinal);

      throw error;
    }
  };


  const handleUpdateTask = async (updatedTask) => {
     const newTaskPayload = {
      title: updatedTask.title,
      description: updatedTask.description,
      // status: "in_progress",
    };

    
    try {
      const tarefaSalva = await taskService.updateTask(updatedTask.id, newTaskPayload);
      
      // 2. Atualiza o array na tela
      setTasks((prevTasks) => 
        prevTasks.map((t) => (t.id === updatedTask.id ? tarefaSalva : t))
      );

      setEditingTaskId(null);

    } catch (error) {
      const backendError = error.payload?.error || error.payload?.message;
      alert('Erro ao atualizar tarefa: ' + (backendError || `Status: ${error.status}`));
      
      throw error; 
    }
  };


  const handleDeleteTask = async (id) => {

    // PopUp para confirmar antes de exluir a tarefa permanente
    const confirmacao = window.confirm("Tem certeza que deseja excluir esta tarefa?");
    if (!confirmacao) return;

    try {
      await taskService.deleteTask(id);
      
      // 2. Remove o card da tela instantaneamente filtrando o array
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      
    } catch (error) {
      const backendError = error.payload?.error || error.payload?.message;
      alert('Erro ao excluir tarefa: ' + (backendError || `Status: ${error.status}`));
    }
  };


  const handleReadTask = async () => {
    try {
      setLoading(true);

      // Pausa artificial de 2s de test do loading
      await new Promise(resolve => setTimeout(resolve, 2000));

      const data = await taskService.getAllTasks();

      // Se a sua API Go devolve null quando está vazia, garantimos um array vazio:
      setTasks(data || []); 
    } catch (err) {
      setError('Não foi possível carregar o quadro de tarefas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleReadTask();
  }, []);
  

  if (loading) return <div>Carregando quadro...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return ( 
    <>
      <main className="app">
        <header className="app-header">
          <div className="kanban-header">
              <div className="app-brand">
                <span className="app-logo"><img src={logo} alt="Logo generica da aplicação" /></span>
              </div>

              <div className='kanban-title'>
                <h1>Processo Seletivo Estágio Full Stack</h1>
                <p>
                  Desafio técnico — Mini Kanban de tarefas desenvolvido
                  com React e Go.
                </p>
              </div>
          </div>
        </header>

        <section className="kanban-board">
          <div className="kanban-column">
            <div className="column-header column-header-todo">
              <div>
                <h2>A Fazer</h2>
                <p className="task-count">{todo.length} tarefas</p>
              </div>
            </div>

             <div className="column-content">
                  <TaskCreateForm onSubmit={handleCreateTask} />

                  <TaskList
                    tasks={todo}
                    editingTaskId={editingTaskId}
                    onEdit={(id) => setEditingTaskId(id)}
                    onDelete={handleDeleteTask}
                    onUpdate={handleUpdateTask}
                    onCancelEdit={() => setEditingTaskId(null)}
                  />
              </div>
          </div>

          <div className="kanban-column">
            <div className="column-header column-header-progress">
              <div>
                <h2>Em Progresso</h2>
                <p className="task-count">{progress.length} tarefas</p>
              </div>
            </div>

            <div className="column-content">
                <TaskList
                    tasks={progress}
                    editingTaskId={editingTaskId}
                    onEdit={(id) => setEditingTaskId(id)}
                    onDelete={handleDeleteTask}
                    onUpdate={handleUpdateTask}
                    onCancelEdit={() => setEditingTaskId(null)}
                  />
            </div>
          </div>

          <div className="kanban-column">
            <div className="column-header column-header-done">
              <div>
                <h2>Concluído</h2>
                  <p className="task-count">{done.length} tarefas</p>
              </div>
            </div>

            <div className="column-content">
                <TaskList
                    tasks={done}
                    editingTaskId={editingTaskId}
                    onEdit={(id) => setEditingTaskId(id)}
                    onDelete={handleDeleteTask}
                    onUpdate={handleUpdateTask}
                    onCancelEdit={() => setEditingTaskId(null)}
                  />
              </div>
            </div>
        </section>
      </main>
    </>
  )
}

export default App
