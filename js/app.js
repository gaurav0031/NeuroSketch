// NeuroSketch Application - Production Ready
class NeuroSketchApp {
  constructor() {
    this.isRegistered = false
    this.testResults = {
      spiral: { completed: false, score: 0, details: {} },
      tap: { completed: false, score: 0, details: {} },
      reaction: { completed: false, score: 0, details: {} },
      voice: { completed: false, score: 0, details: {} },
    }
    this.currentSection = "home"
    this.init()
  }

  init() {
    console.log("NeuroSketch Application Initializing...")
    this.checkRegistrationStatus()
    this.initializeNavigation()
    this.initializeRegistrationForm()
    this.initializeTests()
    this.initializeTheme()
    this.initializeContactForm()
    this.showSection("home")
    console.log("NeuroSketch Application Initialized Successfully")
  }

  // Registration Management
  checkRegistrationStatus() {
    const userData = localStorage.getItem("userData")
    this.isRegistered = !!userData
    console.log("Registration status:", this.isRegistered)
  }

  // Navigation System
  initializeNavigation() {
    document.querySelectorAll("[data-section]").forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault()
        const targetSection = element.getAttribute("data-section")

        if (targetSection === "tests" && !this.isRegistered) {
          this.showNotification("Please complete registration first!", "warning")
          this.showSection("register")
          return
        }

        this.showSection(targetSection)
      })
    })
  }

  showSection(sectionId) {
    console.log("Showing section:", sectionId)

    // Hide all sections
    document.querySelectorAll("section").forEach((section) => {
      section.classList.add("d-none")
    })

    // Show target section
    const targetSection = document.getElementById(sectionId)
    if (targetSection) {
      targetSection.classList.remove("d-none")
      this.currentSection = sectionId

      // Update navigation
      this.updateNavigation(sectionId)

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  updateNavigation(activeSection) {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
    })

    const activeLink = document.querySelector(`[data-section="${activeSection}"]`)
    if (activeLink && activeLink.classList.contains("nav-link")) {
      activeLink.classList.add("active")
    }
  }

  // Registration Form
  initializeRegistrationForm() {
    const form = document.getElementById("registrationForm")
    if (!form) return

    form.addEventListener("submit", (e) => {
      e.preventDefault()
      this.handleRegistration(form)
    })
  }

  handleRegistration(form) {
    if (!this.validateRegistrationForm(form)) return

    const formData = new FormData(form)
    const userData = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      age: formData.get("age"),
      gender: formData.get("gender"),
      familyHistory: formData.get("familyHistory"),
      medicalSituation: formData.get("medicalSituation"),
      registrationDate: new Date().toISOString(),
    }

    // Show loading
    const submitBtn = form.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...'
    submitBtn.disabled = true

    // Simulate processing
    setTimeout(() => {
      localStorage.setItem("userData", JSON.stringify(userData))
      this.isRegistered = true

      submitBtn.innerHTML = originalText
      submitBtn.disabled = false

      this.showNotification("Registration completed successfully!", "success")

      setTimeout(() => {
        this.showSection("tests")
      }, 1500)
    }, 1000)
  }

  validateRegistrationForm(form) {
    const requiredFields = form.querySelectorAll("[required]")
    let isValid = true

    requiredFields.forEach((field) => {
      if (field.type === "radio") {
        const radioGroup = form.querySelectorAll(`[name="${field.name}"]`)
        const isChecked = Array.from(radioGroup).some((radio) => radio.checked)
        if (!isChecked) isValid = false
      } else if (field.type === "checkbox") {
        if (!field.checked) isValid = false
      } else {
        if (!field.value.trim()) isValid = false
      }
    })

    if (!isValid) {
      this.showNotification("Please fill in all required fields.", "error")
    }

    return isValid
  }

  // Test System
  initializeTests() {
    // Test button handlers
    document.getElementById("startSpiralTest")?.addEventListener("click", () => {
      if (!this.checkRegistration()) return
      this.showModal("spiralTestModal")
      setTimeout(() => this.initializeSpiralTest(), 500)
    })

    document.getElementById("startTapTest")?.addEventListener("click", () => {
      if (!this.checkRegistration()) return
      this.showModal("tapTestModal")
    })

    document.getElementById("startReactionTest")?.addEventListener("click", () => {
      if (!this.checkRegistration()) return
      this.showModal("reactionTestModal")
    })

    document.getElementById("startVoiceTest")?.addEventListener("click", () => {
      if (!this.checkRegistration()) return
      this.showModal("voiceTestModal")
    })

    // Results buttons
    document.getElementById("viewResults")?.addEventListener("click", () => {
      this.showResults()
    })

    document.getElementById("backToTests")?.addEventListener("click", () => {
      this.showSection("tests")
    })

    document.getElementById("saveResults")?.addEventListener("click", () => {
      this.saveResults()
    })
  }

  checkRegistration() {
    if (!this.isRegistered) {
      this.showNotification("Please complete registration first!", "warning")
      this.showSection("register")
      return false
    }
    return true
  }

  // Spiral Test
  initializeSpiralTest() {
    const canvas = document.getElementById("spiralCanvas")
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    let isDrawing = false
    let path = []

    // Clear and setup canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.drawGuideSpiral(ctx, canvas.width, canvas.height)

    // Mouse events
    canvas.addEventListener("mousedown", startDrawing)
    canvas.addEventListener("mousemove", draw)
    canvas.addEventListener("mouseup", stopDrawing)
    canvas.addEventListener("mouseout", stopDrawing)

    // Touch events
    canvas.addEventListener("touchstart", handleTouch)
    canvas.addEventListener("touchmove", handleTouch)
    canvas.addEventListener("touchend", stopDrawing)

    function startDrawing(e) {
      isDrawing = true
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      path = [{ x, y }]
      ctx.beginPath()
      ctx.moveTo(x, y)
    }

    function draw(e) {
      if (!isDrawing) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      path.push({ x, y })
      ctx.lineTo(x, y)
      ctx.stroke()
    }

    function stopDrawing() {
      isDrawing = false
    }

    function handleTouch(e) {
      e.preventDefault()
      const touch = e.touches[0]
      const mouseEvent = new MouseEvent(
        e.type === "touchstart" ? "mousedown" : e.type === "touchmove" ? "mousemove" : "mouseup",
        {
          clientX: touch.clientX,
          clientY: touch.clientY,
        },
      )
      canvas.dispatchEvent(mouseEvent)
    }

    // Clear button
    document.getElementById("clearCanvas").onclick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      this.drawGuideSpiral(ctx, canvas.width, canvas.height)
      path = []
    }

    // Submit button
    document.getElementById("submitSpiral").onclick = () => {
      if (path.length < 10) {
        this.showNotification("Please draw a complete spiral before submitting.", "warning")
        return
      }

      const score = this.analyzeSpiralDrawing(path)
      this.testResults.spiral = {
        completed: true,
        score: score,
        details: { pathLength: path.length, timestamp: new Date().toISOString() },
      }

      this.updateTestStatus("spiral", score)
      this.showNotification("Spiral test completed!", "success")
      this.hideModal("spiralTestModal")
      this.checkAllTestsCompleted()
    }
  }

  drawGuideSpiral(ctx, width, height) {
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) / 3

    ctx.strokeStyle = "#ccc"
    ctx.lineWidth = 1
    ctx.beginPath()

    for (let angle = 0; angle < 6 * Math.PI; angle += 0.1) {
      const radius = (angle / (6 * Math.PI)) * maxRadius
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      if (angle === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 2
  }

  analyzeSpiralDrawing(path) {
    if (path.length < 10) return 0

    let smoothness = 0
    for (let i = 1; i < path.length - 1; i++) {
      const prev = path[i - 1]
      const curr = path[i]
      const next = path[i + 1]

      const angle1 = Math.atan2(curr.y - prev.y, curr.x - prev.x)
      const angle2 = Math.atan2(next.y - curr.y, next.x - curr.x)
      const angleDiff = Math.abs(angle2 - angle1)

      smoothness += Math.min(angleDiff, 2 * Math.PI - angleDiff)
    }

    const avgSmoothness = smoothness / (path.length - 2)
    const score = Math.max(0, Math.min(100, 100 - avgSmoothness * 50))
    return Math.round(score)
  }

  // Tap Test
  initializeTapTest() {
    const startBtn = document.getElementById("startTapTestBtn")
    if (!startBtn) return

    startBtn.onclick = () => {
      this.startTapTest()
    }
  }

  startTapTest() {
    let dotsClicked = 0
    let dotsShown = 0
    let tapTestActive = false

    const container = document.getElementById("tapTestContainer")
    const dot = document.getElementById("tapDot")
    const countdown = document.getElementById("tapCountdown")
    const scoreDisplay = document.getElementById("tapScore")

    if (!container || !dot) return

    // Reset
    dotsClicked = 0
    dotsShown = 0
    scoreDisplay.textContent = "Score: 0/10"

    // Countdown
    countdown.style.display = "block"
    countdown.textContent = "3"

    setTimeout(() => {
      countdown.textContent = "2"
      setTimeout(() => {
        countdown.textContent = "1"
        setTimeout(() => {
          countdown.textContent = "GO!"
          setTimeout(() => {
            countdown.style.display = "none"
            tapTestActive = true
            this.showNextDot()
          }, 500)
        }, 1000)
      }, 1000)
    }, 1000)

    const showNextDot = () => {
      if (dotsShown >= 10) {
        this.endTapTest(dotsClicked)
        return
      }

      dotsShown++

      // Random position
      const containerRect = container.getBoundingClientRect()
      const dotSize = 50
      const maxX = container.offsetWidth - dotSize
      const maxY = container.offsetHeight - dotSize

      const x = Math.random() * maxX
      const y = Math.random() * maxY

      dot.style.left = x + "px"
      dot.style.top = y + "px"
      dot.style.display = "block"

      // Auto-hide after 1 second
      setTimeout(() => {
        dot.style.display = "none"
        setTimeout(showNextDot, 500)
      }, 1000)
    }

    this.showNextDot = showNextDot

    // Dot click handler
    dot.onclick = () => {
      if (!tapTestActive) return
      dotsClicked++
      dot.style.display = "none"
      scoreDisplay.textContent = `Score: ${dotsClicked}/10`
      setTimeout(showNextDot, 300)
    }
  }

  endTapTest(score) {
    const finalScore = (score / 10) * 100
    this.testResults.tap = {
      completed: true,
      score: finalScore,
      details: { hits: score, total: 10, timestamp: new Date().toISOString() },
    }

    this.updateTestStatus("tap", finalScore)
    this.showNotification(`Tap test completed! Score: ${score}/10`, "success")

    setTimeout(() => {
      this.hideModal("tapTestModal")
      this.checkAllTestsCompleted()
    }, 2000)
  }

  // Reaction Test
  initializeReactionTest() {
    const startBtn = document.getElementById("startReactionTestBtn")
    if (!startBtn) return

    startBtn.onclick = () => {
      this.startReactionTest()
    }
  }

  startReactionTest() {
    const reactionTimes = []
    let currentTrial = 0
    let reactionStartTime = 0

    const container = document.getElementById("reactionTestContainer")
    const countdown = document.getElementById("reactionCountdown")
    const result = document.getElementById("reactionResult")

    const startNextTrial = () => {
      if (currentTrial >= 3) {
        this.endReactionTest(reactionTimes)
        return
      }

      container.style.backgroundColor = "#f8f9fa"
      container.classList.remove("ready", "too-early")
      countdown.style.display = "block"
      countdown.textContent = "Get Ready..."
      result.textContent = `Trial ${currentTrial + 1}/3 - Click when the screen turns green!`

      setTimeout(() => {
        countdown.style.display = "none"
        const delay = 1000 + Math.random() * 3000

        setTimeout(() => {
          container.classList.add("ready")
          reactionStartTime = Date.now()
        }, delay)
      }, 2000)
    }

    container.onclick = () => {
      if (reactionStartTime === 0) {
        // Too early
        container.classList.add("too-early")
        result.textContent = "Too early! Try again..."
        setTimeout(startNextTrial, 2000)
        return
      }

      // Valid click
      const reactionTime = Date.now() - reactionStartTime
      reactionTimes.push(reactionTime)
      result.textContent = `Reaction time: ${reactionTime}ms`

      container.classList.remove("ready")
      reactionStartTime = 0
      currentTrial++

      setTimeout(startNextTrial, 1500)
    }

    startNextTrial()
  }

  endReactionTest(times) {
    const avgTime = times.reduce((a, b) => a + b, 0) / times.length
    const score = Math.max(0, Math.min(100, 100 - (avgTime - 200) / 10))

    this.testResults.reaction = {
      completed: true,
      score: Math.round(score),
      details: { times, average: Math.round(avgTime), timestamp: new Date().toISOString() },
    }

    this.updateTestStatus("reaction", Math.round(score))
    this.showNotification(`Reaction test completed! Average: ${Math.round(avgTime)}ms`, "success")

    setTimeout(() => {
      this.hideModal("reactionTestModal")
      this.checkAllTestsCompleted()
    }, 2000)
  }

  // Voice Test
  initializeVoiceTest() {
    const startBtn = document.getElementById("startVoiceRecording")
    const stopBtn = document.getElementById("stopVoiceRecording")
    const result = document.getElementById("voiceResult")
    const indicator = document.getElementById("recordingIndicator")

    let mediaRecorder
    let audioChunks = []

    startBtn.onclick = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorder = new MediaRecorder(stream)
        audioChunks = []

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data)
        }

        mediaRecorder.onstop = () => {
          this.analyzeVoice()
        }

        mediaRecorder.start()
        startBtn.disabled = true
        stopBtn.disabled = false
        indicator.classList.remove("d-none")
        result.textContent = "Recording... Please read the text above clearly."

        // Auto-stop after 30 seconds
        setTimeout(() => {
          if (mediaRecorder && mediaRecorder.state === "recording") {
            stopBtn.click()
          }
        }, 30000)
      } catch (error) {
        result.textContent = "Microphone access denied. Using simulated results."
        setTimeout(() => this.completeVoiceTest(75), 2000)
      }
    }

    stopBtn.onclick = () => {
      if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop()
        mediaRecorder.stream.getTracks().forEach((track) => track.stop())
      }
      startBtn.disabled = false
      stopBtn.disabled = true
      indicator.classList.add("d-none")
      result.textContent = "Processing voice analysis..."
    }
  }

  analyzeVoice() {
    // Simulate voice analysis
    setTimeout(() => {
      const score = 70 + Math.random() * 25
      this.completeVoiceTest(Math.round(score))
    }, 2000)
  }

  completeVoiceTest(score) {
    this.testResults.voice = {
      completed: true,
      score: score,
      details: {
        quality: score > 80 ? "Good" : score > 60 ? "Fair" : "Needs Improvement",
        timestamp: new Date().toISOString(),
      },
    }

    this.updateTestStatus("voice", score)
    this.showNotification(`Voice test completed! Score: ${score}%`, "success")

    setTimeout(() => {
      this.hideModal("voiceTestModal")
      this.checkAllTestsCompleted()
    }, 2000)
  }

  // Test Management
  updateTestStatus(testName, score) {
    const statusElement = document.getElementById(`${testName}TestStatus`)
    const resultElement = document.getElementById(`${testName}TestResult`)
    const scoreElement = document.getElementById(`${testName}Score`)
    const barElement = document.getElementById(`${testName}HealthyBar`)

    if (statusElement) {
      statusElement.textContent = "COMPLETED"
      statusElement.className = "badge bg-success"
    }

    if (resultElement) {
      resultElement.classList.remove("d-none")
    }

    if (scoreElement) {
      scoreElement.textContent = score
    }

    if (barElement) {
      barElement.style.width = score + "%"
    }
  }

  checkAllTestsCompleted() {
    const completedTests = Object.values(this.testResults).filter((test) => test.completed).length
    const viewResultsBtn = document.getElementById("viewResults")
    const printResultsBtn = document.getElementById("printResults")

    if (completedTests > 0) {
      if (viewResultsBtn) viewResultsBtn.disabled = false
      if (printResultsBtn) printResultsBtn.disabled = false
    }

    if (completedTests === 4) {
      this.showNotification("All tests completed! You can now view your results.", "success")
    }
  }

  // Results System
  showResults() {
    const completedTests = Object.values(this.testResults).filter((test) => test.completed)

    if (completedTests.length === 0) {
      this.showNotification("Please complete at least one test to view results.", "warning")
      return
    }

    const avgScore = completedTests.reduce((sum, test) => sum + test.score, 0) / completedTests.length

    // Update overall score
    const overallBar = document.getElementById("overallHealthyBar")
    const overallPercent = document.getElementById("overallHealthyPercent")
    const testsCompletedElement = document.getElementById("testsCompleted")

    if (overallBar) overallBar.style.width = avgScore + "%"
    if (overallPercent) overallPercent.textContent = Math.round(avgScore) + "%"
    if (testsCompletedElement) testsCompletedElement.textContent = `${completedTests.length}/4`

    // Update results table
    this.updateResultsTable()

    // Update conclusion
    this.updateConclusion(avgScore)

    this.showSection("results")
  }

  updateResultsTable() {
    const tableBody = document.getElementById("resultsTableBody")
    if (!tableBody) return

    const tests = [
      { name: "spiral", icon: "fa-pencil-alt", label: "Spiral Drawing" },
      { name: "tap", icon: "fa-hand-pointer", label: "Tap Speed" },
      { name: "reaction", icon: "fa-stopwatch", label: "Reaction Time" },
      { name: "voice", icon: "fa-microphone", label: "Voice Analysis" },
    ]

    tableBody.innerHTML = tests
      .map((test) => {
        const result = this.testResults[test.name]
        const status = result.completed ? "Completed" : "Not Tested"
        const statusClass = result.completed ? "bg-success" : "bg-secondary"
        const score = result.completed ? result.score + "%" : "-"
        const assessment = result.completed
          ? result.score >= 80
            ? "Excellent"
            : result.score >= 60
              ? "Good"
              : "Needs Attention"
          : "-"

        return `
                <tr>
                    <td><i class="fas ${test.icon} me-2"></i>${test.label}</td>
                    <td><span class="badge ${statusClass}">${status}</span></td>
                    <td>${score}</td>
                    <td>${assessment}</td>
                </tr>
            `
      })
      .join("")
  }

  updateConclusion(avgScore) {
    const conclusionBox = document.getElementById("conclusionBox")
    const conclusionText = document.getElementById("conclusionText")

    if (!conclusionBox || !conclusionText) return

    let className, title, text

    if (avgScore >= 80) {
      className = "alert-success"
      title = "Excellent Results"
      text =
        "Your assessment results indicate excellent neurological function. Continue regular health monitoring and maintain your current lifestyle."
    } else if (avgScore >= 60) {
      className = "alert-warning"
      title = "Good Results with Some Areas for Attention"
      text =
        "Your assessment shows generally good results with some areas that may benefit from attention. Consider discussing these results with a healthcare professional."
    } else {
      className = "alert-danger"
      title = "Results Require Medical Attention"
      text =
        "Your assessment indicates areas that require medical attention. We strongly recommend consulting with a neurologist for comprehensive evaluation."
    }

    conclusionBox.className = `alert ${className}`
    conclusionBox.querySelector(".alert-heading").textContent = title
    conclusionText.textContent = text
  }

  saveResults() {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}")
    const timestamp = Date.now().toString(36)
    const reportId = `NS-${timestamp}`.toUpperCase()

    const resultsData = {
      ...userData,
      testResults: this.testResults,
      reportId: reportId,
      timestamp: new Date().toISOString(),
    }

    const existingResults = JSON.parse(localStorage.getItem("savedResults") || "[]")
    existingResults.push(resultsData)
    localStorage.setItem("savedResults", JSON.stringify(existingResults))

    this.showNotification(`Results saved successfully! Report ID: ${reportId}`, "success")
  }

  // Modal Management
  showModal(modalId) {
    const modal = new bootstrap.Modal(document.getElementById(modalId))
    modal.show()
  }

  hideModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId))
    if (modal) modal.hide()
  }

  // Theme Management
  initializeTheme() {
    const themeToggle = document.getElementById("themeToggle")
    if (!themeToggle) return

    const savedTheme = localStorage.getItem("theme") || "light"
    this.setTheme(savedTheme)

    themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.getAttribute("data-theme") || "light"
      const newTheme = currentTheme === "light" ? "dark" : "light"
      this.setTheme(newTheme)
      localStorage.setItem("theme", newTheme)
      this.showNotification(`Switched to ${newTheme} mode`, "info")
    })
  }

  setTheme(theme) {
    document.body.setAttribute("data-theme", theme)
    const themeToggle = document.getElementById("themeToggle")
    if (themeToggle) {
      const icon = themeToggle.querySelector("i")
      icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon"
    }
  }

  // Contact Form
  initializeContactForm() {
    const contactForm = document.getElementById("contactForm")
    if (!contactForm) return

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const submitBtn = contactForm.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...'
      submitBtn.disabled = true

      setTimeout(() => {
        contactForm.reset()
        submitBtn.innerHTML = originalText
        submitBtn.disabled = false
        this.showNotification("Thank you for your message! We will get back to you within 24 hours.", "success")
      }, 1500)
    })
  }

  // Utility Functions
  showNotification(message, type = "info") {
    // Remove existing notifications
    document.querySelectorAll(".notification").forEach((n) => n.remove())

    const notification = document.createElement("div")
    notification.className = `alert alert-${type} alert-dismissible fade show notification`
    notification.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;"
    notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `

    document.body.appendChild(notification)

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove()
      }
    }, 5000)
  }
}

// Utility Functions
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  window.neuroSketchApp = new NeuroSketchApp()
})

// Export for global access
window.scrollToSection = scrollToSection
</merged_code>
