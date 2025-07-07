// Global variables
const testResults = {
  spiral: { completed: false, score: 0, details: {} },
  tap: { completed: false, score: 0, details: {} },
  reaction: { completed: false, score: 0, details: {} },
  voice: { completed: false, score: 0, details: {} },
}

let isRegistered = false
let bootstrap // Declare the bootstrap variable

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  console.log("NeuroSketch initialized")

  // Initialize navigation
  initializeNavigation()

  // Initialize form validation
  initializeFormValidation()

  // Initialize test functionality
  initializeTests()

  // Check if user is already registered
  checkRegistrationStatus()
})

// Navigation functionality
function initializeNavigation() {
  // Handle navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      showSection(targetId)
    })
  })
}

// Show section
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("d-none")
  })

  // Show target section
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.remove("d-none")

    // Update active nav link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
    })

    const activeLink = document.querySelector(`a[href="#${sectionId}"]`)
    if (activeLink) {
      activeLink.classList.add("active")
    }

    // Scroll to top
    window.scrollTo(0, 0)
  }
}

// Form validation
function initializeFormValidation() {
  const form = document.getElementById("registrationForm")
  if (!form) return

  form.addEventListener("submit", (e) => {
    e.preventDefault()

    if (validateForm(form)) {
      // Store registration data
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

      localStorage.setItem("userData", JSON.stringify(userData))
      isRegistered = true

      // Show success message
      showNotification("Registration completed successfully!", "success")

      // Enable tests and redirect
      setTimeout(() => {
        showSection("tests")
      }, 1500)
    }
  })
}

// Validate form
function validateForm(form) {
  let isValid = true

  // Clear previous validation
  form.querySelectorAll(".form-control").forEach((field) => {
    field.classList.remove("is-invalid", "is-valid")
  })

  // Validate required fields
  const requiredFields = form.querySelectorAll("[required]")
  requiredFields.forEach((field) => {
    if (field.type === "radio") {
      const radioGroup = form.querySelectorAll(`[name="${field.name}"]`)
      const isChecked = Array.from(radioGroup).some((radio) => radio.checked)
      if (!isChecked) {
        isValid = false
        radioGroup.forEach((radio) => radio.classList.add("is-invalid"))
      } else {
        radioGroup.forEach((radio) => radio.classList.add("is-valid"))
      }
    } else if (field.type === "checkbox") {
      if (!field.checked) {
        isValid = false
        field.classList.add("is-invalid")
      } else {
        field.classList.add("is-valid")
      }
    } else {
      if (!field.value.trim()) {
        isValid = false
        field.classList.add("is-invalid")
      } else {
        field.classList.add("is-valid")
      }
    }
  })

  // Validate email format
  const emailField = form.querySelector('input[type="email"]')
  if (emailField && emailField.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailField.value.trim())) {
      isValid = false
      emailField.classList.add("is-invalid")
    }
  }

  return isValid
}

// Check registration status
function checkRegistrationStatus() {
  const userData = localStorage.getItem("userData")
  if (userData) {
    isRegistered = true
  }
}

// Initialize tests
function initializeTests() {
  // Test buttons
  document.getElementById("startSpiralTest")?.addEventListener("click", () => {
    if (!isRegistered) {
      showNotification("Please complete registration first!", "warning")
      showSection("register")
      return
    }
    showModal("spiralTestModal")
    initializeSpiralTest()
  })

  document.getElementById("startTapTest")?.addEventListener("click", () => {
    if (!isRegistered) {
      showNotification("Please complete registration first!", "warning")
      showSection("register")
      return
    }
    showModal("tapTestModal")
  })

  document.getElementById("startReactionTest")?.addEventListener("click", () => {
    if (!isRegistered) {
      showNotification("Please complete registration first!", "warning")
      showSection("register")
      return
    }
    showModal("reactionTestModal")
  })

  document.getElementById("startVoiceTest")?.addEventListener("click", () => {
    if (!isRegistered) {
      showNotification("Please complete registration first!", "warning")
      showSection("register")
      return
    }
    showModal("voiceTestModal")
    initializeVoiceTest()
  })

  // Results button
  document.getElementById("viewResults")?.addEventListener("click", showResults)
}

