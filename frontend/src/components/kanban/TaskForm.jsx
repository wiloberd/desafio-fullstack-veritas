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


  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Título da tarefa" required/>
      <textarea name="description" placeholder="Descrição da tarefa"/>


      <button type="submit">Criar tarefa</button>
      <button type="button" onClick={onCancel}> Cancelar </button>
    </form>
  )
}