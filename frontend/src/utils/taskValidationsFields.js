export function validateTask({ title = "", description = "" }) {
    const validationErrors = []

    const titleWords = title.trim().split(/\s+/).filter(Boolean)
    const descriptionWords = description.trim().split(/\s+/).filter(Boolean)

    if (titleWords.length < 2) {
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

    return validationErrors
}