// Spiral Test
function initializeSpiralTest() {
  const canvas = document.getElementById("spiralCanvas")
  const ctx = canvas.getContext("2d")
  let isDrawing = false
  let path = []

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = "#000"
  ctx.lineWidth = 2

  // Draw guide spiral
  drawGuideSpiral(ctx, canvas.width, canvas.height)

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
    drawGuideSpiral(ctx, canvas.width, canvas.height)
    path = []
  }

  // Submit button
  document.getElementById("submitSpiral").onclick = () => {
    if (path.length < 10) {
      showNotification("Please draw a complete spiral before submitting.", "warning")
      return
    }

    const score = analyzeSpiralDrawing(path)
    testResults.spiral = {
      completed: true,
      score: score,
      details: { pathLength: path.length, timestamp: new Date().toISOString() },
    }

    updateTestStatus("spiral", "completed")
    showNotification("Spiral test completed!", "success")
    hideModal("spiralTestModal")
    checkAllTestsCompleted()
  }
}

// Draw guide spiral
function drawGuideSpiral(ctx, width, height) {
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

// Analyze spiral drawing
function analyzeSpiralDrawing(path) {
  if (path.length < 10) return 0

  // Simple scoring based on path smoothness and length
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
let tapTestActive = false
let tapScore = 0
let tapCount = 0
let tapTimeout

document.getElementById("startTapTestBtn")?.addEventListener("click", startTapTest)

function startTapTest() {
  tapTestActive = true
  tapScore = 0
  tapCount = 0

  const container = document.getElementById("tapTestContainer")
  const dot = document.getElementById("tapDot")
  const countdown = document.getElementById("tapCountdown")
  const scoreDisplay = document.getElementById("tapScoreValue")

  // Countdown
  let count = 3
  countdown.style.display = "block"
  countdown.textContent = count

  const countdownInterval = setInterval(() => {
    count--
    if (count > 0) {
      countdown.textContent = count
    } else {
      countdown.textContent = "GO!"
      setTimeout(() => {
        countdown.style.display = "none"
        showNextDot()
      }, 500)
      clearInterval(countdownInterval)
    }
  }, 1000)

  function showNextDot() {
    if (tapCount >= 10) {
      endTapTest()
      return
    }

    // Position dot randomly
    const containerRect = container.getBoundingClientRect()
    const dotSize = 60
    const maxX = container.offsetWidth - dotSize
    const maxY = container.offsetHeight - dotSize

    const x = Math.random() * maxX
    const y = Math.random() * maxY

    dot.style.left = x + "px"
    dot.style.top = y + "px"
    dot.style.display = "block"

    // Auto-hide after 2 seconds
    tapTimeout = setTimeout(() => {
      dot.style.display = "none"
      setTimeout(showNextDot, 500)
    }, 2000)
  }

  // Dot click handler
  dot.onclick = () => {
    if (!tapTestActive) return

    clearTimeout(tapTimeout)
    tapScore++
    tapCount++
    dot.style.display = "none"

    scoreDisplay.textContent = `${tapScore}/10`

    setTimeout(showNextDot, 300)
  }

  function endTapTest() {
    tapTestActive = false
    dot.style.display = "none"

    const finalScore = (tapScore / 10) * 100
    testResults.tap = {
      completed: true,
      score: finalScore,
      details: { hits: tapScore, total: 10, timestamp: new Date().toISOString() },
    }

    updateTestStatus("tap", "completed")
    showNotification(`Tap test completed! Score: ${tapScore}/10`, "success")

    setTimeout(() => {
      hideModal("tapTestModal")
      checkAllTestsCompleted()
    }, 2000)
  }
}

// Reaction Test
let reactionTestActive = false
let reactionTimes = []
let currentTrial = 0
let reactionStartTime = 0

document.getElementById("startReactionTestBtn")?.addEventListener("click", startReactionTest)

function startReactionTest() {
  reactionTestActive = true
  reactionTimes = []
  currentTrial = 0

  startNextTrial()

  function startNextTrial() {
    if (currentTrial >= 3) {
      endReactionTest()
      return
    }

    const container = document.getElementById("reactionTestContainer")
    const countdown = document.getElementById("reactionCountdown")
    const result = document.getElementById("reactionResult")

    container.className = "position-relative border rounded waiting"
    container.style.background = "#f8f9fa"
    countdown.style.display = "block"
    countdown.textContent = `Trial ${currentTrial + 1}/3 - Get Ready...`
    result.textContent = "Click when the screen turns green!"

    // Random delay before green
    const delay = 2000 + Math.random() * 3000

    const greenTimeout = setTimeout(() => {
      container.className = "position-relative border rounded ready"
      countdown.textContent = "CLICK NOW!"
      reactionStartTime = Date.now()
    }, delay)

    // Click handler
    container.onclick = () => {
      if (!reactionTestActive) return

      if (reactionStartTime === 0) {
        // Clicked too early
        clearTimeout(greenTimeout)
        container.className = "position-relative border rounded too-early"
        countdown.textContent = "Too Early!"
        result.textContent = "Wait for green before clicking. Try again..."

        setTimeout(() => {
          startNextTrial()
        }, 2000)
        return
      }

      // Valid click
      const reactionTime = Date.now() - reactionStartTime
      reactionTimes.push(reactionTime)

      countdown.textContent = `${reactionTime}ms`
      result.textContent = `Reaction time: ${reactionTime}ms`

      reactionStartTime = 0
      currentTrial++

      setTimeout(() => {
        startNextTrial()
      }, 1500)
    }
  }

  function endReactionTest() {
    reactionTestActive = false

    const avgTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
    const score = Math.max(0, Math.min(100, 100 - (avgTime - 200) / 10))

    testResults.reaction = {
      completed: true,
      score: Math.round(score),
      details: {
        times: reactionTimes,
        average: Math.round(avgTime),
        timestamp: new Date().toISOString(),
      },
    }

    updateTestStatus("reaction", "completed")
    showNotification(`Reaction test completed! Average: ${Math.round(avgTime)}ms`, "success")

    setTimeout(() => {
      hideModal("reactionTestModal")
      checkAllTestsCompleted()
    }, 2000)
  }
}

// Voice Test
function initializeVoiceTest() {
  let mediaRecorder
  let audioChunks = []

  const startBtn = document.getElementById("startVoiceRecording")
  const stopBtn = document.getElementById("stopVoiceRecording")
  const result = document.getElementById("voiceResult")

  startBtn.onclick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)
      audioChunks = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" })
        analyzeVoice(audioBlob)
      }

      mediaRecorder.start()
      startBtn.disabled = true
      stopBtn.disabled = false
      result.innerHTML = '<div class="text-success">Recording... Please read the text above.</div>'

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
          stopBtn.click()
        }
      }, 30000)
    } catch (error) {
      result.innerHTML = '<div class="text-danger">Microphone access denied or not available.</div>'
      // Simulate voice test completion for demo
      setTimeout(() => {
        completeVoiceTest(75)
      }, 2000)
    }
  }

  stopBtn.onclick = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach((track) => track.stop())
    }
    startBtn.disabled = false
    stopBtn.disabled = true
    result.innerHTML = '<div class="text-info">Processing voice analysis...</div>'
  }

  function analyzeVoice(audioBlob) {
    // Simulate voice analysis
    setTimeout(() => {
      const score = 70 + Math.random() * 25 // Random score between 70-95
      completeVoiceTest(Math.round(score))
    }, 2000)
  }

  function completeVoiceTest(score) {
    testResults.voice = {
      completed: true,
      score: score,
      details: {
        quality: score > 80 ? "Good" : score > 60 ? "Fair" : "Needs Improvement",
        timestamp: new Date().toISOString(),
      },
    }

    updateTestStatus("voice", "completed")
    showNotification(`Voice test completed! Score: ${score}%`, "success")

    setTimeout(() => {
      hideModal("voiceTestModal")
      checkAllTestsCompleted()
    }, 2000)
  }
}

