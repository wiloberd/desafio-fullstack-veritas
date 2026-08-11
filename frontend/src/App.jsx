import './App.css'
import logo from './assets/logo.png'
import { TaskCard } from './components/TaskCard'
import { tasks } from './data/tasks'

function App() {

  const todo = tasks.filter((task) => task?.status === 'todo')
  const progress = tasks.filter((task) => task?.status === 'progress')
  const done = tasks.filter((task) => task?.status === 'done')

  const handleEdit = (task) => {
    console.log('Editar:', task);
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
            <div className="column-header">
              <div>
                <h2>A Fazer</h2>
                <p className="task-count">{todo.length} tarefas</p>
              </div>
            </div>

             <div className="column-content">
               <ul className='task-items'>
                  { 
                    todo.map((task) => (
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
            <div className="column-header">
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
            <div className="column-header">
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
