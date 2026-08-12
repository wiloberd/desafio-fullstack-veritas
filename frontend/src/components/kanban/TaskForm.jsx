import { useState, useEffect } from "react"

export function TaskForm({ onSubmit, onCancel }) {
    const [errors, setErrors] = useState([])

    function handleSubmit(event) {
        event.preventDefault()

        const form = event.currentTarget
        const title = form.title.value.trim()
        const description = form.description.value.trim()

        const titleWords = title.split(/\s+/).filter(Boolean)
        const descriptionWords = description.split(/\s+/).filter(Boolean)

        const validationErrors = []

        if (titleWords.length < 2) {
          alert(`Erro título deve ter pelo menos duas palavras. ${titleWords}`)
          validationErrors.push({
            field: "title",
            message: "O título deve conter pelo menos 2 palavras.",
          })
        }
        
        if (descriptionWords.length > 60) {
          validationErrors.push({
            field: "description",
            message: "A descrição não deve ultrapassar 60 palavras.",
          })
        }

        
        if (validationErrors.length > 0) {
          setErrors(validationErrors)
          return
        }

        setErrors([])
        onSubmit({ title, description })
      }


    useEffect(() => {
      if (errors.length > 0) {
        console.log("Estado 'errors' atualizado no React:", errors)
      }
    }, [errors])

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Título da tarefa" required/>
      <textarea name="description" placeholder="Descrição da tarefa"/>


      <button type="submit">Criar tarefa</button>
      <button type="button" onClick={onCancel}> Cancelar </button>
    </form>
  )
}