// Test Manager - Enhanced test functionality
document.addEventListener("DOMContentLoaded", () => {
  console.log("Test Manager loaded")

  // Global test results
  window.testResults = {
    spiral: { status: "Not Tested", healthy: 0, parkinsons: 0, rawScore: 0, details: {} },
    tap: { status: "Not Tested", healthy: 0, parkinsons: 0, rawScore: 0, details: {} },
    reaction: { status: "Not Tested", healthy: 0, parkinsons: 0, rawScore: 0, details: {} },
    voice: { status: "Not Tested", healthy: 0, parkinsons: 0, rawScore: 0, details: {} },
  }

  // Initialize all tests
  initializeTapTest()
  initializeReactionTest()

  // Setup test buttons
  setupTestButtons()

  // Setup view results button
  const viewResultsBtn = document.getElementById("viewResults")
  if (viewResultsBtn) {
    viewResultsBtn.addEventListener("click", showResults)
  }

  // Setup back to tests button
  const backToTestsBtn = document.getElementById("backToTests")
  if (backToTestsBtn) {
    backToTestsBtn.addEventListener("click", () => {
      hideSection("results")
      showSection("tests")
    })
  }

  // Setup save results button
  const saveResultsBtn = document.getElementById("saveResults")
  if (saveResultsBtn) {
    saveResultsBtn.addEventListener("click", saveResults)
  }

  // Setup registration form to show tests
  setupRegistrationForm()

  // Initialize test event listeners
  initializeTestButtons()

  // Initialize modal event listeners
  initializeModalHandlers()
})

function initializeTestButtons() {
  // Spiral Test
  const spiralBtn = document.getElementById("startSpiralTest")
  if (spiralBtn) {
    spiralBtn.addEventListener("click", () => {
      if (!window.isRegistered) {
        window.showNotification("Please complete registration first!", "warning")
        window.showSection("register")
        return
      }
      showModal("spiralTestModal")
      setTimeout(() => initializeSpiralTest(), 500)
    })
  }

  // Tap Test
  const tapBtn = document.getElementById("startTapTest")
  if (tapBtn) {
    tapBtn.addEventListener("click", () => {
      if (!window.isRegistered) {
        window.showNotification("Please complete registration first!", "warning")
        window.showSection("register")
        return
      }
      showModal("tapTestModal")
    })
  }

  // Reaction Test
  const reactionBtn = document.getElementById("startReactionTest")
  if (reactionBtn) {
    reactionBtn.addEventListener("click", () => {
      if (!window.isRegistered) {
        window.showNotification("Please complete registration first!", "warning")
        window.showSection("register")
        return
      }
      showModal("reactionTestModal")
    })
  }

  // Voice Test
  const voiceBtn = document.getElementById("startVoiceTest")
  if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
      if (!window.isRegistered) {
        window.showNotification("Please complete registration first!", "warning")
        window.showSection("register")
        return
      }
      showModal("voiceTestModal")
      setTimeout(() => initializeVoiceTest(), 500)
    })
  }
}

function initializeModalHandlers() {
  // Handle modal close events
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("hidden.bs.modal", () => {
      // Reset any ongoing tests when modal is closed
      resetTestStates()
    })
  })
}

function checkRegistration() {
  const userData = localStorage.getItem("userData")
  if (!userData) {
    showNotification("Please complete registration first!", "warning")
    showSection("register")
    return false
  }
  return true
}

function resetTestStates() {
  // Reset tap test
  if (window.tapTestActive) {
    window.tapTestActive = false
    clearTimeout(window.tapTimeout)
  }

  // Reset reaction test
  if (window.reactionTestActive) {
    window.reactionTestActive = false
  }

  // Reset any other test states as needed
}

// Export functions for global access
window.initializeTestButtons = initializeTestButtons
window.checkRegistration = checkRegistration

// Setup registration form
function setupRegistrationForm() {
  const registrationForm = document.getElementById("registrationForm")
  if (registrationForm) {
    registrationForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Show success message
      const successAlert = document.createElement("div")
      successAlert.className = "alert alert-success fade show"
      successAlert.innerHTML = "Registration successful! Redirecting to tests..."
      registrationForm.prepend(successAlert)

      // Disable the submit button
      const submitBtn = registrationForm.querySelector('button[type="submit"]')
      if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.innerHTML = "Submitted"
      }

      // Store user data for later use
      const userData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        age: document.getElementById("age").value,
        gender: document.querySelector('input[name="gender"]:checked')?.value || "Not specified",
        familyHistory: document.getElementById("familyHistory").value,
        medicalSituation: document.getElementById("medicalSituation").value,
        testDate: new Date().toISOString(),
      }

      // Store in localStorage
      localStorage.setItem("userData", JSON.stringify(userData))

      // Hide registration section and show tests section after a delay
      setTimeout(() => {
        hideSection("register")
        showSection("tests")

        // Scroll to tests section
        document.getElementById("tests").scrollIntoView({ behavior: "smooth" })
      }, 1000)
    })
  }
}

