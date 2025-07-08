// Advanced Voice Control System
document.addEventListener("DOMContentLoaded", () => {
  console.log("Voice control system initialized")

  const voiceControlBtn = document.getElementById("voiceControl")
  let recognition = null
  let isListening = false

  // Initialize speech recognition
  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = "en-US"

    recognition.onstart = () => {
      isListening = true
      voiceControlBtn?.classList.add("listening")
      if (window.showNotification) {
        window.showNotification("Voice control activated. Say a command...", "info")
      }
    }

    recognition.onend = () => {
      isListening = false
      voiceControlBtn?.classList.remove("listening")
    }

    recognition.onresult = (event) => {
      const command = event.results[event.results.length - 1][0].transcript.toLowerCase().trim()
      console.log("Voice command:", command)
      processVoiceCommand(command)
    }

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      isListening = false
      voiceControlBtn?.classList.remove("listening")

      if (window.showNotification) {
        window.showNotification("Voice recognition error. Please try again.", "error")
      }
    }
  } else {
    console.warn("Speech recognition not supported")
    if (voiceControlBtn) {
      voiceControlBtn.style.display = "none"
    }
  }

  // Voice control button event listener
  if (voiceControlBtn && recognition) {
    voiceControlBtn.addEventListener("click", () => {
      if (isListening) {
        recognition.stop()
      } else {
        recognition.start()
      }
    })
  }

  function processVoiceCommand(command) {
    console.log("Processing command:", command)

    // Navigation commands
    if (command.includes("go to home") || command.includes("home page")) {
      if (window.showSection) window.showSection("home")
      showCommandFeedback("Navigating to home")
    } else if (command.includes("go to register") || command.includes("registration")) {
      if (window.showSection) window.showSection("register")
      showCommandFeedback("Navigating to registration")
    } else if (command.includes("go to tests") || command.includes("test page")) {
      if (window.showSection) window.showSection("tests")
      showCommandFeedback("Navigating to tests")
    } else if (command.includes("go to about") || command.includes("about page")) {
      if (window.showSection) window.showSection("about")
      showCommandFeedback("Navigating to about")
    } else if (command.includes("go to contact") || command.includes("contact page")) {
      if (window.showSection) window.showSection("contact")
      showCommandFeedback("Navigating to contact")
    }

    // Test commands
    else if (command.includes("start spiral test") || command.includes("spiral test")) {
      const spiralBtn = document.getElementById("startSpiralTest")
      if (spiralBtn) {
        spiralBtn.click()
        showCommandFeedback("Starting spiral test")
      }
    } else if (command.includes("start tap test") || command.includes("tap test")) {
      const tapBtn = document.getElementById("startTapTest")
      if (tapBtn) {
        tapBtn.click()
        showCommandFeedback("Starting tap test")
      }
    } else if (command.includes("start reaction test") || command.includes("reaction test")) {
      const reactionBtn = document.getElementById("startReactionTest")
      if (reactionBtn) {
        reactionBtn.click()
        showCommandFeedback("Starting reaction test")
      }
    } else if (command.includes("start voice test") || command.includes("voice test")) {
      const voiceBtn = document.getElementById("startVoiceTest")
      if (voiceBtn) {
        voiceBtn.click()
        showCommandFeedback("Starting voice test")
      }
    }

    // Results commands
    else if (command.includes("show results") || command.includes("view results")) {
      const resultsBtn = document.getElementById("viewResults")
      if (resultsBtn && !resultsBtn.disabled) {
        resultsBtn.click()
        showCommandFeedback("Showing results")
      } else {
        showCommandFeedback("Please complete at least one test first")
      }
    } else if (command.includes("save results")) {
      const saveBtn = document.getElementById("saveResults")
      if (saveBtn && !saveBtn.disabled) {
        saveBtn.click()
        showCommandFeedback("Saving results")
      } else {
        showCommandFeedback("No results to save")
      }
    }

    // Theme commands
    else if (command.includes("dark mode") || command.includes("switch to dark")) {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light"
      if (currentTheme === "light") {
        const themeBtn = document.getElementById("themeToggle")
        if (themeBtn) themeBtn.click()
      }
      showCommandFeedback("Switching to dark mode")
    } else if (command.includes("light mode") || command.includes("switch to light")) {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light"
      if (currentTheme === "dark") {
        const themeBtn = document.getElementById("themeToggle")
        if (themeBtn) themeBtn.click()
      }
      showCommandFeedback("Switching to light mode")
    }

    // Help command
    else if (command.includes("help") || command.includes("commands")) {
      showHelpDialog()
    }

    // Unknown command
    else {
      showCommandFeedback("Command not recognized. Say 'help' for available commands.")
    }

    // Stop listening after processing command
    if (recognition && isListening) {
      recognition.stop()
    }
  }

  function showCommandFeedback(message) {
    if (window.showNotification) {
      window.showNotification(message, "success")
    }
  }

  function showHelpDialog() {
    const helpMessage = `
      Available voice commands:
      
      Navigation:
      • "Go to home" - Navigate to home page
      • "Go to register" - Navigate to registration
      • "Go to tests" - Navigate to tests
      • "Go to about" - Navigate to about page
      • "Go to contact" - Navigate to contact page
      
      Tests:
      • "Start spiral test" - Begin spiral drawing test
      • "Start tap test" - Begin tap speed test
      • "Start reaction test" - Begin reaction time test
      • "Start voice test" - Begin voice analysis test
      
      Results:
      • "Show results" - View test results
      • "Save results" - Save results to storage
      
      Theme:
      • "Dark mode" - Switch to dark theme
      • "Light mode" - Switch to light theme
      
      • "Help" - Show this help dialog
    `

    alert(helpMessage)
  }
})
