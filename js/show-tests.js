// This script ensures the tests section is shown after form submission

document.addEventListener("DOMContentLoaded", () => {
  // Get the registration form
  const registrationForm = document.getElementById("registrationForm")

  if (registrationForm) {
    // Add a submit handler that prevents default behavior
    registrationForm.addEventListener("submit", (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log("Form submission intercepted by show-tests.js")

      // Get form data
      const formData = new FormData(registrationForm)
      const formValues = {}
      for (const [key, value] of formData.entries()) {
        formValues[key] = value
      }

      // Store form data in localStorage for persistence
      localStorage.setItem("userFormData", JSON.stringify(formValues))

      // Show success message
      const successAlert = document.createElement("div")
      successAlert.className = "alert alert-success fade show"
      successAlert.innerHTML = "Registration successful! Redirecting to tests..."
      registrationForm.prepend(successAlert)

      // Disable the submit button
      const submitBtn = registrationForm.querySelector('button[type="submit"]')
      if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.innerHTML = "Submitted"
      }

      // Hide registration section and show tests section
      setTimeout(() => {
        // Hide registration section
        const registerSection = document.getElementById("register")
        if (registerSection) {
          registerSection.classList.add("d-none")
          registerSection.style.display = "none"
        }

        // Show tests section
        const testsSection = document.getElementById("tests")
        if (testsSection) {
          testsSection.classList.remove("d-none")
          testsSection.style.display = "block"

          // Scroll to tests section
          window.location.hash = "tests"
          testsSection.scrollIntoView({ behavior: "smooth" })
        }
      }, 1000)

      return false
    })

    // Also add a direct click handler to the submit button
    const submitBtn = registrationForm.querySelector('button[type="submit"]')
    if (submitBtn) {
      submitBtn.addEventListener("click", (e) => {
        if (registrationForm.checkValidity()) {
          e.preventDefault()

          // Trigger the submit event
          const submitEvent = new Event("submit", {
            bubbles: true,
            cancelable: true,
          })
          registrationForm.dispatchEvent(submitEvent)
        }
      })
    }
  }

  // Check if we should show tests section based on URL hash
  if (window.location.hash === "#tests") {
    const testsSection = document.getElementById("tests")
    if (testsSection) {
      // Hide all other sections
      document.querySelectorAll("section").forEach((section) => {
        if (section.id !== "tests") {
          section.classList.add("d-none")
        }
      })

      // Show tests section
      testsSection.classList.remove("d-none")
      testsSection.scrollIntoView({ behavior: "smooth" })
    }
  }
})
