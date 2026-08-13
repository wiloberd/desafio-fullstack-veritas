import { useState } from "react"
import { validateTask } from "../../utils/taskValidationsFields"

export function TaskUpdateForm({ task, onUpdate, onCancel }) {
    const [errors, setErrors] = useState([])

    function handleSubmit(event) {
        event.preventDefault()

        const form = event.currentTarget
        const title = form.title.value.trim()
        const description = form.description.value.trim()

        
        // Executa a lógica de validação de campos
        const validationErrors = validateTask({ title, description })

        if (validationErrors.length > 0) {
          setErrors(validationErrors)
          return
        }

        setErrors([])

        onUpdate({
          ...task,
          title,
          description,
        })
      }

    
    function getFieldError(fieldName) {
        const errorObj = errors.find((err) => err.field === fieldName)
        return errorObj ? errorObj.message : null
      }

    function handleClearError(fieldName) {
        setErrors((prevErrors) => prevErrors.filter((err) => err.field !== fieldName))
      }


  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form-box">
              <div className="task-form-field">
                <input 
                  type="text" 
                  name="title" 
                  placeholder="Adicionar tarefa" 
                  defaultValue={task?.title || ""}
                  className={`task-form-input ${getFieldError("title") ? "task-form-input-error" : ""}`}
                  onFocus={() => setIsExpanded(true)}
                  onChange={() => handleClearError("title")}
                  required
                  />
                {getFieldError("title") && (
                  <span className="task-form-error-msg">
                    {getFieldError("title")}
                  </span>
                )}
              </div>
              <div className="task-form-field">
                <textarea 
                  name="description" 
                  placeholder="Descrição da tarefa (Opcional, máx. 60 palavras)"
                  defaultValue={task?.description || ""}
                  className={`task-form-textarea ${getFieldError("description") ? "task-form-input-error" : ""}`}
                  onChange={() => handleClearError("description")}/>
                {getFieldError("description") && (
                  <span className="task-form-error-msg">
                    {getFieldError("description")}
                  </span>
                )}
              </div>

              <div className="task-form-actions">
                <button 
                  type="submit" 
                  className="task-form-btn task-form-btn-primary"
                  disabled={errors.length > 0}>
                    Salvar alterações
                </button>

                <button type="button" 
                  className="task-form-btn task-form-btn-secondary" 
                  onClick={() => {
                    setIsExpanded(false)
                    onCancel?.()
                  }}>
                  Cancelar 
                </button>
              </div>
      </div>
    </form>
  )
}