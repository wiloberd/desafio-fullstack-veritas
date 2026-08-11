import './App.css'
import logo from './assets/logo.png'

function App() {

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
                <p className="task-count">0 tarefas</p>
              </div>
            </div>

             <div className="column-content">
               <ul className='task-items'>
                <li className="task-item">
                  <div className="task-item-box">
                      <div className="task-item-header-box">
                          <h3>Tarefa 01</h3>
                          <div className="task-item-actions">
                            <button type="button" className="task-item-btn"
                              aria-label="Editar tarefa">✏️</button>

                            <button type="button" className="task-item-btn"
                              aria-label="Excluir tarefa" > ❌ </button>
                          </div>
                      </div>
                      <div className="task-item-description-box">
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                          A facilis sint laudantium in, cum ad placeat enim repellat
                          earum sapiente minima doloremque.</p>
                      </div>
                    </div>
                </li>
                <li className="task-item">
                  <div className="task-item-box">
                      <div className="task-item-header-box">
                          <h3>Tarefa 02</h3>

                          <div className="task-item-actions">
                            <button type="button" className="task-item-btn"
                              aria-label="Editar tarefa">✏️</button>

                            <button type="button" className="task-item-btn"
                              aria-label="Excluir tarefa" > ❌ </button>
                          </div>
                      </div>

                      <div className="task-item-description-box">
                        <p></p>
                      </div>

                    </div>
                </li>
                <li className="task-item">
                  <div className="task-item-box">
                      <div className="task-item-header-box">
                          <h3>Tarefa 03</h3>

                          <div className="task-item-actions">
                            <button type="button" className="task-item-btn"
                              aria-label="Editar tarefa">✏️</button>

                            <button type="button" className="task-item-btn"
                              aria-label="Excluir tarefa" > ❌ </button>
                          </div>
                      </div>

                      <div className="task-item-description-box">
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                          A facilis sint laudantium in, cum ad placeat enim repellat
                          earum sapiente minima doloremque.</p>
                      </div>

                    </div>
                </li>
                <li className="task-item">
                  <div className="task-item-box">
                      <div className="task-item-header-box">
                          <h3>Tarefa 04</h3>

                          <div className="task-item-actions">
                            <button type="button" className="task-item-btn"
                              aria-label="Editar tarefa">✏️</button>

                            <button type="button" className="task-item-btn"
                              aria-label="Excluir tarefa" > ❌ </button>
                          </div>
                      </div>

                      <div className="task-item-description-box">
                        <p></p>
                      </div>

                    </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="kanban-column">
            <div className="column-header">
              <div>
                <h2>Em Progresso</h2>
                <p className="task-count">0 tarefas</p>
              </div>
            </div>
          </div>

          <div className="kanban-column">
            <div className="column-header">
              <div>
                <h2>Concluído</h2>
                <p className="task-count">0 tarefas</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default App