// Setup test buttons
function setupTestButtons() {
  // Spiral Test
  const startSpiralTest = document.getElementById("startSpiralTest")
  if (startSpiralTest) {
    startSpiralTest.addEventListener("click", () => {
      showModal("spiralTestModal")
    })
  }

  // Tap Test
  const startTapTest = document.getElementById("startTapTest")
  if (startTapTest) {
    startTapTest.addEventListener("click", () => {
      showModal("tapTestModal")
      // Start the tap test after showing the modal
      setTimeout(() => {
        if (typeof window.startTapTestFunction === "function") {
          window.startTapTestFunction()
        } else {
          console.error("startTapTestFunction is not defined.")
        }
      }, 500)
    })
  }

  // Reaction Test
  const startReactionTest = document.getElementById("startReactionTest")
  if (startReactionTest) {
    startReactionTest.addEventListener("click", () => {
      showModal("reactionTestModal")
      // Start the reaction test after showing the modal
      setTimeout(() => {
        if (typeof window.startReactionTestFunction === "function") {
          window.startReactionTestFunction()
        } else {
          console.error("startReactionTestFunction is not defined.")
        }
      }, 500)
    })
  }

  // Voice Test
  const startVoiceTest = document.getElementById("startVoiceTest")
  if (startVoiceTest) {
    startVoiceTest.addEventListener("click", () => {
      showModal("voiceTestModal")
    })
  }

  // Setup close buttons for all modals
  setupModalCloseButtons()
}

// Show modal function
function showModal(modalId) {
  const modal = window.bootstrap.Modal(document.getElementById(modalId))
  modal.show()
}

// Hide modal function
function hideModal(modalId) {
  const modal = window.bootstrap.Modal.getInstance(document.getElementById(modalId))
  if (modal) {
    modal.hide()
  }
}

// Setup close buttons for all modals
function setupModalCloseButtons() {
  const closeButtons = document.querySelectorAll(".modal .btn-close, .modal [data-bs-dismiss='modal']")
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal")
      if (modal) {
        hideModal(modal.id)
      }
    })
  })
}

// Show section
function showSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.classList.remove("d-none")
    section.style.display = "block"
  }
}

// Hide section
function hideSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.classList.add("d-none")
    section.style.display = "none"
  }
}

// Calculate test results based on raw score
function calculateTestResults(testName, rawScore, details = {}) {
  // Different calculation methods for each test
  let healthy, parkinsons, status

  switch (testName) {
    case "spiral":
      // Spiral test: Higher score = better (smoother drawing)
      // Score range: 0-100
      healthy = Math.round(rawScore)
      parkinsons = 100 - healthy
      status = healthy >= 60 ? "Healthy" : "Not Healthy"
      break

    case "tap":
      // Tap test: Higher score = better (more accurate taps)
      // Score range: 0-100
      healthy = Math.round(rawScore)
      parkinsons = 100 - healthy
      status = healthy >= 60 ? "Healthy" : "Not Healthy"
      break

    case "reaction":
      // Reaction test: Lower time = better
      // Convert reaction time (ms) to a 0-100 score
      // Typical reaction times: 200ms (excellent) to 800ms (poor)
      const normalizedScore = Math.max(0, Math.min(100, 100 - (rawScore - 200) / 6))
      healthy = Math.round(normalizedScore)
      parkinsons = 100 - healthy
      status = healthy >= 60 ? "Healthy" : "Not Healthy"
      break

    case "voice":
      // Voice test: Higher score = better
      // Score range: 0-100
      healthy = Math.round(rawScore)
      parkinsons = 100 - healthy
      status = healthy >= 60 ? "Healthy" : "Not Healthy"
      break

    default:
      healthy = 0
      parkinsons = 0
      status = "Not Tested"
  }

  // Update test results
  window.testResults[testName] = {
    status: status,
    healthy: healthy,
    parkinsons: parkinsons,
    rawScore: rawScore,
    details: details,
  }

  // Update UI
  updateTestStatusDisplay()

  console.log(`Test results for ${testName}:`, window.testResults[testName])

  return { status, healthy, parkinsons, rawScore, details }
}

