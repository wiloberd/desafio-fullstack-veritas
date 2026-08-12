import { useState } from "react"
import { validateTask } from "../../utils/taskValidationsFields"

export function TaskForm({ onSubmit, onCancel }) {
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
        onSubmit({ title, description })
      }

    
    function getFieldError(fieldName) {
        const errorObj = errors.find((err) => err.field === fieldName)
        return errorObj ? errorObj.message : null
      }

    function handleClearError(fieldName) {
        setErrors((prevErrors) => prevErrors.filter((err) => err.field !== fieldName))
      }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input 
          type="text" 
          name="title" 
          placeholder="Título da tarefa" 
          required
          onChange={() => handleClearError("title")}
          />
        {getFieldError("title") && (
          <span style={{ color: "red", display: "block" }}>
            {getFieldError("title")}
          </span>
        )}
      </div>

      <div>
        <textarea 
          name="description" 
          placeholder="Descrição da tarefa (Opcional)"
          onChange={() => handleClearError("description")}
          />
         {getFieldError("description") && (
          <span style={{ color: "red", display: "block" }}>
            {getFieldError("description")}
          </span>
        )}
      </div>

      <div>
        <button type="submit">Criar tarefa</button>
        <button type="button" onClick={onCancel}> Cancelar </button>
      </div>
    </form>
  )
}