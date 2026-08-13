import React, { useState } from 'react'
import './App.css'
import logo from './assets/logo.png'
import { TaskCard } from './components/kanban/TaskCard'
import { TaskCreateForm } from './components/kanban/TaskCreateForm'
import { tasks } from './data/tasks'
import { TaskUpdateForm } from './components/kanban/TaskUpdateForm'

function App() {
  const [isFormOpen, setIsFormOpen] = useState(true)
  const [editingTaskId, setEditingTaskId] = useState(null)

  const todo = tasks.filter((task) => task?.status === 'todo')
  const progress = tasks.filter((task) => task?.status === 'progress')
  const done = tasks.filter((task) => task?.status === 'done')





  const handleCreateTask = (taskData) => {
    const newTask = {
      title: taskData.title,
      description: taskData.description,
      status: 'todo',
    }


  }

  const handleEdit = (task) => {
    console.log('Editar:', task);
    setEditingTaskId(task.id)
  };

  const handleDelete = (id) => {
    console.log('Excluir ID:', id);
  };

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
               <ul className='task-items'>

                  <TaskCreateForm onSubmit={handleCreateTask}/>
                  
                   {todo.map((task) => (
                    <React.Fragment key={task.id}>
                      <TaskCard
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />

                      {editingTaskId === task.id && (
                        <TaskUpdateForm
                          task={task}
                          onUpdate={handleEdit}
                          onCancel={() => setEditingTaskId(null)}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </ul>
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
               <ul className='task-items'>
                  { 
                    progress.map((task) => (
                      <TaskCard 
                        key={task.id}
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))
                  }
                </ul>
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
               <ul className='task-items'>
                  { 
                    done.map((task) => (
                      <TaskCard 
                        key={task.id}
                        task={task}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))
                  }
                </ul>
              </div>
            </div>
        </section>
      </main>
    </>
  )
}

export default App