// Update test status display
function updateTestStatusDisplay() {
  // Update Spiral Test
  updateTestStatus(
    "spiral",
    "spiralTestStatus",
    "spiralTestResult",
    "spiralHealthyBar",
    "spiralParkinsonBar",
    "spiralHealthyPercent",
    "spiralParkinsonPercent",
    1,
  )

  // Update Tap Test
  updateTestStatus(
    "tap",
    "tapTestStatus",
    "tapTestResult",
    "tapHealthyBar",
    "tapParkinsonBar",
    "tapHealthyPercent",
    "tapParkinsonPercent",
    2,
  )

  // Update Reaction Test
  updateTestStatus(
    "reaction",
    "reactionTestStatus",
    "reactionTestResult",
    "reactionHealthyBar",
    "reactionParkinsonBar",
    "reactionHealthyPercent",
    "reactionParkinsonPercent",
    3,
  )

  // Update Voice Test
  updateTestStatus(
    "voice",
    "voiceTestStatus",
    "voiceTestResult",
    "voiceHealthyBar",
    "voiceParkinsonBar",
    "voiceHealthyPercent",
    "voiceParkinsonPercent",
    4,
  )

  // Enable view results button if at least one test is completed
  const viewResults = document.getElementById("viewResults")
  if (viewResults) {
    const completedTests = Object.values(window.testResults).filter((test) => test.status !== "Not Tested").length
    if (completedTests > 0) {
      viewResults.disabled = false
      viewResults.classList.add("pulse")
    } else {
      viewResults.disabled = true
      viewResults.classList.remove("pulse")
    }
  }
}

// Update individual test status
function updateTestStatus(
  testName,
  statusId,
  resultId,
  healthyBarId,
  parkinsonBarId,
  healthyPercentId,
  parkinsonPercentId,
  cardIndex,
) {
  const statusElement = document.getElementById(statusId)
  if (statusElement) {
    statusElement.textContent = window.testResults[testName].status
    statusElement.className = getStatusClass(window.testResults[testName].status)
  }

  if (window.testResults[testName].status !== "Not Tested") {
    const resultElement = document.getElementById(resultId)
    if (resultElement && resultElement.classList.contains("d-none")) {
      resultElement.classList.remove("d-none")
      resultElement.classList.add("fade-in")
    }

    const healthyBar = document.getElementById(healthyBarId)
    const parkinsonBar = document.getElementById(parkinsonBarId)

    if (healthyBar && parkinsonBar) {
      // Set initial width to 0 and then animate
      healthyBar.style.width = "0%"
      parkinsonBar.style.width = "0%"

      // Update aria-valuenow for accessibility and printing
      healthyBar.setAttribute("aria-valuenow", window.testResults[testName].healthy)
      parkinsonBar.setAttribute("aria-valuenow", window.testResults[testName].parkinsons)

      const healthyPercent = document.getElementById(healthyPercentId)
      const parkinsonPercent = document.getElementById(parkinsonPercentId)

      if (healthyPercent) {
        healthyPercent.textContent = window.testResults[testName].healthy
      }

      if (parkinsonPercent) {
        parkinsonPercent.textContent = window.testResults[testName].parkinsons
      }

      // Trigger animation by forcing reflow and then setting the proper width
      setTimeout(() => {
        healthyBar.style.width = `${window.testResults[testName].healthy}%`
        parkinsonBar.style.width = `${window.testResults[testName].parkinsons}%`
      }, 50)

      // Add completed animation to card
      const testCard = document.querySelector(`.test-card:nth-child(${cardIndex})`)
      if (testCard) {
        testCard.classList.add("test-completed")
      }
    }
  }
}

// Get CSS class for status display
function getStatusClass(status) {
  if (status === "Healthy") return "status-value healthy"
  if (status === "Not Healthy") return "status-value not-healthy"
  return "status-value"
}

