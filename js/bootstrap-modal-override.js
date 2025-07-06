// This script prevents Bootstrap from handling our modals that we want to manage ourselves
document.addEventListener("DOMContentLoaded", () => {
  // Prevent Bootstrap from initializing modals that we handle
  const testModals = ["spiralTestModal", "tapTestModal", "reactionTestModal", "voiceTestModal"]

  // Override Bootstrap's modal functionality for our test modals
  testModals.forEach((modalId) => {
    const modalElement = document.getElementById(modalId)
    if (modalElement) {
      // Add a data attribute to mark this modal as handled by our custom code
      modalElement.setAttribute("data-handled", "true")

      // Remove Bootstrap's event listeners
      modalElement.removeAttribute("data-bs-toggle")
      modalElement.removeAttribute("data-bs-target")

      // Find all buttons that would trigger this modal
      const triggerButtons = document.querySelectorAll(`[data-bs-target="#${modalId}"]`)
      triggerButtons.forEach((button) => {
        button.removeAttribute("data-bs-toggle")
        button.removeAttribute("data-bs-target")
      })
    }
  })

  // Add event listener to all modal close buttons
  document.querySelectorAll(".modal .btn-close").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      // Get the modal element
      const modal = this.closest(".modal")
      if (!modal) return

      // Hide the modal
      modal.classList.remove("show")
      modal.style.display = "none"

      // Remove modal-open class from body
      document.body.classList.remove("modal-open")

      // Remove backdrop
      const backdrop = document.querySelector(".modal-backdrop")
      if (backdrop) backdrop.remove()
    })
  })

  // Fix for modals not closing when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      const modalId = e.target.id
      if (testModals.includes(modalId)) {
        const modal = document.getElementById(modalId)
        modal.classList.remove("show")
        modal.style.display = "none"
        document.body.classList.remove("modal-open")

        const backdrop = document.querySelector(".modal-backdrop")
        if (backdrop) backdrop.remove()
      }
    }
  })
})

