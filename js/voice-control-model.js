// Advanced Voice Control Model
class VoiceControlModel {
  constructor() {
    this.isListening = false
    this.recognition = null
    this.commands = new Map()
    this.setupCommands()
    this.initializeRecognition()
  }

  setupCommands() {
    // Navigation commands
    this.commands.set("go home", () => window.showSection("home"))
    this.commands.set("go to home", () => window.showSection("home"))
    this.commands.set("home page", () => window.showSection("home"))
    this.commands.set("go to register", () => window.showSection("register"))
    this.commands.set("go to registration", () => window.showSection("register"))
    this.commands.set("register", () => window.showSection("register"))
    this.commands.set("go to tests", () => {
      if (window.isRegistered) {
        window.showSection("tests")
      } else {
        window.showNotification("Please complete registration first!", "warning")
        window.showSection("register")
      }
    })
    this.commands.set("go to about", () => window.showSection("about"))
    this.commands.set("about page", () => window.showSection("about"))
    this.commands.set("go to contact", () => window.showSection("contact"))
    this.commands.set("contact page", () => window.showSection("contact"))

    // Test commands
    this.commands.set("start spiral test", () => {
      if (window.isRegistered) {
        document.getElementById("startSpiralTest")?.click()
      } else {
        window.showNotification("Please complete registration first!", "warning")
      }
    })
    this.commands.set("spiral test", () => {
      if (window.isRegistered) {
        document.getElementById("startSpiralTest")?.click()
      } else {
        window.showNotification("Please complete registration first!", "warning")
      }
    })
    this.commands.set("start tap test", () => {
      if (window.isRegistered) {
        document.getElementById("startTapTest")?.click()
      } else {
        window.showNotification("Please complete registration first!", "warning")
      }
    })
    this.commands.set("tap test", () => {
      if (window.isRegistered) {
        document.getElementById("startTapTest")?.click()
      } else {
        window.showNotification("Please complete registration first!", "warning")
      }
    })
    this.commands.set("start reaction test", () => {
      if (window.isRegistered) {
        document.getElementById("startReactionTest")?.click()
      } else {
        window.showNotification("Please complete registration first!", "warning")
      }
    })
    this.commands.set("reaction test", () => {
      if (window.isRegistered) {
        document.getElementById("startReactionTest")?.click()
      } else {
        window.showNotification("Please complete registration first!", "warning")
      }
    })
    this.commands.set("start voice test", () => {
      if (window.isRegistered) {
        document.getElementById("startVoiceTest")?.click()
      } else {
        window.showNotification("Please complete registration first!", "warning")
      }
    })
    this.commands.set("voice test", () => {
      if (window.isRegistered) {
        document.getElementById("startVoiceTest")?.click()
      } else {
        window.showNotification("Please complete registration first!", "warning")
      }
    })

    // Results commands
    this.commands.set("view results", () => {
      const completedTests = Object.values(window.testResults).filter((test) => test.completed).length
      if (completedTests > 0) {
        document.getElementById("viewResults")?.click()
      } else {
        window.showNotification("Please complete at least one test first!", "warning")
      }
    })
    this.commands.set("show results", () => {
      const completedTests = Object.values(window.testResults).filter((test) => test.completed).length
      if (completedTests > 0) {
        document.getElementById("viewResults")?.click()
      } else {
        window.showNotification("Please complete at least one test first!", "warning")
      }
    })

    // Theme commands
    this.commands.set("dark mode", () => window.setDarkMode?.())
    this.commands.set("light mode", () => window.setLightMode?.())
    this.commands.set("toggle theme", () => window.toggleTheme?.())
    this.commands.set("switch theme", () => window.toggleTheme?.())

    // Help command
    this.commands.set("help", () => this.showHelp())
    this.commands.set("voice commands", () => this.showHelp())
    this.commands.set("what can you do", () => this.showHelp())

    // Stop listening command
    this.commands.set("stop listening", () => this.stopListening())
    this.commands.set("stop voice control", () => this.stopListening())
  }