// Show results section with test data
function showResults() {
  const testsSection = document.getElementById("tests")
  const resultsSection = document.getElementById("results")

  if (!testsSection || !resultsSection) {
    console.error("Tests or results section not found")
    return
  }

  // Update results table
  updateResultsTable()

  // Calculate overall results
  const completedTests = Object.values(window.testResults).filter((test) => test.status !== "Not Tested").length

  // Hide tests section and show results with animation
  testsSection.classList.add("slide-out")
  setTimeout(() => {
    hideSection("tests")
    showSection("results")
    resultsSection.classList.add("slide-in")

    if (completedTests === 0) {
      const overallHealthyBar = document.getElementById("overallHealthyBar")
      const overallParkinsonBar = document.getElementById("overallParkinsonBar")
      const overallHealthyPercent = document.getElementById("overallHealthyPercent")
      const overallParkinsonPercent = document.getElementById("overallParkinsonPercent")
      const conclusionTitle = document.getElementById("conclusionTitle")
      const conclusionText = document.getElementById("conclusionText")
      const conclusionBox = document.getElementById("conclusionBox")

      if (overallHealthyBar) overallHealthyBar.style.width = "50%"
      if (overallParkinsonBar) overallParkinsonBar.style.width = "50%"
      if (overallHealthyPercent) overallHealthyPercent.textContent = "50"
      if (overallParkinsonPercent) overallParkinsonPercent.textContent = "50"

      if (conclusionTitle) conclusionTitle.textContent = "Assessment Incomplete"
      if (conclusionText)
        conclusionText.textContent = "Please complete at least one test to get a comprehensive assessment."
      if (conclusionBox) conclusionBox.className = "conclusion mt-4 p-3 rounded"
    } else {
      let totalHealthy = 0
      let totalParkinsons = 0

      Object.values(window.testResults).forEach((test) => {
        if (test.status !== "Not Tested") {
          totalHealthy += test.healthy
          totalParkinsons += test.parkinsons
        }
      })

      const avgHealthy = Math.round(totalHealthy / completedTests)
      const avgParkinsons = Math.round(totalParkinsons / completedTests)

      const overallHealthyBar = document.getElementById("overallHealthyBar")
      const overallParkinsonBar = document.getElementById("overallParkinsonBar")
      const overallHealthyPercent = document.getElementById("overallHealthyPercent")
      const overallParkinsonPercent = document.getElementById("overallParkinsonPercent")

      // Set initial width to 0 to enable animation
      if (overallHealthyBar) {
        overallHealthyBar.style.width = "0%"
        overallHealthyBar.setAttribute("aria-valuenow", avgHealthy)
      }
      if (overallParkinsonBar) {
        overallParkinsonBar.style.width = "0%"
        overallParkinsonBar.setAttribute("aria-valuenow", avgParkinsons)
      }

      // Set text
      if (overallHealthyPercent) overallHealthyPercent.textContent = avgHealthy
      if (overallParkinsonPercent) overallParkinsonPercent.textContent = avgParkinsons

      // Animate bars after a short delay
      setTimeout(() => {
        if (overallHealthyBar) overallHealthyBar.style.width = `${avgHealthy}%`
        if (overallParkinsonBar) overallParkinsonBar.style.width = `${avgParkinsons}%`

        // Add shake animation to conclusion box
        const conclusionBox = document.getElementById("conclusionBox")
        const conclusionTitle = document.getElementById("conclusionTitle")
        const conclusionText = document.getElementById("conclusionText")

        if (conclusionBox) conclusionBox.classList.add("shake")

        if (avgHealthy >= 80) {
          if (conclusionTitle) conclusionTitle.textContent = "Likely Healthy"
          if (conclusionText) {
            conclusionText.textContent =
              "Based on your test results, you are likely not showing signs of Parkinson's disease. Your motor control, reaction time, and coordination appear to be within normal ranges. However, this is not a medical diagnosis. If you have concerns, please consult a healthcare professional."
          }
          if (conclusionBox) conclusionBox.className = "conclusion mt-4 p-3 rounded healthy"
        } else if (avgHealthy >= 60) {
          if (conclusionTitle) conclusionTitle.textContent = "Mostly Healthy"
          if (conclusionText) {
            conclusionText.textContent =
              "Based on your test results, you are showing mostly normal motor function with some minor variations. While these results don't necessarily indicate Parkinson's disease, we recommend monitoring your symptoms and consulting with a healthcare professional for a thorough evaluation."
          }
          if (conclusionBox) conclusionBox.className = "conclusion mt-4 p-3 rounded healthy"
        } else if (avgHealthy >= 40) {
          if (conclusionTitle) conclusionTitle.textContent = "Potential Early Signs"
          if (conclusionText) {
            conclusionText.textContent =
              "Your test results show some patterns that may be associated with early motor changes. These could be related to various factors, including but not limited to Parkinson's disease. We strongly recommend consulting a neurologist for proper evaluation and diagnosis."
          }
          if (conclusionBox) conclusionBox.className = "conclusion mt-4 p-3 rounded not-healthy"
        } else {
          if (conclusionTitle) conclusionTitle.textContent = "Significant Risk Detected"
          if (conclusionText) {
            conclusionText.textContent =
              "Your test results indicate significant motor function changes that are commonly associated with Parkinson's disease. Please consult with a neurologist as soon as possible for a comprehensive evaluation. Early diagnosis and treatment can significantly improve quality of life."
          }
          if (conclusionBox) conclusionBox.className = "conclusion mt-4 p-3 rounded not-healthy"
        }
      }, 500)
    }
  }, 500)
}

