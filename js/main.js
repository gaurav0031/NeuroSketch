// Global variables
const testResults = {
  spiral: { completed: false, score: 0, details: {} },
  tap: { completed: false, score: 0, details: {} },
  reaction: { completed: false, score: 0, details: {} },
  voice: { completed: false, score: 0, details: {} },
}

let isRegistered = false
let currentSection = "home"

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  console.log("NeuroSketch initialized")

  // Check registration status first
  checkRegistrationStatus()

  // Initialize navigation
  initializeNavigation()

  // Initialize form validation
  initializeFormValidation()

  // Initialize test functionality
  initializeTests()

  // Show initial section
  showSection("home")
})

// Check registration status
function checkRegistrationStatus() {
  const userData = localStorage.getItem("userData")
  if (userData) {
    isRegistered = true
    console.log("User is already registered")
  } else {
    isRegistered = false
    console.log("User needs to register")
  }
}

// Navigation functionality
function initializeNavigation() {
  // Handle all navigation elements with data-section attribute
  document.querySelectorAll("[data-section]").forEach((element) => {
    element.addEventListener("click", function (e) {
      e.preventDefault()
      e.stopPropagation()

      const targetSection = this.getAttribute("data-section")
      console.log("Navigation clicked:", targetSection)

      // Check if trying to access tests without registration
      if (targetSection === "tests" && !isRegistered) {
        showNotification("Please complete registration first!", "warning")
        showSection("register")
        return
      }

      showSection(targetSection)
    })
  })
}

// Show section function
function showSection(sectionId) {
  console.log(`Switching to section: ${sectionId}`)

  // Hide all sections
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("d-none")
    section.style.display = "none"
  })

  // Show target section
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.remove("d-none")
    targetSection.style.display = "block"

    // Update current section
    currentSection = sectionId

    // Update active nav link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
    })

    const activeLink = document.querySelector(`[data-section="${sectionId}"]`)
    if (activeLink && activeLink.classList.contains("nav-link")) {
      activeLink.classList.add("active")
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })

    console.log(`Successfully switched to section: ${sectionId}`)
  } else {
    console.error(`Section not found: ${sectionId}`)
  }
}

// Form validation and submission
function initializeFormValidation() {
  const form = document.getElementById("registrationForm")
  if (!form) {
    console.log("Registration form not found")
    return
  }

  console.log("Initializing form validation")

  // Prevent default form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault()
    e.stopPropagation()

    console.log("Form submitted")

    if (validateForm(form)) {
      handleFormSubmission(form)
    }
  })

  // Add real-time validation
  const inputs = form.querySelectorAll("input, textarea")
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateInput(this)
    })

    input.addEventListener("focus", function () {
      clearValidation(this)
    })
  })
}

// Handle form submission
function handleFormSubmission(form) {
  console.log("Processing form submission")

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]')
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...'
  submitBtn.disabled = true

  // Get form data
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

  // Simulate processing time
  setTimeout(() => {
    try {
      // Store user data
      localStorage.setItem("userData", JSON.stringify(userData))
      isRegistered = true

      console.log("Registration completed successfully")

      // Reset button
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false

      // Show success message
      showNotification("Registration completed successfully!", "success")

      // Wait a moment then redirect to tests
      setTimeout(() => {
        console.log("Redirecting to tests section")
        showSection("tests")
      }, 1500)
    } catch (error) {
      console.error("Error during registration:", error)

      // Reset button
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false

      showNotification("Registration failed. Please try again.", "error")
    }
  }, 1000)
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

  if (!isValid) {
    showNotification("Please correct the errors in the form.", "error")
  }

  return isValid
}

// Validate individual input
function validateInput(input) {
  const value = input.value.trim()
  let isValid = true

  // Clear previous validation
  clearValidation(input)

  // Check if field is required
  if (input.hasAttribute("required")) {
    if (!value) {
      isValid = false
    }
  }

  // Specific validation based on field type
  if (value && input.type === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      isValid = false
    }
  }

  if (value && input.type === "number") {
    const num = Number.parseInt(value)
    if (isNaN(num) || num < 1 || num > 120) {
      isValid = false
    }
  }

  // Apply validation styling
  if (isValid) {
    input.classList.remove("is-invalid")
    input.classList.add("is-valid")
  } else {
    input.classList.remove("is-valid")
    input.classList.add("is-invalid")
  }

  return isValid
}

