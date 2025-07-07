// Voice Control Model Implementation
document.addEventListener("DOMContentLoaded", () => {
  console.log("Voice Control Model loaded")

  // Voice Control Model Class
  class VoiceControlModel {
    constructor() {
      this.isListening = false
      this.recognition = null
      this.commands = new Map()
      this.initializeSpeechRecognition()
      this.setupCommands()
    }

    initializeSpeechRecognition() {
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
            this.showNotification(
              "Microphone access denied. Please allow microphone access for voice control.",
              "error",
            )
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

      this.commands.set("go to tests", () => this.navigateTo("tests"))
      this.commands.set("show tests", () => this.navigateTo("tests"))
      this.commands.set("assessment", () => this.navigateTo("tests"))
      this.commands.set("start assessment", () => this.navigateTo("tests"))

      this.commands.set("about", () => this.navigateTo("about"))
      this.commands.set("about us", () => this.navigateTo("about"))
      this.commands.set("information", () => this.navigateTo("about"))

      this.commands.set("contact", () => this.navigateTo("contact"))
      this.commands.set("contact us", () => this.navigateTo("contact"))

      // Test commands
      this.commands.set("start spiral test", () => this.startTest("spiral"))
      this.commands.set("spiral test", () => this.startTest("spiral"))
      this.commands.set("drawing test", () => this.startTest("spiral"))

      this.commands.set("start tap test", () => this.startTest("tap"))
      this.commands.set("tap test", () => this.startTest("tap"))
      this.commands.set("tap speed test", () => this.startTest("tap"))

      this.commands.set("start reaction test", () => this.startTest("reaction"))
      this.commands.set("reaction test", () => this.startTest("reaction"))
      this.commands.set("reaction time test", () => this.startTest("reaction"))

      this.commands.set("start voice test", () => this.startTest("voice"))
      this.commands.set("voice test", () => this.startTest("voice"))
      this.commands.set("voice analysis", () => this.startTest("voice"))

      // Results commands
      this.commands.set("show results", () => this.showResults())
      this.commands.set("view results", () => this.showResults())
      this.commands.set("results", () => this.showResults())

      // Theme commands
      this.commands.set("dark mode", () => this.toggleTheme("dark"))
      this.commands.set("light mode", () => this.toggleTheme("light"))
      this.commands.set("toggle theme", () => this.toggleTheme())

      // Control commands
      this.commands.set("stop listening", () => this.stopListening())
      this.commands.set("stop voice control", () => this.stopListening())
      this.commands.set("disable voice", () => this.stopListening())

      console.log("Voice commands setup complete")
    }

    processCommand(command) {
      // Find matching command
      let matchedCommand = null
      let bestMatch = 0

      for (const [key, action] of this.commands) {
        const similarity = this.calculateSimilarity(command, key)
        if (similarity > bestMatch && similarity > 0.7) {
          bestMatch = similarity
          matchedCommand = action
        }
      }

      if (matchedCommand) {
        console.log("Executing voice command:", command)
        this.showNotification(`Voice command: "${command}"`, "success")
        matchedCommand()
      } else {
        console.log("Unknown voice command:", command)
        this.showNotification(`Unknown command: "${command}"`, "warning")
      }
    }

    calculateSimilarity(str1, str2) {
      // Simple similarity calculation
      const words1 = str1.split(" ")
      const words2 = str2.split(" ")
      let matches = 0

      words1.forEach((word) => {
        if (words2.includes(word)) {
          matches++
        }
      })

      return matches / Math.max(words1.length, words2.length)
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

    startListening() {
      if (this.recognition && !this.isListening) {
        this.isListening = true
        try {
          this.recognition.start()
          this.showNotification(
            "Voice control activated. Say commands like 'go to tests' or 'start spiral test'",
            "success",
          )
          console.log("Voice control started")
        } catch (error) {
          console.error("Error starting voice recognition:", error)
          this.isListening = false
        }
      }
    }

    stopListening() {
      if (this.recognition && this.isListening) {
        this.isListening = false
        this.recognition.stop()
        this.showNotification("Voice control deactivated", "info")
        console.log("Voice control stopped")
      }
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