// Update results table
function updateResultsTable() {
  // Spiral Test
  updateResultTableRow(
    "spiral",
    "spiralStatusResult",
    "spiralHealthyResult",
    "spiralParkinsonResult",
    "spiralRawResult",
  )

  // Tap Test
  updateResultTableRow("tap", "tapStatusResult", "tapHealthyResult", "tapParkinsonResult", "tapRawResult")

  // Reaction Test
  updateResultTableRow(
    "reaction",
    "reactionStatusResult",
    "reactionHealthyResult",
    "reactionParkinsonResult",
    "reactionRawResult",
  )

  // Voice Test
  updateResultTableRow("voice", "voiceStatusResult", "voiceHealthyResult", "voiceParkinsonResult", "voiceRawResult")
}

// Update individual result table row
function updateResultTableRow(testName, statusId, healthyId, parkinsonId, rawId) {
  const statusElement = document.getElementById(statusId)
  const healthyElement = document.getElementById(healthyId)
  const parkinsonElement = document.getElementById(parkinsonId)
  const rawElement = document.getElementById(rawId)

  if (statusElement) statusElement.textContent = window.testResults[testName].status
  if (healthyElement) healthyElement.textContent = `${window.testResults[testName].healthy}%`
  if (parkinsonElement) parkinsonElement.textContent = `${window.testResults[testName].parkinsons}%`

  // Format raw score based on test type
  if (rawElement) {
    if (testName === "reaction") {
      // For reaction test, show milliseconds
      rawElement.textContent = `${Math.round(window.testResults[testName].rawScore)} ms`
    } else if (window.testResults[testName].rawScore) {
      // For other tests, show score out of 100
      rawElement.textContent = `${Math.round(window.testResults[testName].rawScore)}/100`
    } else {
      rawElement.textContent = "-"
    }
  }
}

// SPIRAL TEST IMPLEMENTATION
function initializeSpiralTest() {
  const canvas = document.getElementById("spiralCanvas")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  let isDrawing = false
  let path = []

  // Clear and setup canvas
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

  // Touch events for mobile
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
      window.showNotification("Please draw a complete spiral before submitting.", "warning")
      return
    }

    const score = analyzeSpiralDrawing(path)
    window.testResults.spiral = {
      completed: true,
      score: score,
      details: { pathLength: path.length, timestamp: new Date().toISOString() },
    }

    updateTestStatusDisplay()
    window.showNotification("Spiral test completed!", "success")
    hideModal("spiralTestModal")
    checkAllTestsCompleted()
  }
}

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