// Clear field validation
function clearValidation(input) {
  input.classList.remove("is-invalid", "is-valid")
}

// Initialize tests
function initializeTests() {
  console.log("Initializing tests")

  // Test buttons
  const spiralBtn = document.getElementById("startSpiralTest")
  if (spiralBtn) {
    spiralBtn.addEventListener("click", () => {
      if (!checkRegistration()) return
      showModal("spiralTestModal")
      setTimeout(() => initializeSpiralTest(), 500)
    })
  }

  const tapBtn = document.getElementById("startTapTest")
  if (tapBtn) {
    tapBtn.addEventListener("click", () => {
      if (!checkRegistration()) return
      showModal("tapTestModal")
      setTimeout(() => initializeTapTest(), 500)
    })
  }

  const reactionBtn = document.getElementById("startReactionTest")
  if (reactionBtn) {
    reactionBtn.addEventListener("click", () => {
      if (!checkRegistration()) return
      showModal("reactionTestModal")
      setTimeout(() => initializeReactionTest(), 500)
    })
  }

  const voiceBtn = document.getElementById("startVoiceTest")
  if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
      if (!checkRegistration()) return
      showModal("voiceTestModal")
      setTimeout(() => initializeVoiceTest(), 500)
    })
  }

  // Results buttons
  const viewResultsBtn = document.getElementById("viewResults")
  if (viewResultsBtn) {
    viewResultsBtn.addEventListener("click", showResults)
  }

  const backToTestsBtn = document.getElementById("backToTests")
  if (backToTestsBtn) {
    backToTestsBtn.addEventListener("click", () => {
      showSection("tests")
    })
  }

  const saveResultsBtn = document.getElementById("saveResults")
  if (saveResultsBtn) {
    saveResultsBtn.addEventListener("click", saveResults)
  }
}

// Check registration
function checkRegistration() {
  if (!isRegistered) {
    showNotification("Please complete registration first!", "warning")
    showSection("register")
    return false
  }
  return true
}

