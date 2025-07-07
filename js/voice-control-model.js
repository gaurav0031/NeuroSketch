// Advanced Voice Control System
document.addEventListener("DOMContentLoaded", () => {
  console.log("Voice control system initialized")

  let recognition = null
  let isListening = false

  // Check for speech recognition support
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition()

    // Configure recognition
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = "en-US"
    recognition.maxAlternatives = 1

    // Add voice control button to navbar if it doesn't exist
    addVoiceControlButton()

    // Set up event listeners
    setupVoiceRecognition()
  } else {
    console.log("Speech recognition not supported")
  }

  function addVoiceControlButton() {
    const navbar = document.querySelector(".navbar-nav")
    if (navbar && !document.getElementById("voiceControlBtn")) {
      const voiceItem = document.createElement("li")
      voiceItem.className = "nav-item ms-2"
      voiceItem.innerHTML = `
        <button class="btn btn-outline-primary btn-sm" id="voiceControlBtn" title="Voice Control">
          <i class="fas fa-microphone"></i>
        </button>
      `
      navbar.appendChild(voiceItem)

      // Add click handler
      const voiceBtn = document.getElementById("voiceControlBtn")
      voiceBtn.addEventListener("click", toggleVoiceRecognition)
    }
  }

  function setupVoiceRecognition() {
    recognition.onstart = () => {
      isListening = true
      updateVoiceButton(true)
      if (window.showNotification) {
        window.showNotification("Voice control activated. Say a command...", "info")
      }
    }

    recognition.onend = () => {
      isListening = false
      updateVoiceButton(false)
    }

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase().trim()
      console.log("Voice command:", command)
      processVoiceCommand(command)
    }

    recognition.onerror = (event) => {
      isListening = false
      updateVoiceButton(false)
      console.error("Speech recognition error:", event.error)
      if (window.showNotification) {
        window.showNotification("Voice recognition error. Please try again.", "error")
      }
    }
  }

  function toggleVoiceRecognition() {
    if (isListening) {
      recognition.stop()
    } else {
      try {
        recognition.start()
      } catch (error) {
        console.error("Error starting voice recognition:", error)
        if (window.showNotification) {
          window.showNotification("Could not start voice recognition.", "error")
        }
      }
    }
  }

  function updateVoiceButton(listening) {
    const voiceBtn = document.getElementById("voiceControlBtn")
    if (voiceBtn) {
      const icon = voiceBtn.querySelector("i")
      if (listening) {
        voiceBtn.classList.remove("btn-outline-primary")
        voiceBtn.classList.add("btn-danger")
        icon.classList.remove("fa-microphone")
        icon.classList.add("fa-stop")
        voiceBtn.title = "Stop Voice Control"
      } else {
        voiceBtn.classList.remove("btn-danger")
        voiceBtn.classList.add("btn-outline-primary")
        icon.classList.remove("fa-stop")
        icon.classList.add("fa-microphone")
        voiceBtn.title = "Voice Control"
      }
    }
  }

  function processVoiceCommand(command) {
    console.log("Processing command:", command)

    // Navigation commands
    if (command.includes("go to home") || command.includes("home page") || command.includes("go home")) {
      if (window.showSection) {
        window.showSection("home")
        showCommandSuccess("Navigating to home")
      }
    } else if (command.includes("register") || command.includes("registration") || command.includes("sign up")) {
      if (window.showSection) {
        window.showSection("register")
        showCommandSuccess("Navigating to registration")
      }
    } else if (command.includes("about") || command.includes("about us")) {
      scrollToSection("about")
      showCommandSuccess("Scrolling to about section")
    } else if (command.includes("contact") || command.includes("contact us")) {
      scrollToSection("contact")
      showCommandSuccess("Scrolling to contact section")
    }

    // Test commands
    else if (command.includes("start spiral test") || command.includes("spiral test")) {
      startTestByVoice("spiral")
    } else if (command.includes("start tap test") || command.includes("tap test")) {
      startTestByVoice("tap")
    } else if (command.includes("start reaction test") || command.includes("reaction test")) {
      startTestByVoice("reaction")
    } else if (command.includes("start voice test") || command.includes("voice test")) {
      startTestByVoice("voice")
    }

    // Results commands
    else if (command.includes("show results") || command.includes("view results") || command.includes("results")) {
      if (window.showResults) {
        window.showResults()
        showCommandSuccess("Showing results")
      }
    }

    // Theme commands
    else if (command.includes("dark mode") || command.includes("dark theme")) {
      const themeToggle = document.getElementById("themeToggle")
      if (themeToggle && document.body.getAttribute("data-theme") !== "dark") {
        themeToggle.click()
        showCommandSuccess("Switching to dark mode")
      }
    } else if (command.includes("light mode") || command.includes("light theme")) {
      const themeToggle = document.getElementById("themeToggle")
      if (themeToggle && document.body.getAttribute("data-theme") !== "light") {
        themeToggle.click()
        showCommandSuccess("Switching to light mode")
      }
    }

    // Help command
    else if (command.includes("help") || command.includes("commands")) {
      showVoiceHelp()
    }

    // Unknown command
    else {
      if (window.showNotification) {
        window.showNotification("Command not recognized. Say 'help' for available commands.", "warning")
      }
    }
  }

  function startTestByVoice(testType) {
    // Check if user is registered
    const userData = localStorage.getItem("userData")
    if (!userData) {
      if (window.showNotification) {
        window.showNotification("Please complete registration first!", "warning")
      }
      if (window.showSection) {
        window.showSection("register")
      }
      return
    }

    // Navigate to tests section first
    if (window.showSection) {
      window.showSection("tests")
    }

    // Start the specific test
    setTimeout(() => {
      const testBtn = document.getElementById(`start${testType.charAt(0).toUpperCase() + testType.slice(1)}Test`)
      if (testBtn) {
        testBtn.click()
        showCommandSuccess(`Starting ${testType} test`)
      }
    }, 500)
  }

  function scrollToSection(sectionId) {
    // First ensure we're on home page
    if (window.showSection) {
      window.showSection("home")
    }

    // Then scroll to section
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  function showCommandSuccess(message) {
    if (window.showNotification) {
      window.showNotification(message, "success")
    }
  }

  function showVoiceHelp() {
    const helpMessage = `
      Available voice commands:
      • "Go to home" - Navigate to home page
      • "Register" - Go to registration
      • "About" - Scroll to about section
      • "Contact" - Scroll to contact section
      • "Start [test] test" - Start specific test
      • "Show results" - View test results
      • "Dark mode" / "Light mode" - Change theme
      • "Help" - Show this help
    `

    if (window.showNotification) {
      window.showNotification(helpMessage, "info")
    }
  }

  // Export for global access
  window.voiceControl = {
    isListening: () => isListening,
    toggle: toggleVoiceRecognition,
    processCommand: processVoiceCommand,
  }
})