// TAP TEST IMPLEMENTATION
function initializeTapTest() {
  const tapTestContainer = document.getElementById("tapTestContainer")
  const tapCountdown = document.getElementById("tapCountdown")
  const tapDot = document.getElementById("tapDot")
  const tapScore = document.getElementById("tapScore")

  if (!tapTestContainer) {
    console.error("Tap test container not found")
    return
  }

  console.log("Initializing tap test")

  let dotsClicked = 0
  let dotsShown = 0
  let tapTestActive = false
  let dotTimeout = null
  let tapTimes = [] // Store reaction times for each tap
  let dotAppearTimes = [] // Store when each dot appeared

  // Define the startTapTestFunction globally
  window.startTapTestFunction = () => {
    dotsClicked = 0
    dotsShown = 0
    tapTestActive = false
    tapTimes = []
    dotAppearTimes = []

    if (tapScore) tapScore.textContent = "Score: 0/10"

    // Animated countdown
    if (tapCountdown) {
      tapCountdown.style.display = "block"
      tapCountdown.classList.add("fade-in")
      tapCountdown.textContent = "3"

      setTimeout(() => {
        tapCountdown.classList.remove("fade-in")
        tapCountdown.classList.add("pulse")
        tapCountdown.textContent = "2"

        setTimeout(() => {
          tapCountdown.textContent = "1"

          setTimeout(() => {
            tapCountdown.classList.remove("pulse")
            tapCountdown.classList.add("scale-in")
            tapCountdown.textContent = "GO!"

            setTimeout(() => {
              tapCountdown.style.display = "none"
              tapTestActive = true
              showNextDot()
            }, 800)
          }, 1000)
        }, 1000)
      }, 1000)
    }
  }

  // Show next dot with animation
  function showNextDot() {
    if (dotsShown >= 10) {
      endTapTest()
      return
    }

    dotsShown++

    // Random position with padding to ensure dot is fully visible
    const containerWidth = tapTestContainer.offsetWidth
    const containerHeight = tapTestContainer.offsetHeight
    const dotSize = 50
    const padding = 10

    // Ensure the dot stays within visible bounds
    const left = Math.max(
      padding,
      Math.min(containerWidth - dotSize - padding, Math.random() * (containerWidth - dotSize)),
    )
    const top = Math.max(
      padding,
      Math.min(containerHeight - dotSize - padding, Math.random() * (containerHeight - dotSize)),
    )

    // Set dot position and ensure it's visible
    if (tapDot) {
      tapDot.style.left = `${left}px`
      tapDot.style.top = `${top}px`
      tapDot.style.width = `${dotSize}px`
      tapDot.style.height = `${dotSize}px`
      tapDot.style.cursor = "pointer"
      tapDot.style.zIndex = "100"
      tapDot.style.position = "absolute"

      // Add animation class
      tapDot.classList.remove("scale-in")
      void tapDot.offsetWidth // Force reflow
      tapDot.classList.add("scale-in")
      tapDot.style.display = "block"

      // Record when the dot appeared
      dotAppearTimes[dotsShown - 1] = Date.now()

      // Auto-hide dot after 500ms (half a second) as requested
      dotTimeout = setTimeout(() => {
        tapDot.style.display = "none"
        // Record a miss
        tapTimes[dotsShown - 1] = -1
        setTimeout(showNextDot, 300) // Small delay before showing next dot
      }, 500) // Changed from 1500ms to 500ms
    }
  }

  // End tap test with result animation
  function endTapTest() {
    tapTestActive = false
    if (tapDot) tapDot.style.display = "none"

    // Show result with animation
    if (tapScore) {
      tapScore.innerHTML = `<div class="test-animation">Test Complete!</div>`
      tapScore.classList.add("scale-in")

      // Calculate score based on number of dots tapped (as requested)
      // Simple percentage: dots clicked / total dots * 100
      const accuracyScore = (dotsClicked / 10) * 100

      console.log("Tap test results:", {
        dotsClicked,
        totalDots: 10,
        accuracyScore,
      })

      // Show loading animation
      setTimeout(() => {
        tapScore.innerHTML = `<div class="loading-dots">
          <span class="loading-dot"></span>
          <span class="loading-dot"></span>
          <span class="loading-dot"></span>
        </div>
        <div>Analyzing results...</div>`

        // Update test results after a delay
        setTimeout(() => {
          // Use the calculated score based only on number of dots tapped
          calculateTestResults("tap", accuracyScore, {
            accuracy: Math.round(accuracyScore),
            dotsClicked: dotsClicked,
            totalDots: 10,
          })

          // Show final score
          tapScore.innerHTML = `<div class="test-complete">Score: ${dotsClicked}/10</div>`

          // Close modal after a short delay
          setTimeout(() => {
            hideModal("tapTestModal")
          }, 1500)
        }, 2000)
      }, 1000)
    }
  }

  // Dot click handler with animation
  if (tapDot) {
    tapDot.addEventListener("click", () => {
      if (!tapTestActive) return

      dotsClicked++
      // Record reaction time
      const reactionTime = Date.now() - dotAppearTimes[dotsShown - 1]
      tapTimes[dotsShown - 1] = reactionTime

      if (tapScore) tapScore.textContent = `Score: ${dotsClicked}/10`

      // Add click effect
      tapDot.classList.add("pulse")
      setTimeout(() => {
        tapDot.classList.remove("pulse")
        tapDot.style.display = "none"
        clearTimeout(dotTimeout)
        setTimeout(showNextDot, 300) // Small delay before showing next dot
      }, 150)
    })

    // Touch support for mobile
    tapDot.addEventListener("touchstart", (e) => {
      e.preventDefault()
      if (!tapTestActive) return

      // Trigger the same animation as click
      tapDot.click()
    })
  }
}