// Update test status
function updateTestStatus(testName, status) {
  const statusElement = document.getElementById(`${testName}Status`)
  if (statusElement) {
    statusElement.textContent = status === "completed" ? "Completed" : "Pending"
    statusElement.className = `test-status ${status}`
  }
}

// Check if all tests completed
function checkAllTestsCompleted() {
  const completedTests = Object.values(testResults).filter((test) => test.completed).length
  const viewResultsBtn = document.getElementById("viewResults")
  const printResultsBtn = document.getElementById("printResults")

  if (completedTests > 0) {
    viewResultsBtn.disabled = false
    printResultsBtn.disabled = false
  }

  if (completedTests === 4) {
    showNotification("All tests completed! You can now view your results.", "success")
  }
}

// Show results
function showResults() {
  const completedTests = Object.values(testResults).filter((test) => test.completed)

  if (completedTests.length === 0) {
    showNotification("Please complete at least one test to view results.", "warning")
    return
  }

  const userData = JSON.parse(localStorage.getItem("userData") || "{}")
  const avgScore = completedTests.reduce((sum, test) => sum + test.score, 0) / completedTests.length

  const resultsHTML = `
        <div class="text-center mb-4">
            <h3>Assessment Summary</h3>
            <div class="row">
                <div class="col-md-6">
                    <h4>Patient Information</h4>
                    <p><strong>Name:</strong> ${userData.fullName || "N/A"}</p>
                    <p><strong>Age:</strong> ${userData.age || "N/A"}</p>
                    <p><strong>Gender:</strong> ${userData.gender || "N/A"}</p>
                </div>
                <div class="col-md-6">
                    <h4>Overall Score</h4>
                    <div class="display-4 text-primary">${Math.round(avgScore)}%</div>
                    <p class="text-muted">Based on ${completedTests.length} completed test(s)</p>
                </div>
            </div>
        </div>
        
        <div class="row">
            ${Object.entries(testResults)
              .map(
                ([testName, result]) => `
                <div class="col-md-6 mb-3">
                    <div class="card ${result.completed ? "border-success" : "border-secondary"}">
                        <div class="card-body">
                            <h5 class="card-title">${testName.charAt(0).toUpperCase() + testName.slice(1)} Test</h5>
                            <p class="card-text">
                                Status: <span class="badge ${result.completed ? "bg-success" : "bg-secondary"}">
                                    ${result.completed ? "Completed" : "Not Completed"}
                                </span>
                            </p>
                            ${
                              result.completed
                                ? `
                                <p class="card-text">Score: <strong>${result.score}%</strong></p>
                                <div class="progress">
                                    <div class="progress-bar ${result.score >= 70 ? "bg-success" : result.score >= 50 ? "bg-warning" : "bg-danger"}" 
                                         style="width: ${result.score}%"></div>
                                </div>
                            `
                                : ""
                            }
                        </div>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
        
        <div class="mt-4 p-3 border rounded ${avgScore >= 70 ? "border-success bg-light-success" : avgScore >= 50 ? "border-warning bg-light-warning" : "border-danger bg-light-danger"}">
            <h5>Assessment Interpretation</h5>
            <p>
                ${
                  avgScore >= 70
                    ? "Your assessment results indicate normal neurological function. Continue regular health monitoring."
                    : avgScore >= 50
                      ? "Your assessment shows some areas that may benefit from further evaluation. Consider consulting with a healthcare professional."
                      : "Your assessment indicates potential areas of concern. We recommend consulting with a neurologist for comprehensive evaluation."
                }
            </p>
            <small class="text-muted">
                <strong>Disclaimer:</strong> This assessment is for screening purposes only and does not constitute a medical diagnosis. 
                Please consult with qualified healthcare professionals for proper medical evaluation.
            </small>
        </div>
    `

  document.getElementById("resultsContent").innerHTML = resultsHTML
  showModal("resultsModal")
}

// Utility functions
function showModal(modalId) {
  const modal = new bootstrap.Modal(document.getElementById(modalId))
  modal.show()
}

function hideModal(modalId) {
  const modal = bootstrap.Modal.getInstance(document.getElementById(modalId))
  if (modal) {
    modal.hide()
  }
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`
  notification.style.cssText = "top: 20px; right: 20px; z-index: 9999; max-width: 300px;"
  notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `

  document.body.appendChild(notification)

  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove()
    }
  }, 5000)
}

// Export functions for global access
window.showSection = showSection
window.showNotification = showNotification
window.testResults = testResults
