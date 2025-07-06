// This script ensures Bootstrap modals work correctly

document.addEventListener("DOMContentLoaded", () => {
  console.log("Modal helper script loaded")

  // Fix for modals not showing
  function fixModals() {
    // Get all modal elements
    const modals = document.querySelectorAll(".modal")

    modals.forEach((modal) => {
      // Get the corresponding button that should open this modal
      const modalId = modal.id
      const buttons = document.querySelectorAll(`[data-bs-target="#${modalId}"], [data-target="#${modalId}"]`)

      // If there's no button with data-bs-target, add click handlers to the test buttons
      if (buttons.length === 0) {
        if (modalId === "spiralTestModal") {
          const btn = document.getElementById("startSpiralTest")
          if (btn) {
            btn.setAttribute("data-bs-toggle", "modal")
            btn.setAttribute("data-bs-target", "#spiralTestModal")
          }
        } else if (modalId === "tapTestModal") {
          const btn = document.getElementById("startTapTest")
          if (btn) {
            btn.setAttribute("data-bs-toggle", "modal")
            btn.setAttribute("data-bs-target", "#tapTestModal")
          }
        } else if (modalId === "reactionTestModal") {
          const btn = document.getElementById("startReactionTest")
          if (btn) {
            btn.setAttribute("data-bs-toggle", "modal")
            btn.setAttribute("data-bs-target", "#reactionTestModal")
          }
        } else if (modalId === "voiceTestModal") {
          const btn = document.getElementById("startVoiceTest")
          if (btn) {
            btn.setAttribute("data-bs-toggle", "modal")
            btn.setAttribute("data-bs-target", "#voiceTestModal")
          }
        }
      }
    })
  }

  // Fix modal close buttons
  function fixModalCloseButtons() {
    const closeButtons = document.querySelectorAll('.modal .btn-close, .modal [data-bs-dismiss="modal"]')

    closeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const modal = this.closest(".modal")
        if (modal) {
          try {
            const modalInstance = bootstrap.Modal.getInstance(modal)
            if (modalInstance) {
              modalInstance.hide()
            } else {
              // Fallback if modal instance not found
              modal.classList.remove("show")
              modal.style.display = "none"
              document.body.classList.remove("modal-open")

              // Remove backdrop
              const backdrop = document.querySelector(".modal-backdrop")
              if (backdrop) backdrop.remove()
            }
          } catch (error) {
            console.error("Error closing modal:", error)
            // Manual fallback
            modal.classList.remove("show")
            modal.style.display = "none"
            document.body.classList.remove("modal-open")

            // Remove backdrop
            const backdrop = document.querySelector(".modal-backdrop")
            if (backdrop) backdrop.remove()
          }
        }
      })
    })
  }

  // Initialize all modals
  function initializeAllModals() {
    const modals = document.querySelectorAll(".modal")

    modals.forEach((modal) => {
      try {
        // Create a new modal instance for each modal
        new bootstrap.Modal(modal)
      } catch (error) {
        console.error(`Error initializing modal ${modal.id}:`, error)
      }
    })
  }

  // Run fixes
  setTimeout(() => {
    fixModals()
    fixModalCloseButtons()
    initializeAllModals()
  }, 500)

  // Add direct click handlers for test buttons as a fallback
  const startSpiralTest = document.getElementById("startSpiralTest")
  const startTapTest = document.getElementById("startTapTest")
  const startReactionTest = document.getElementById("startReactionTest")
  const startVoiceTest = document.getElementById("startVoiceTest")

  if (startSpiralTest) {
    startSpiralTest.addEventListener("click", () => {
      const modal = document.getElementById("spiralTestModal")
      if (modal) {
        try {
          const bsModal = new bootstrap.Modal(modal)
          bsModal.show()
        } catch (error) {
          console.error("Error showing spiral test modal:", error)
          // Manual fallback
          modal.classList.add("show")
          modal.style.display = "block"
          document.body.classList.add("modal-open")

          // Add backdrop
          const backdrop = document.createElement("div")
          backdrop.className = "modal-backdrop fade show"
          document.body.appendChild(backdrop)
        }
      }
    })
  }

  if (startTapTest) {
    startTapTest.addEventListener("click", () => {
      const modal = document.getElementById("tapTestModal")
      if (modal) {
        try {
          const bsModal = new bootstrap.Modal(modal)
          bsModal.show()
        } catch (error) {
          console.error("Error showing tap test modal:", error)
          // Manual fallback
          modal.classList.add("show")
          modal.style.display = "block"
          document.body.classList.add("modal-open")

          // Add backdrop
          const backdrop = document.createElement("div")
          backdrop.className = "modal-backdrop fade show"
          document.body.appendChild(backdrop)
        }
      }
    })
  }

  if (startReactionTest) {
    startReactionTest.addEventListener("click", () => {
      const modal = document.getElementById("reactionTestModal")
      if (modal) {
        try {
          const bsModal = new bootstrap.Modal(modal)
          bsModal.show()
        } catch (error) {
          console.error("Error showing reaction test modal:", error)
          // Manual fallback
          modal.classList.add("show")
          modal.style.display = "block"
          document.body.classList.add("modal-open")

          // Add backdrop
          const backdrop = document.createElement("div")
          backdrop.className = "modal-backdrop fade show"
          document.body.appendChild(backdrop)
        }
      }
    })
  }

  if (startVoiceTest) {
    startVoiceTest.addEventListener("click", () => {
      const modal = document.getElementById("voiceTestModal")
      if (modal) {
        try {
          const bsModal = new bootstrap.Modal(modal)
          bsModal.show()
        } catch (error) {
          console.error("Error showing voice test modal:", error)
          // Manual fallback
          modal.classList.add("show")
          modal.style.display = "block"
          document.body.classList.add("modal-open")

          // Add backdrop
          const backdrop = document.createElement("div")
          backdrop.className = "modal-backdrop fade show"
          document.body.appendChild(backdrop)
        }
      }
    })
  }
})