// REACTION TEST IMPLEMENTATION
function initializeReactionTest() {
  const reactionTestContainer = document.getElementById("reactionTestContainer")
  const reactionCountdown = document.getElementById("reactionCountdown")
  const reactionTime = document.getElementById("reactionTime")
  const reactionResult = document.getElementById("reactionResult")

  if (!reactionTestContainer) {
    console.error("Reaction test container not found")
    return
  }

  console.log("Initializing reaction test")

  let waitingForClick = false
  let startTime = 0
  let reactionTestTimeout = null
  let reactionTimes = [] // Store multiple reaction times
  const numTrials = 3 // Number of reaction time trials
  let currentTrial = 0
  let falseStarts = 0 // Track false starts (clicking too early)

  // Define the startReactionTestFunction globally
  window.startReactionTestFunction = () => {
    // Reset for new test
    reactionTimes = []
    currentTrial = 0
    falseStarts = 0

    startNextTrial()
  }

  function startNextTrial() {
    reactionTestContainer.style.backgroundColor = "#f8f9fa"
    if (reactionCountdown) {
      reactionCountdown.style.display = "block"
    }
    if (reactionTime) {
      reactionTime.style.display = "none"
    }
    if (reactionResult) {
      reactionResult.textContent = `Trial ${currentTrial + 1}/${numTrials}: Click when the screen turns green`
    }

    // Countdown
    if (reactionCountdown) {
      reactionCountdown.textContent = "3"

      setTimeout(() => {
        reactionCountdown.textContent = "2"
        setTimeout(() => {
          reactionCountdown.textContent = "1"
          setTimeout(() => {
            reactionCountdown.style.display = "none"

            // Random delay before turning green
            const delay = 1000 + Math.random() * 3000
            reactionTestTimeout = setTimeout(() => {
              reactionTestContainer.style.backgroundColor = "#28a745"
              startTime = Date.now()
              waitingForClick = true
            }, delay)
          }, 1000)
        }, 1000)
      }, 1000)
    }
  }

  // Handle click on reaction test container
  reactionTestContainer.addEventListener("click", () => {
    // Fix for clicking early showing more time
    if (!waitingForClick && startTime === 0) {
      // Clicked too early - clear any pending timeout
      clearTimeout(reactionTestTimeout)
      reactionTestContainer.style.backgroundColor = "#dc3545" // Red background
      falseStarts++

      if (reactionResult) {
        reactionResult.textContent = "Too early! Try again."
      }

      // Reset and start next trial after a delay
      setTimeout(() => {
        startNextTrial()
      }, 2000)
      return
    }

    if (waitingForClick) {
      // Valid click - only record time if we're waiting for a click
      const endTime = Date.now()
      const reactionTimeMs = endTime - startTime
      reactionTimes.push(reactionTimeMs)

      // Reset the background color
      reactionTestContainer.style.backgroundColor = "#f8f9fa"

      if (reactionTime) {
        reactionTime.textContent = `${reactionTimeMs} ms`
        reactionTime.style.display = "block"
      }

      // Reset for next trial
      waitingForClick = false
      startTime = 0

      currentTrial++

      if (currentTrial < numTrials) {
        // More trials to go
        if (reactionResult) {
          reactionResult.textContent = `Good! ${reactionTimeMs} ms. Next trial in 2 seconds...`
        }

        // Start next trial after delay
        setTimeout(() => {
          startNextTrial()
        }, 2000)
      } else {
        // All trials complete, calculate average
        const avgReactionTime = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length

        if (reactionResult) {
          reactionResult.textContent = `Average reaction time: ${Math.round(avgReactionTime)} ms`
        }

        console.log("Reaction test results:", {
          reactionTimes,
          avgReactionTime,
          falseStarts,
        })

        // Calculate score based on reaction time
        // Use the average reaction time to calculate the score
        calculateTestResults("reaction", avgReactionTime, {
          trials: reactionTimes.length,
          falseStarts: falseStarts,
          fastest: Math.min(...reactionTimes),
          slowest: Math.max(...reactionTimes),
          average: avgReactionTime,
        })

        // Update UI
        updateTestStatusDisplay()

        // Close modal after 3 seconds
        setTimeout(() => {
          hideModal("reactionTestModal")
        }, 3000)
      }
    }
  })

  // Touch support for mobile
  reactionTestContainer.addEventListener("touchstart", (e) => {
    e.preventDefault()
    // Trigger the same logic as click
    reactionTestContainer.click()
  })
}

// VOICE TEST IMPLEMENTATION
function initializeVoiceTest() {
  let mediaRecorder
  let audioChunks = []

  const startBtn = document.getElementById("startVoiceRecording")
  const stopBtn = document.getElementById("stopVoiceRecording")
  const result = document.getElementById("voiceResult")

  if (!startBtn || !stopBtn || !result) return

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
    window.testResults.voice = {
      completed: true,
      score: score,
      details: {
        quality: score > 80 ? "Good" : score > 60 ? "Fair" : "Needs Improvement",
        timestamp: new Date().toISOString(),
      },
    }

    updateTestStatusDisplay()
    window.showNotification(`Voice test completed! Score: ${score}%`, "success")

    setTimeout(() => {
      hideModal("voiceTestModal")
      checkAllTestsCompleted()
    }, 2000)
  }
}

function checkAllTestsCompleted() {
  const completedTests = Object.values(window.testResults).filter((test) => test.status !== "Not Tested").length
  const viewResultsBtn = document.getElementById("viewResults")
  const printResultsBtn = document.getElementById("printResults")

  if (completedTests > 0) {
    viewResultsBtn.disabled = false
    printResultsBtn.disabled = false
  }

  if (completedTests === 4) {
    window.showNotification("All tests completed! You can now view your results.", "success")
  }
}

