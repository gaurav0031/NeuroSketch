// Form validation with animations
document.addEventListener("DOMContentLoaded", () => {
  const registrationForm = document.getElementById("registrationForm")

  if (!registrationForm) return

  const inputs = registrationForm.querySelectorAll("input, textarea")

  // Add validation classes on blur
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateInput(this)
    })

    // Remove validation classes on focus
    input.addEventListener("focus", function () {
      this.classList.remove("is-invalid")
      const feedbackElement = this.nextElementSibling
      if (feedbackElement && feedbackElement.classList.contains("invalid-feedback")) {
        feedbackElement.remove()
      }
    })
  })

  // Form submission validation
  registrationForm.addEventListener("submit", (e) => {
    let isValid = true

    inputs.forEach((input) => {
      if (input.hasAttribute("required") && !validateInput(input)) {
        isValid = false
      }
    })

    if (!isValid) {
      e.preventDefault()
      e.stopPropagation()

      // Add shake animation to the form
      registrationForm.classList.add("shake")
      setTimeout(() => {
        registrationForm.classList.remove("shake")
      }, 500)

      // Scroll to the first invalid input
      const firstInvalid = registrationForm.querySelector(".is-invalid")
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" })
      }

      return false
    } else {
      // If form is valid, we'll handle the submission in main.js
      console.log("Form is valid, continuing with submission")
    }
  })

  function validateInput(input) {
    // Remove existing feedback
    const existingFeedback = input.nextElementSibling
    if (existingFeedback && existingFeedback.classList.contains("invalid-feedback")) {
      existingFeedback.remove()
    }

    if (input.hasAttribute("required") && !input.value.trim()) {
      // Add invalid class and feedback
      input.classList.add("is-invalid")
      const feedback = document.createElement("div")
      feedback.classList.add("invalid-feedback")
      feedback.textContent = "This field is required"
      input.parentNode.insertBefore(feedback, input.nextSibling)
      return false
    }

    // Email validation
    if (input.type === "email" && input.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(input.value.trim())) {
        input.classList.add("is-invalid")
        const feedback = document.createElement("div")
        feedback.classList.add("invalid-feedback")
        feedback.textContent = "Please enter a valid email address"
        input.parentNode.insertBefore(feedback, input.nextSibling)
        return false
      }
    }

    // Add valid class if passes validation
    input.classList.add("is-valid")
    return true
  }
})