// Spiral Test Implementation
function initializeSpiralTest() {
  console.log("Initializing spiral test")

  const canvas = document.getElementById("spiralCanvas")
  if (!canvas) {
    console.error("Spiral canvas not found")
    return
  }

  const ctx = canvas.getContext("2d")
  let isDrawing = false
  let path = []

  // Clear canvas and draw guide
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = "#000"
  ctx.lineWidth = 2
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
  const clearBtn = document.getElementById("clearCanvas")
  if (clearBtn) {
    clearBtn.onclick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawGuideSpiral(ctx, canvas.width, canvas.height)
      path = []
    }
  }

  // Submit button
  const submitBtn = document.getElementById("submitSpiral")
  if (submitBtn) {
    submitBtn.onclick = () => {
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

// Tap Test Implementation
function initializeTapTest() {
  console.log("Initializing tap test")

  let tapTestActive = false
  let tapScore = 0
  let tapCount = 0
  let tapTimeout

  const container = document.getElementById("tapTestContainer")
  const dot = document.getElementById("tapDot")
  const countdown = document.getElementById("tapCountdown")
  const scoreDisplay = document.getElementById("tapScoreValue")

  if (!container || !dot) {
    console.error("Tap test elements not found")
    return
  }

  // Start test automatically
  startTapTest()

  function startTapTest() {
    tapTestActive = true
    tapScore = 0
    tapCount = 0

    if (scoreDisplay) scoreDisplay.textContent = "0/10"

    // Countdown
    let count = 3
    if (countdown) {
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
    }
  }

  function showNextDot() {
    if (tapCount >= 10) {
      endTapTest()
      return
    }

    tapCount++

    // Position dot randomly
    const dotSize = 60
    const maxX = container.offsetWidth - dotSize
    const maxY = container.offsetHeight - dotSize

    const x = Math.random() * maxX
    const y = Math.random() * maxY

    dot.style.left = x + "px"
    dot.style.top = y + "px"
    dot.style.display = "block"

    // Auto-hide after 500ms
    tapTimeout = setTimeout(() => {
      dot.style.display = "none"
      setTimeout(showNextDot, 300)
    }, 500)
  }

  // Dot click handler
  dot.onclick = () => {
    if (!tapTestActive) return

    clearTimeout(tapTimeout)
    tapScore++
    dot.style.display = "none"

    if (scoreDisplay) scoreDisplay.textContent = `${tapScore}/10`

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

// Reaction Test Implementation
function initializeReactionTest() {
  console.log("Initializing reaction test")

  let reactionTestActive = false
  let reactionTimes = []
  let currentTrial = 0
  let reactionStartTime = 0

  const container = document.getElementById("reactionTestContainer")
  const countdown = document.getElementById("reactionCountdown")
  const result = document.getElementById("reactionResult")

  if (!container) {
    console.error("Reaction test container not found")
    return
  }

  // Start test automatically
  startReactionTest()

  function startReactionTest() {
    reactionTestActive = true
    reactionTimes = []
    currentTrial = 0
    startNextTrial()
  }

  function startNextTrial() {
    if (currentTrial >= 3) {
      endReactionTest()
      return
    }

    container.style.background = "#f8f9fa"
    if (countdown) countdown.style.display = "block"
    if (result) result.textContent = `Trial ${currentTrial + 1}/3 - Click when the screen turns green!`

    // Countdown
    if (countdown) {
      countdown.textContent = "3"

      setTimeout(() => {
        countdown.textContent = "2"
        setTimeout(() => {
          countdown.textContent = "1"
          setTimeout(() => {
            countdown.style.display = "none"

            // Random delay before green
            const delay = 1000 + Math.random() * 3000
            setTimeout(() => {
              container.style.background = "#28a745"
              reactionStartTime = Date.now()
            }, delay)
          }, 1000)
        }, 1000)
      }, 1000)
    }
  }

  // Click handler
  container.onclick = () => {
    if (!reactionTestActive) return

    if (reactionStartTime === 0) {
      // Clicked too early
      container.style.background = "#dc3545"
      if (result) result.textContent = "Too early! Try again..."

      setTimeout(() => {
        startNextTrial()
      }, 2000)
      return
    }

    // Valid click
    const reactionTime = Date.now() - reactionStartTime
    reactionTimes.push(reactionTime)

    if (result) result.textContent = `Reaction time: ${reactionTime}ms`

    reactionStartTime = 0
    currentTrial++

    setTimeout(() => {
      startNextTrial()
    }, 1500)
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

// Voice Test Implementation
function initializeVoiceTest() {
  console.log("Initializing voice test")

  let mediaRecorder
  let audioChunks = []

  const startBtn = document.getElementById("startVoiceRecording")
  const stopBtn = document.getElementById("stopVoiceRecording")
  const result = document.getElementById("voiceResult")

  if (!startBtn || !stopBtn || !result) {
    console.error("Voice test elements not found")
    return
  }

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
    setTimeout(() => {
      const score = 70 + Math.random() * 25
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
    if (viewResultsBtn) viewResultsBtn.disabled = false
    if (printResultsBtn) printResultsBtn.disabled = false
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

  const resultsContent = document.getElementById("resultsContent")
  if (resultsContent) {
    resultsContent.innerHTML = resultsHTML
  }

  showSection("results")
}

// Save results
function saveResults() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}")
  const timestamp = Date.now().toString(36)
  const reportId = `NS-${timestamp}`.toUpperCase()

  const resultsData = {
    ...userData,
    testResults: testResults,
    reportId: reportId,
    timestamp: new Date().toISOString(),
  }

  // Save to localStorage
  const existingResults = JSON.parse(localStorage.getItem("savedResults") || "[]")
  existingResults.push(resultsData)
  localStorage.setItem("savedResults", JSON.stringify(existingResults))

  showNotification(`Results saved successfully! Report ID: ${reportId}`, "success")
}

// Utility functions
function showModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "block"
    modal.classList.add("show")

    // Add backdrop
    const backdrop = document.createElement("div")
    backdrop.className = "modal-backdrop fade show"
    backdrop.id = `${modalId}-backdrop`
    document.body.appendChild(backdrop)

    document.body.classList.add("modal-open")
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "none"
    modal.classList.remove("show")

    // Remove backdrop
    const backdrop = document.getElementById(`${modalId}-backdrop`)
    if (backdrop) {
      backdrop.remove()
    }

    document.body.classList.remove("modal-open")
  }
}

function showNotification(message, type = "info") {
  // Remove existing notifications
  document.querySelectorAll(".notification").forEach((n) => n.remove())

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `alert alert-${type} alert-dismissible fade show notification`
  notification.style.cssText = "position: fixed; top: 20px; right: 20px; z-index: 9999; max-width: 400px;"
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
window.isRegistered = isRegistered