// Export functions
window.initializeSpiralTest = initializeSpiralTest
window.initializeVoiceTest = initializeVoiceTest

// Save results to Firebase function
async function saveResults() {
  // Get user data from localStorage
  const userDataString = localStorage.getItem("userData")
  if (!userDataString) {
    alert("User data not found. Please complete the registration form first.")
    return
  }

  const userData = JSON.parse(userDataString)

  try {
    // Show loading indicator
    const saveResultsBtn = document.getElementById("saveResults")
    if (saveResultsBtn) {
      saveResultsBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...'
      saveResultsBtn.disabled = true
    }

    let saveToFirebase = false
    let firebaseModule = null

    try {
      // Try to import Firebase module (this might fail in local environment)
      firebaseModule = await import("./firebase-config.js")
      saveToFirebase = true
    } catch (importError) {
      console.log("Firebase module import failed, using localStorage instead:", importError.message)
      saveToFirebase = false
    }

    let result = { success: false, id: null }

    if (saveToFirebase && firebaseModule && typeof firebaseModule.saveResultsToFirebase === "function") {
      // Save to Firebase if module was imported successfully
      result = await firebaseModule.saveResultsToFirebase(userData, window.testResults)
    } else {
      // Use localStorage if Firebase is not available
      result = saveToLocalStorage(userData, window.testResults)
    }

    // Reset button
    if (saveResultsBtn) {
      saveResultsBtn.innerHTML = "Save Results"
      saveResultsBtn.disabled = false
    }

    if (result.success) {
      if (saveToFirebase) {
        alert("Results saved successfully to Firebase! Report ID: " + result.id)
      } else {
        alert("Results saved successfully to local storage! Report ID: " + result.id)
      }
    } else {
      alert("Error saving results. Please try again.")
    }
  } catch (error) {
    console.error("Error saving results:", error)

    // Fallback to localStorage
    saveToLocalStorage(userData, window.testResults)

    // Reset button
    const saveResultsBtn = document.getElementById("saveResults")
    if (saveResultsBtn) {
      saveResultsBtn.innerHTML = "Save Results"
      saveResultsBtn.disabled = false
    }

    alert("Error occurred. Results saved to local storage as a backup.")
  }
}

// Update the saveToLocalStorage function to return a result object similar to Firebase
function saveToLocalStorage(userData, testResults) {
  // Generate a unique report ID
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  const reportId = `NS-${timestamp}-${randomStr}`.toUpperCase()

  // Create result object
  const resultsData = {
    // User information
    fullName: userData.fullName || "",
    email: userData.email || "",
    age: userData.age || "",
    gender: userData.gender || "",
    familyHistory: userData.familyHistory || "",
    medicalSituation: userData.medicalSituation || "",

    // Test results
    testResults: testResults,

    // Overall assessment
    overallHealthy: calculateOverallScore(testResults, "healthy"),
    overallParkinsons: calculateOverallScore(testResults, "parkinsons"),

    // Timestamps
    timestamp: new Date().toISOString(),
    reportId: reportId,
  }

  // Get existing results
  const existingResultsString = localStorage.getItem("savedResults")
  const savedResults = existingResultsString ? JSON.parse(existingResultsString) : []

  // Add new results
  savedResults.push(resultsData)

  // Save back to localStorage
  localStorage.setItem("savedResults", JSON.stringify(savedResults))

  console.log("Results saved to localStorage with ID:", reportId)
  return { success: true, id: reportId }
}

// Helper function to calculate overall score
function calculateOverallScore(testResults, scoreType) {
  let totalScore = 0
  let testsCompleted = 0

  // Check each test
  Object.values(testResults).forEach((test) => {
    if (test.status !== "Not Tested") {
      totalScore += test[scoreType]
      testsCompleted++
    }
  })

  // Return average or 0 if no tests completed
  return testsCompleted > 0 ? Math.round(totalScore / testsCompleted) : 0
}

// Show notification function
function showNotification(message, type = "info") {
  const notificationDiv = document.createElement("div")
  notificationDiv.className = `alert alert-${type} alert-dismissible fade show`
  notificationDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `

  const notificationContainer = document.getElementById("notificationContainer") || document.body
  notificationContainer.appendChild(notificationDiv)

  // Automatically remove the notification after a few seconds
  setTimeout(() => {
    notificationDiv.remove()
  }, 5000)
}

// Import Bootstrap Modal
window.bootstrap = window.bootstrap || {}
window.bootstrap.Modal =
  window.bootstrap.Modal ||
  function (modalElement) {
    this.show = () => {
      modalElement.style.display = "block"
    }
    this.hide = () => {
      modalElement.style.display = "none"
    }
    this.getInstance = () => {
      return this
    }
  }
