// Voice Control Model Implementation
document.addEventListener("DOMContentLoaded", () => {
  console.log("Voice Control Model loaded")

  // Voice Control Model Class
  class VoiceControlModel {
    constructor() {
      this.isListening = false
      this.recognition = null
      this.commands = new Map()
      this.confidence = 0.7 // Minimum confidence threshold
      this.initializeSpeechRecognition()
      this.setupCommands()
      this.setupUI()
    }

    initializeSpeechRecognition() {
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        this.recognition = new SpeechRecognition()

        this.recognition.continuous = true
        this.recognition.interimResults = false
        this.recognition.lang = "en-US"
        this.recognition.maxAlternatives = 3

        this.recognition.onresult = (event) => {
          this.handleSpeechResult(event)
        }

        this.recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          this.stopListening()

          if (event.error === "not-allowed") {
            this.showNotification(
              "Microphone access denied. Please allow microphone access for voice control.",
              "warning",
            )
          } else if (event.error === "no-speech") {
            this.showNotification("No speech detected. Try speaking closer to the microphone.", "info")
          }
        }

        this.recognition.onend = () => {
          if (this.isListening) {
            // Restart recognition if it was supposed to be listening
            setTimeout(() => {
              if (this.isListening) {
                this.recognition.start()
              }
            }, 100)
          }
        }

        console.log("Voice recognition initialized")
      } else {
        console.warn("Speech recognition not supported")
        this.showNotification("Voice control not supported in this browser", "warning")
      }
    }

    setupCommands() {
      // Navigation commands
      this.commands.set("go home", () => this.navigateTo("home"))
      this.commands.set("go to home", () => this.navigateTo("home"))
      this.commands.set("home page", () => this.navigateTo("home"))

      this.commands.set("go to register", () => this.navigateTo("register"))
      this.commands.set("registration", () => this.navigateTo("register"))
      this.commands.set("register", () => this.navigateTo("register"))

      this.commands.set("go to tests", () => this.navigateTo("tests"))
      this.commands.set("show tests", () => this.navigateTo("tests"))
      this.commands.set("tests", () => this.navigateTo("tests"))

      this.commands.set("go to about", () => this.navigateTo("about"))
      this.commands.set("about", () => this.navigateTo("about"))

      this.commands.set("go to contact", () => this.navigateTo("contact"))
      this.commands.set("contact", () => this.navigateTo("contact"))

      // Test commands
      this.commands.set("start spiral test", () => {
        if (this.checkRegistration()) {
          document.getElementById("startSpiralTest").click()
        }
      })

      this.commands.set("start tap test", () => {
        if (this.checkRegistration()) {
          document.getElementById("startTapTest").click()
        }
      })

      this.commands.set("start reaction test", () => {
        if (this.checkRegistration()) {
          document.getElementById("startReactionTest").click()
        }
      })

      this.commands.set("start voice test", () => {
        if (this.checkRegistration()) {
          document.getElementById("startVoiceTest").click()
        }
      })

      this.commands.set("show results", () => {
        const resultsBtn = document.getElementById("viewResults")
        if (resultsBtn && !resultsBtn.disabled) {
          resultsBtn.click()
        } else {
          this.showNotification("Please complete at least one test first.", "info")
        }
      })

      // Theme commands
      this.commands.set("dark mode", () => {
        const themeToggle = document.getElementById("themeToggle")
        if (document.body.getAttribute("data-theme") !== "dark") {
          themeToggle.click()
        }
      })

      this.commands.set("light mode", () => {
        const themeToggle = document.getElementById("themeToggle")
        if (document.body.getAttribute("data-theme") !== "light") {
          themeToggle.click()
        }
      })

      this.commands.set("toggle theme", () => {
        document.getElementById("themeToggle").click()
      })

      // Control commands
      this.commands.set("stop listening", () => {
        this.stopListening()
        this.showNotification("Voice control stopped.", "info")
      })

      this.commands.set("help", () => {
        this.showHelp()
      })

      this.commands.set("what can you do", () => {
        this.showHelp()
      })

      console.log("Voice commands setup complete")
    }

    setupUI() {
      const voiceBtn = document.getElementById("voiceControl")
      if (voiceBtn) {
        voiceBtn.addEventListener("click", () => {
          if (this.isListening) {
            this.stopListening()
          } else {
            this.startListening()
          }
        })
      }
    }

    startListening() {
      if (!this.recognition) {
        this.showNotification("Voice recognition not available.", "error")
        return
      }

      try {
        this.recognition.start()
        this.isListening = true
        this.updateUI()
        this.showNotification("Voice control activated. Say a command...", "success")
      } catch (error) {
        console.error("Error starting voice recognition:", error)
        this.showNotification("Failed to start voice control.", "error")
      }
    }

    stopListening() {
      if (this.recognition) {
        this.recognition.stop()
      }
      this.isListening = false
      this.updateUI()
    }

    updateUI() {
      const voiceBtn = document.getElementById("voiceControl")
      if (voiceBtn) {
        if (this.isListening) {
          voiceBtn.classList.add("listening")
          voiceBtn.title = "Stop Voice Control"
        } else {
          voiceBtn.classList.remove("listening")
          voiceBtn.title = "Start Voice Control"
        }
      }
    }

    handleSpeechResult(event) {
      const results = event.results
      const lastResult = results[results.length - 1]

      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.toLowerCase().trim()
        const confidence = lastResult[0].confidence

        console.log("Voice command:", transcript, "Confidence:", confidence)

        if (confidence >= this.confidence) {
          this.executeCommand(transcript)
        } else {
          this.showNotification("Command not recognized. Please speak clearly.", "warning")
        }
      }
    }

    executeCommand(transcript) {
      let commandExecuted = false

      // Check for exact matches first
      if (this.commands.has(transcript)) {
        this.commands.get(transcript)()
        commandExecuted = true
      } else {
        // Check for partial matches
        for (const [command, action] of this.commands) {
          if (transcript.includes(command) || command.includes(transcript)) {
            action()
            commandExecuted = true
            break
          }
        }
      }

      if (commandExecuted) {
        this.showNotification(`Command executed: "${transcript}"`, "success")
      } else {
        this.showNotification(`Command not recognized: "${transcript}". Say "help" for available commands.`, "warning")
      }
    }

    showHelp() {
      const helpCommands = [
        "Navigation: 'go home', 'go to tests', 'go to about'",
        "Tests: 'start spiral test', 'start tap test', 'start reaction test'",
        "Theme: 'dark mode', 'light mode', 'toggle theme'",
        "Results: 'show results'",
        "Control: 'stop listening', 'help'",
      ]

      const helpHTML = `
        <div class="modal fade" id="voiceHelpModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Voice Commands Help</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <h6>Available Voice Commands:</h6>
                <ul class="list-unstyled">
                  ${helpCommands
                    .map((cmd) => `<li class="mb-2"><i class="fas fa-microphone me-2 text-primary"></i>${cmd}</li>`)
                    .join("")}
                </ul>
                <div class="alert alert-info mt-3">
                  <i class="fas fa-info-circle me-2"></i>
                  Speak clearly and wait for the command to be processed. The voice control button will pulse when listening.
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Got it!</button>
              </div>
            </div>
          </div>
        </div>
      `

      // Add modal to DOM if it doesn't exist
      if (!document.getElementById("voiceHelpModal")) {
        document.body.insertAdjacentHTML("beforeend", helpHTML)
      }

      // Show the modal
      const modal = document.querySelector("#voiceHelpModal")
      if (modal) {
        modal.classList.add("show")
        modal.style.display = "block"
        const closeButton = modal.querySelector(".btn-close")
        if (closeButton) {
          closeButton.addEventListener("click", () => {
            modal.classList.remove("show")
            modal.style.display = "none"
          })
        }
      }
    }

    navigateTo(section) {
      const element = document.getElementById(section)
      if (element) {
        // Hide all sections
        document.querySelectorAll("section").forEach((s) => {
          s.classList.add("d-none")
        })

        // Show target section
        element.classList.remove("d-none")
        element.scrollIntoView({ behavior: "smooth" })

        // Update nav links
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active")
        })
        const navLink = document.querySelector(`a[href="#${section}"]`)
        if (navLink) {
          navLink.classList.add("active")
        }
      }
    }

    startTest(testType) {
      // First navigate to tests section if not already there
      const testsSection = document.getElementById("tests")
      if (testsSection && testsSection.classList.contains("d-none")) {
        this.navigateTo("tests")
        // Wait a moment for the section to show
        setTimeout(() => {
          this.executeTestStart(testType)
        }, 500)
      } else {
        this.executeTestStart(testType)
      }
    }

    executeTestStart(testType) {
      const testButtons = {
        spiral: "startSpiralTest",
        tap: "startTapTest",
        reaction: "startReactionTest",
        voice: "startVoiceTest",
      }

      const buttonId = testButtons[testType]
      if (buttonId) {
        const button = document.getElementById(buttonId)
        if (button) {
          button.click()
        }
      }
    }

    showResults() {
      const viewResultsBtn = document.getElementById("viewResults")
      if (viewResultsBtn && !viewResultsBtn.disabled) {
        viewResultsBtn.click()
      } else {
        this.showNotification("Please complete at least one test first", "warning")
      }
    }

    toggleTheme(mode) {
      const themeToggle = document.getElementById("themeToggle")
      if (themeToggle) {
        if (mode) {
          // Set specific mode
          if (mode === "dark") {
            document.documentElement.setAttribute("data-theme", "dark")
            localStorage.setItem("theme", "dark")
          } else {
            document.documentElement.setAttribute("data-theme", "light")
            localStorage.setItem("theme", "light")
          }
        } else {
          // Toggle current mode
          themeToggle.click()
        }
      }
    }

    checkRegistration() {
      // Placeholder for registration check logic
      return true
    }

    showNotification(message, type = "info") {
      // Create notification element
      const notification = document.createElement("div")
      notification.className = `alert alert-${type} alert-dismissible fade show voice-notification`
      notification.innerHTML = `
        <i class="fas fa-microphone me-2"></i>
        ${message}
        <button type="button" class="btn-close" aria-label="Close"></button>
      `

      // Style the notification
      notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 9999;
        max-width: 350px;
        box-shadow: var(--shadow-heavy);
        border-radius: var(--border-radius);
        animation: slideInRight 0.3s ease;
      `

      // Add to document
      document.body.appendChild(notification)

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        notification.style.animation = "slideOutRight 0.3s ease"
        setTimeout(() => {
          notification.remove()
        }, 300)
      }, 3000)

      // Add click event to close button
      const closeButton = notification.querySelector(".btn-close")
      if (closeButton) {
        closeButton.addEventListener("click", () => {
          notification.style.animation = "slideOutRight 0.3s ease"
          setTimeout(() => {
            notification.remove()
          }, 300)
        })
      }
    }
  }

  // Initialize voice control
  const voiceControl = new VoiceControlModel()

  // Add voice control button to navbar
  function addVoiceControlButton() {
    const navbar = document.querySelector(".navbar-nav")
    if (navbar) {
      const voiceButton = document.createElement("li")
      voiceButton.className = "nav-item"
      voiceButton.innerHTML = `
        <button class="btn btn-outline-light btn-sm ms-2" id="voiceControlBtn" title="Toggle Voice Control">
          <i class="fas fa-microphone"></i>
        </button>
      `

      navbar.appendChild(voiceButton)

      // Add click handler
      const btn = document.getElementById("voiceControlBtn")
      btn.addEventListener("click", () => {
        if (voiceControl.isListening) {
          voiceControl.stopListening()
          btn.innerHTML = '<i class="fas fa-microphone"></i>'
          btn.classList.remove("btn-danger")
          btn.classList.add("btn-outline-light")
        } else {
          voiceControl.startListening()
          btn.innerHTML = '<i class="fas fa-microphone-alt"></i>'
          btn.classList.remove("btn-outline-light")
          btn.classList.add("btn-danger")
        }
      })
    }
  }

  // Add CSS for animations
  const style = document.createElement("style")
  style.textContent = `
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    @keyframes slideOutRight {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(100%);
      }
    }
    
    .voice-notification {
      border-left: 4px solid var(--royal-blue);
    }
    
    .alert-success {
      background-color: rgba(5, 150, 105, 0.1);
      border-color: var(--medical-green);
      color: var(--medical-green);
    }
    
    .alert-warning {
      background-color: rgba(234, 88, 12, 0.1);
      border-color: var(--medical-orange);
      color: var(--medical-orange);
    }
    
    .alert-info {
      background-color: rgba(30, 58, 138, 0.1);
      border-color: var(--royal-blue);
      color: var(--royal-blue);
    }
    
    .alert-danger {
      background-color: rgba(220, 38, 38, 0.1);
      border-color: var(--medical-red);
      color: var(--medical-red);
    }
  `
  document.head.appendChild(style)

  // Add voice control button after DOM is ready
  setTimeout(addVoiceControlButton, 100)

  // Make voice control available globally
  window.voiceControl = voiceControl

  console.log("Voice Control Model initialized successfully")
})