  initializeRecognition() {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      this.recognition = new SpeechRecognition()

      this.recognition.continuous = true
      this.recognition.interimResults = false
      this.recognition.lang = "en-US"

      this.recognition.onresult = (event) => {
        const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim()
        console.log("Voice command received:", command)
        this.processCommand(command)
      }

      this.recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        if (event.error === "not-allowed") {
          window.showNotification?.(
            "Microphone access denied. Please allow microphone access for voice control.",
            "error",
          )
        }
      }

      this.recognition.onend = () => {
        if (this.isListening) {
          // Restart recognition if we're still supposed to be listening
          setTimeout(() => {
            if (this.isListening) {
              this.recognition.start()
            }
          }, 100)
        }
      }
    } else {
      console.warn("Speech recognition not supported in this browser")
    }
  }

  processCommand(command) {
    // Find matching command
    for (const [key, action] of this.commands) {
      if (command.includes(key)) {
        window.showNotification?.(`Voice command: "${key}"`, "info")
        action()
        return
      }
    }

    // If no exact match, try partial matches
    const partialMatches = Array.from(this.commands.keys()).filter((key) =>
      key.split(" ").some((word) => command.includes(word)),
    )

    if (partialMatches.length > 0) {
      window.showNotification?.(`Did you mean: ${partialMatches[0]}?`, "warning")
    } else {
      window.showNotification?.('Voice command not recognized. Say "help" for available commands.', "warning")
    }
  }

  startListening() {
    if (!this.recognition) {
      window.showNotification?.("Voice recognition not supported in this browser.", "error")
      return
    }

    if (this.isListening) {
      this.stopListening()
      return
    }

    this.isListening = true
    this.recognition.start()

    const voiceBtn = document.getElementById("voiceControl")
    if (voiceBtn) {
      voiceBtn.classList.add("listening")
    }

    window.showNotification?.('Voice control activated. Say "help" for commands.', "success")
  }

  stopListening() {
    this.isListening = false
    if (this.recognition) {
      this.recognition.stop()
    }

    const voiceBtn = document.getElementById("voiceControl")
    if (voiceBtn) {
      voiceBtn.classList.remove("listening")
    }

    window.showNotification?.("Voice control deactivated.", "info")
  }

  showHelp() {
    const helpMessage = `
      <div class="voice-help">
        <h5>Available Voice Commands:</h5>
        <div class="row">
          <div class="col-md-6">
            <h6>Navigation:</h6>
            <ul class="list-unstyled">
              <li>• "Go home"</li>
              <li>• "Go to register"</li>
              <li>• "Go to tests"</li>
              <li>• "Go to about"</li>
              <li>• "Go to contact"</li>
            </ul>
          </div>
          <div class="col-md-6">
            <h6>Tests:</h6>
            <ul class="list-unstyled">
              <li>• "Start spiral test"</li>
              <li>• "Start tap test"</li>
              <li>• "Start reaction test"</li>
              <li>• "Start voice test"</li>
              <li>• "View results"</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <h6>Theme:</h6>
            <ul class="list-unstyled">
              <li>• "Dark mode"</li>
              <li>• "Light mode"</li>
              <li>• "Toggle theme"</li>
            </ul>
          </div>
          <div class="col-md-6">
            <h6>Control:</h6>
            <ul class="list-unstyled">
              <li>• "Help"</li>
              <li>• "Stop listening"</li>
            </ul>
          </div>
        </div>
      </div>
    `

    // Create help modal
    const helpModal = document.createElement("div")
    helpModal.className = "modal fade"
    helpModal.innerHTML = `
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Voice Control Help</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${helpMessage}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Got it!</button>
          </div>
        </div>
      </div>
    `

    document.body.appendChild(helpModal)
    const modal = window.bootstrap.Modal.getOrCreateInstance(helpModal)
    modal.show()

    // Remove modal from DOM when hidden
    helpModal.addEventListener("hidden.bs.modal", () => {
      helpModal.remove()
    })
  }
}

// Initialize voice control
document.addEventListener("DOMContentLoaded", () => {
  const voiceControl = new VoiceControlModel()

  const voiceBtn = document.getElementById("voiceControl")
  if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
      voiceControl.startListening()
    })
  }

  // Make voice control globally accessible
  window.voiceControl = voiceControl
})
