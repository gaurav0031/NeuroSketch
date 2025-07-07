// Enhanced Form Validation
document.addEventListener("DOMContentLoaded", () => {
  console.log("Form validation initialized")

  const registrationForm = document.getElementById("registrationForm")
  if (!registrationForm) {
    console.log("Registration form not found")
    return
  }

  const inputs = registrationForm.querySelectorAll("input, textarea, select")

  // Add validation classes on blur
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateInput(this)
    })

    // Remove validation classes on focus
    input.addEventListener("focus", function () {
      clearFieldValidation(this)
    })

    // Real-time validation for email
    if (input.type === "email") {
      input.addEventListener("input", function () {
        if (this.value.length > 0) {
          validateInput(this)
        }
      })
    }
  })

  // Handle form submission
  registrationForm.addEventListener("submit", (e) => {
    e.preventDefault()

    let isValid = true

    // Validate all fields
    inputs.forEach((input) => {
      if (!validateInput(input)) {
        isValid = false
      }
    })

    // Special validation for radio buttons
    const genderRadios = registrationForm.querySelectorAll('input[name="gender"]')
    const isGenderSelected = Array.from(genderRadios).some((radio) => radio.checked)

    if (!isGenderSelected) {
      isValid = false
      genderRadios.forEach((radio) => {
        radio.classList.add("is-invalid")
      })
      showFieldError(genderRadios[0].closest(".col-md-6"), "Please select your gender.")
    } else {
      genderRadios.forEach((radio) => {
        radio.classList.remove("is-invalid")
        radio.classList.add("is-valid")
      })
      clearFieldError(genderRadios[0].closest(".col-md-6"))
    }

    // Check consent checkbox
    const consentCheckbox = registrationForm.querySelector("#consent")
    if (!consentCheckbox.checked) {
      isValid = false
      consentCheckbox.classList.add("is-invalid")
      showFieldError(consentCheckbox.closest(".mb-4"), "You must consent to proceed with the assessment.")
    } else {
      consentCheckbox.classList.remove("is-invalid")
      consentCheckbox.classList.add("is-valid")
      clearFieldError(consentCheckbox.closest(".mb-4"))
    }

    if (isValid) {
      // Show loading state
      const submitBtn = registrationForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...'
      submitBtn.disabled = true

      // Simulate processing time
      setTimeout(() => {
        // Store form data
        const formData = new FormData(registrationForm)
        const userData = {
          fullName: formData.get("fullName"),
          email: formData.get("email"),
          age: formData.get("age"),
          gender: formData.get("gender"),
          familyHistory: formData.get("familyHistory"),
          medicalSituation: formData.get("medicalSituation"),
          registrationDate: new Date().toISOString(),
        }

        localStorage.setItem("userData", JSON.stringify(userData))
        window.isRegistered = true

        // Show success message
        if (window.showNotification) {
          window.showNotification("Registration completed successfully! Redirecting to tests...", "success")
        }

        // Reset button
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false

        // Redirect to tests
        setTimeout(() => {
          if (window.showSection) {
            window.showSection("tests")
          }
        }, 1500)
      }, 1000)
    } else {
      // Show error message
      if (window.showNotification) {
        window.showNotification("Please correct the errors in the form before submitting.", "error")
      }

      // Scroll to first error
      const firstError = registrationForm.querySelector(".is-invalid")
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" })
        firstError.focus()
      }
    }
  })

  function validateInput(input) {
    const value = input.value.trim()
    let isValid = true
    let errorMessage = ""

    // Clear previous validation
    clearFieldValidation(input)

    // Check if field is required
    if (input.hasAttribute("required")) {
      if (!value) {
        isValid = false
        errorMessage = "This field is required."
      }
    }

    // Specific validation based on field type
    if (value && input.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        isValid = false
        errorMessage = "Please enter a valid email address."
      }
    }

    if (value && input.type === "number") {
      const num = Number.parseInt(value)
      if (isNaN(num) || num < 1 || num > 120) {
        isValid = false
        errorMessage = "Please enter a valid age between 1 and 120."
      }
    }

    // Apply validation styling
    if (isValid) {
      input.classList.remove("is-invalid")
      input.classList.add("is-valid")
      clearFieldError(input.closest(".mb-3") || input.closest(".col-md-6"))
    } else {
      input.classList.remove("is-valid")
      input.classList.add("is-invalid")
      showFieldError(input.closest(".mb-3") || input.closest(".col-md-6"), errorMessage)
    }

    return isValid
  }

  // Clear field validation
  function clearFieldValidation(input) {
    input.classList.remove("is-invalid", "is-valid")
    clearFieldError(input.closest(".mb-3") || input.closest(".col-md-6"))
  }

  // Show field error
  function showFieldError(container, message) {
    if (!container) return

    // Remove existing error
    const existingError = container.querySelector(".invalid-feedback")
    if (existingError) {
      existingError.remove()
    }

    // Add new error
    const errorDiv = document.createElement("div")
    errorDiv.className = "invalid-feedback d-block"
    errorDiv.textContent = message
    container.appendChild(errorDiv)
  }

  // Clear field error
  function clearFieldError(container) {
    if (!container) return

    const errorDiv = container.querySelector(".invalid-feedback")
    if (errorDiv) {
      errorDiv.remove()
    }
  }

  // Handle radio button validation
  const genderRadios = registrationForm.querySelectorAll('input[name="gender"]')
  genderRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      genderRadios.forEach((r) => {
        r.classList.remove("is-invalid")
        r.classList.add("is-valid")
      })
      clearFieldError(this.closest(".col-md-6"))
    })
  })

  // Handle checkbox validation
  const consentCheckbox = registrationForm.querySelector("#consent")
  if (consentCheckbox) {
    consentCheckbox.addEventListener("change", function () {
      if (this.checked) {
        this.classList.remove("is-invalid")
        this.classList.add("is-valid")
        clearFieldError(this.closest(".mb-4"))
      } else {
        this.classList.remove("is-valid")
        this.classList.add("is-invalid")
        showFieldError(this.closest(".mb-4"), "You must consent to proceed with the assessment.")
      }
    })
  }
})
