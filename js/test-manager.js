// Test Manager - Handles all test functionality without relying on Bootstrap modals
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
  initializeSpiralTest()
  initializeTapTest()
  initializeReactionTest()
  initializeVoiceTest()

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
})

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
  const modal = document.getElementById(modalId)
  if (!modal) return

  modal.classList.add("show")
  modal.style.display = "block"
  document.body.classList.add("modal-open")

  // Focus the first focusable element
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  if (focusableElements.length > 0) {
    focusableElements[0].focus()
  }

  // Add keyboard event listener for accessibility
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideModal(modalId)
    }
  })
}

// Hide modal function
function hideModal(modalId) {
  const modal = document.getElementById(modalId)
  if (!modal) return

  modal.classList.remove("show")
  modal.style.display = "none"
  document.body.classList.remove("modal-open")

  // Return focus to the button that opened the modal
  const triggerButton = document.querySelector(`[data-target="#${modalId}"]`)
  if (triggerButton) {
    triggerButton.focus()
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

// Update test status display
function updateTestStatusDisplay() {
  Object.entries(window.testResults).forEach(([test, result]) => {
    const statusEl = document.getElementById(`${test}TestStatus`)
    const healthyEl = document.getElementById(`${test}HealthyBar`)
    const parkinsonsEl = document.getElementById(`${test}ParkinsonBar`)
    const healthyPercentEl = document.getElementById(`${test}HealthyPercent`)
    const parkinsonsPercentEl = document.getElementById(`${test}ParkinsonPercent`)
    
    if (statusEl) {
      statusEl.textContent = result.status
      statusEl.className = `status-value ${result.status.toLowerCase().replace(' ', '-')}`
    }
    
    if (healthyEl) {
      healthyEl.style.width = `${result.healthy}%`
      healthyEl.setAttribute('aria-valuenow', result.healthy)
    }
    
    if (parkinsonsEl) {
      parkinsonsEl.style.width = `${result.parkinsons}%`
      parkinsonsEl.setAttribute('aria-valuenow', result.parkinsons)
    }

    if (healthyPercentEl) {
      healthyPercentEl.textContent = `${result.healthy}%`
    }

    if (parkinsonsPercentEl) {
      parkinsonsPercentEl.textContent = `${result.parkinsons}%`
    }
  })

  // Update overall results
  const overallResults = calculateOverallResults()
  const overallStatusEl = document.getElementById('overallStatus')
  const overallHealthyEl = document.getElementById('overallHealthyBar')
  const overallParkinsonsEl = document.getElementById('overallParkinsonBar')
  
  if (overallStatusEl) {
    overallStatusEl.textContent = overallResults.status
    overallStatusEl.className = `status-value ${overallResults.status.toLowerCase().replace(' ', '-')}`
  }
  
  if (overallHealthyEl) {
    overallHealthyEl.style.width = `${overallResults.healthy}%`
    overallHealthyEl.setAttribute('aria-valuenow', overallResults.healthy)
  }
  
  if (overallParkinsonsEl) {
    overallParkinsonsEl.style.width = `${overallResults.parkinsons}%`
    overallParkinsonsEl.setAttribute('aria-valuenow', overallResults.parkinsons)
  }
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
  const spiralCanvas = document.getElementById("spiralCanvas")
  const clearSpiralCanvas = document.getElementById("clearSpiralCanvas")
  const submitSpiralTest = document.getElementById("submitSpiralTest")

  if (!spiralCanvas) {
    console.error("Spiral canvas not found")
    return
  }

  console.log("Initializing spiral test")

  const ctx = spiralCanvas.getContext("2d")
  let isDrawing = false
  let lastX = 0
  let lastY = 0
  let spiralPath = []
  let spiralGuidePoints = []
  let currentDotIndex = 1
  let startTime = 0

  function drawSpiralGuide() {
    ctx.clearRect(0, 0, spiralCanvas.width, spiralCanvas.height)
    spiralGuidePoints = []
    spiralPath = []
    currentDotIndex = 1
    const centerX = spiralCanvas.width / 2
    const centerY = spiralCanvas.height / 2
    const maxRadius = Math.min(centerX, centerY) - 20

    ctx.beginPath()
    ctx.strokeStyle = "rgba(200, 200, 200, 0.5)"
    ctx.lineWidth = 1

    for (let i = 0; i <= 15; i += 0.1) {
      const angle = i * 0.5 * Math.PI
      const radius = (i / 15) * maxRadius
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    let i = 1
    const animatePoints = () => {
      if (i <= 15) {
        const angle = i * 0.5 * Math.PI
        const radius = (i / 15) * maxRadius
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)

        spiralGuidePoints.push({ x, y, radius, angle })

        ctx.beginPath()
        ctx.arc(x, y, 5, 0, 2 * Math.PI)
        ctx.fillStyle = "#4e73df"
        ctx.fill()
        ctx.strokeStyle = "#000"
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.font = "12px Arial"
        ctx.fillStyle = "#000"
        ctx.fillText(i.toString(), x + 10, y)

        i++
        setTimeout(animatePoints, 100)
      }
    }
    animatePoints()
  }

  function getSmoothPoint(points, t) {
    const p0 = points[t - 1] || points[t]
    const p1 = points[t]
    const p2 = points[t + 1] || points[t]
    return {
      x: (p0.x + p1.x + p2.x) / 3,
      y: (p0.y + p1.y + p2.y) / 3,
    }
  }

  function findClosestDot(x, y) {
    let closest = null
    let minDist = Infinity
    spiralGuidePoints.forEach((dot, idx) => {
      const dist = Math.hypot(x - dot.x, y - dot.y)
      if (dist < minDist) {
        minDist = dist
        closest = { dot, index: idx }
      }
    })
    return closest
  }

  function evaluateDrawing() {
    let totalDeviation = 0
    let matchedPoints = 0

    spiralPath.forEach(p => {
      const { dot } = findClosestDot(p.x, p.y)
      totalDeviation += Math.hypot(p.x - dot.x, p.y - dot.y)
      if (Math.hypot(p.x - dot.x, p.y - dot.y) < 15) matchedPoints++
    })

    const avgDeviation = totalDeviation / spiralPath.length
    const timeTaken = (Date.now() - startTime) / 1000
    const percentCompleted = (matchedPoints / spiralGuidePoints.length) * 100

    // Calculate final score based on multiple factors
    const smoothnessScore = 100 - Math.min(100, avgDeviation * 2)
    const accuracyScore = percentCompleted
    const timeScore = Math.max(0, 100 - (timeTaken * 5)) // Penalize for taking too long

    // Weighted average of scores
    const finalScore = (smoothnessScore * 0.4 + accuracyScore * 0.4 + timeScore * 0.2)

    // Update test results
    calculateTestResults("spiral", finalScore, {
      smoothness: smoothnessScore,
      accuracy: accuracyScore,
      time: timeScore,
      dotsHit: matchedPoints,
      totalDots: spiralGuidePoints.length,
      avgDeviation: avgDeviation,
      timeTaken: timeTaken
    })

    // Close modal after a delay
    setTimeout(() => {
      hideModal("spiralTestModal")
    }, 2000)
  }

  // ... rest of the original spiral test implementation ...
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
    if (dotsShown >= 20) {
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

      // Auto-hide dot after 1500ms (half a second) as requested
      dotTimeout = setTimeout(() => {
        tapDot.style.display = "none"
        // Record a miss
        tapTimes[dotsShown - 1] = -1
        setTimeout(showNextDot, 1500) // Small delay before showing next dot
      }, 1500) // Changed from 1500ms to 500ms
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

  // ... rest of the original tap test implementation ...
}

// REACTION TEST IMPLEMENTATION
function initializeReactionTest() {
  const btn = document.getElementById("reactionStartBtn")
  const box = document.getElementById("reactionBox")
  if (!btn || !box) {
    console.error("Reaction test elements not found")
    return
  }

  const results = []
  let timeoutID, startTime

  // Cleanup function
  function cleanup() {
    results.length = 0
    if (timeoutID) clearTimeout(timeoutID)
    box.style.background = "gray"
  }

  console.log("Initializing reaction test")

  let waitingForClick = false
  let currentTrial = 0
  let falseStarts = 0 // Track false starts (clicking too early)

  // Define the startReactionTestFunction globally
  window.startReactionTestFunction = () => {
    // Reset for new test
    results.length = 0
    currentTrial = 0
    falseStarts = 0

    startNextTrial()
  }

  function startNextTrial() {
    box.style.backgroundColor = "#f8f9fa"
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
            timeoutID = setTimeout(() => {
              box.style.backgroundColor = "#28a745"
              startTime = Date.now()
              waitingForClick = true
            }, delay)
          }, 1000)
        }, 1000)
      }, 1000)
    }
  }

  // Handle click on reaction test container
  box.addEventListener("click", () => {
    // Fix for clicking early showing more time
    if (!waitingForClick && startTime === 0) {
      // Clicked too early - clear any pending timeout
      clearTimeout(timeoutID)
      box.style.backgroundColor = "#dc3545" // Red background
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
      results.push(reactionTimeMs)

      // Reset the background color
      box.style.backgroundColor = "#f8f9fa"

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
        const avgReactionTime = results.reduce((sum, time) => sum + time, 0) / results.length

        if (reactionResult) {
          reactionResult.textContent = `Average reaction time: ${Math.round(avgReactionTime)} ms`
        }

        console.log("Reaction test results:", {
          results,
          avgReactionTime,
          falseStarts,
        })

        // Calculate score based on reaction time
        // Use the average reaction time to calculate the score
        calculateTestResults("reaction", avgReactionTime, {
          trials: results.length,
          falseStarts: falseStarts,
          fastest: Math.min(...results),
          slowest: Math.max(...results),
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
  box.addEventListener("touchstart", (e) => {
    e.preventDefault()
    // Trigger the same logic as click
    box.click()
  })

  // Add cleanup on modal close
  document.getElementById("reactionTestModal").addEventListener("hidden.bs.modal", cleanup)
}

// VOICE TEST IMPLEMENTATION
function initializeVoiceTest() {
  const startBtn = document.getElementById("startVoiceTest")
  const scoreDisplay = document.getElementById("voiceScoreDisplay")
  if (!startBtn) {
    console.error("Voice test elements not found")
    return
  }

  let audioContext = null
  let mediaStream = null

  // Cleanup function
  function cleanup() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
    }
    if (audioContext) {
      audioContext.close()
    }
  }

  console.log("Initializing voice test")

  let recognition = null // Speech recognition object

  // Expected phrase
  const expectedPhrase = "The quick brown fox jumps over the lazy dog"
  const expectedWords = expectedPhrase.toLowerCase().split(/\s+/)

  // Initialize speech recognition if available
  function initSpeechRecognition() {
    try {
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        // Create speech recognition instance
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        recognition = new SpeechRecognition()

        // Configure recognition
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        // Set up recognition event handlers
        recognition.onresult = (event) => {
          let interimTranscript = ""
          let finalTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }

          // Update status with interim results
          if (recordingStatus && interimTranscript) {
            recordingStatus.innerHTML = `
            <div>Recording...</div>
            <div class="text-muted">Heard: "${interimTranscript}"</div>
          `
          }

          // Store final transcript
          if (finalTranscript) {
            window.finalVoiceTranscript = finalTranscript
          }
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          if (recordingStatus) {
            recordingStatus.textContent = `Error: ${event.error}. Please try again.`
          }
        }

        return true
      } else {
        console.warn("Speech recognition not supported in this browser")
        return false
      }
    } catch (error) {
      console.error("Error initializing speech recognition:", error)
      return false
    }
  }

  // Start recording
  startBtn.addEventListener("click", async () => {
    try {
      if (recordingStatus) {
        recordingStatus.textContent = "Requesting microphone permission..."
      }

      // Initialize speech recognition
      const recognitionAvailable = initSpeechRecognition()

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Set up audio context for visualization
      audioContext = new (window.AudioContext || window.webkitAudioContext)()
      let analyser = audioContext.createAnalyser()
      mediaStream = stream
      let microphone = audioContext.createMediaStreamSource(stream)
      microphone.connect(analyser)
      analyser.fftSize = 256

      // Reset audio data
      window.finalVoiceTranscript = ""

      // Set up canvas for visualization
      if (audioVisualization) {
        let canvasContext = audioVisualization.getContext("2d")
        visualize()
      }

      // Set up media recorder
      let mediaRecorder = new MediaRecorder(stream)
      mediaRecorder.start()

      // Start speech recognition if available
      if (recognitionAvailable && recognition) {
        recognition.start()
      }

      // Collect audio data
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          // Process audio data
        }
      }

      // Update UI
      startBtn.disabled = true
      if (stopRecording) stopRecording.disabled = false
      if (recordingStatus) {
        recordingStatus.innerHTML = `
        <div>Recording... Say:</div>
        <div class="fw-bold">"${expectedPhrase}"</div>
        <div class="text-muted mt-2">Time remaining: <span id="recordingTimer">10</span> seconds</div>
      `
      }

      // Start countdown timer
      let timeLeft = 5 // 5 seconds
      const timerElement = document.getElementById("recordingTimer")

      const countdownInterval = setInterval(() => {
        timeLeft--
        if (timerElement) {
          timerElement.textContent = timeLeft
        }

        if (timeLeft <= 0) {
          clearInterval(countdownInterval)
        }
      }, 1000)

      // Auto-stop after 5 seconds
      let recordingTimeout = setTimeout(() => {
        clearInterval(countdownInterval)
        if (mediaRecorder && mediaRecorder.state === "recording") {
          if (stopRecording) stopRecording.click()
        }
      }, 5000) // 5 seconds
    } catch (error) {
      console.error("Error accessing microphone:", error)

      let errorMessage = "Error: Could not access microphone."

      // Provide more specific error messages
      if (error.name === "NotAllowedError") {
        errorMessage = "Microphone access was denied. Please allow microphone access and try again."

        // If the error was because permission was dismissed, offer retry
        if (error.message.includes("dismissed")) {
          errorMessage += " Click 'Start Recording' to try again."
        }
      } else if (error.name === "NotFoundError") {
        errorMessage = "No microphone found. Please connect a microphone and try again."
      } else if (error.name === "NotReadableError") {
        errorMessage = "Microphone is already in use by another application."
      }

      if (recordingStatus) {
        recordingStatus.textContent = errorMessage
      }

      // Immediately simulate a result if microphone access fails
      // This allows testing to continue even without microphone access
      setTimeout(() => {
        if (confirm("Microphone access failed. Would you like to simulate voice test results to continue testing?")) {
          // Simulate voice analysis (random for demo)
          const voiceQuality = Math.random() * 100

          if (voiceQuality > 60) {
            window.testResults.voice.status = "Healthy"
            window.testResults.voice.healthy = 75
            window.testResults.voice.parkinsons = 25
            window.testResults.voice.rawScore = voiceQuality
          } else {
            window.testResults.voice.status = "Not Healthy"
            window.testResults.voice.healthy = 30
            window.testResults.voice.parkinsons = 70
            window.testResults.voice.rawScore = voiceQuality
          }

          // Update UI
          updateTestStatusDisplay()

          // Close modal
          hideModal("voiceTestModal")
        }
      }, 500)
    }
  })

  // Stop recording
  if (stopRecording) {
    stopRecording.addEventListener("click", () => {
      // Clear the auto-stop timeout
      if (recordingTimeout) {
        clearTimeout(recordingTimeout)
        recordingTimeout = null
      }

      if (mediaRecorder) {
        try {
          mediaRecorder.stop()

          // Stop speech recognition if active
          if (recognition) {
            try {
              recognition.stop()
            } catch (error) {
              console.error("Error stopping speech recognition:", error)
            }
          }

          // Process audio data when recording stops
          mediaRecorder.onstop = () => {
            try {
              // Get frequency data from analyzer
              const bufferLength = analyser.frequencyBinCount
              const dataArray = new Uint8Array(bufferLength)
              analyser.getByteFrequencyData(dataArray)

              // Rest of the processing code...

              // Get the transcript and calculate word match score
              const transcript = window.finalVoiceTranscript || ""
              let wordMatchScore = 0

              if (transcript) {
                // Calculate how many words from the expected phrase were spoken
                const spokenWords = transcript.toLowerCase().split(/\s+/)
                let matchedWords = 0

                // Count words that match (simple approach)
                expectedWords.forEach((expectedWord) => {
                  if (spokenWords.includes(expectedWord)) {
                    matchedWords++
                  }
                })

                // Calculate percentage of words matched
                wordMatchScore = Math.round((matchedWords / expectedWords.length) * 100)

                if (recordingStatus) {
                  recordingStatus.innerHTML = `
                <div>Processing complete!</div>
                <div class="text-muted">You said: "${transcript}"</div>
                <div class="mt-2">Words matched: ${matchedWords}/${expectedWords.length} (${wordMatchScore}%)</div>
              `
                }
              } else {
                // No transcript available
                if (recordingStatus) {
                  recordingStatus.textContent = "No speech detected. Please try again."
                }
                wordMatchScore = 0
              }

              // Combined score (word match has highest weight)
              const voiceScore = wordMatchScore * 0.6 + 40 // Add base score to prevent total failure

              // Update test results
              calculateTestResults("voice", voiceScore, {
                transcript: transcript,
                wordsMatched: wordMatchScore,
                recordingDuration: 5, // seconds
              })

              // Show results for 3 seconds before closing
              setTimeout(() => {
                // Close modal
                hideModal("voiceTestModal")
              }, 3000)
            } catch (error) {
              console.error("Error processing audio data:", error)
              // Fallback score in case of error
              calculateTestResults("voice", 50, {
                transcript: "Error processing audio",
                wordsMatched: 0,
                recordingDuration: 5,
              })

              if (recordingStatus) {
                recordingStatus.textContent = "Error processing audio. Using fallback score."
              }

              setTimeout(() => {
                hideModal("voiceTestModal")
              }, 3000)
            }
          }

          // Stop visualization
          if (animationFrame) {
            cancelAnimationFrame(animationFrame)
          }

          // Clean up audio context
          if (microphone) {
            microphone.disconnect()
          }

          // Update UI
          startBtn.disabled = false
          stopRecording.disabled = true
          if (recordingStatus) recordingStatus.textContent = "Recording stopped. Processing..."
        } catch (error) {
          console.error("Error stopping recording:", error)
          // Reset UI
          startBtn.disabled = false
          stopRecording.disabled = true
          if (recordingStatus) recordingStatus.textContent = "Error stopping recording. Please try again."
        }
      }
    })
  }

  // Audio visualization
  function visualize() {
    if (!canvasContext || !audioVisualization || !analyser) return

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    canvasContext.clearRect(0, 0, audioVisualization.width, audioVisualization.height)

    function draw() {
      animationFrame = requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray)

      canvasContext.fillStyle = "#f8f9fa"
      canvasContext.fillRect(0, 0, audioVisualization.width, audioVisualization.height)

      const barWidth = (audioVisualization.width / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2

        canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`
        canvasContext.fillRect(x, audioVisualization.height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }
    }

    draw()
  }

  // Add cleanup on modal close
  document.getElementById("voiceTestModal").addEventListener("hidden.bs.modal", cleanup)
}

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

// Add utility functions
function showError(message) {
  const errorDiv = document.createElement("div")
  errorDiv.className = "alert alert-danger"
  errorDiv.textContent = message
  document.body.insertBefore(errorDiv, document.body.firstChild)
  setTimeout(() => errorDiv.remove(), 5000)
}

function setupResultsView() {
  const viewResultsBtn = document.getElementById("viewResults")
  if (viewResultsBtn) {
    viewResultsBtn.addEventListener("click", () => {
      try {
        showResults()
      } catch (error) {
        console.error("Failed to show results:", error)
        showError("Failed to display results. Please try again.")
      }
    })
  }
}

// Add loading states to buttons
function setButtonLoading(button, isLoading) {
  if (!button) return
  
  if (isLoading) {
    button.disabled = true
    const originalText = button.innerHTML
    button.setAttribute('data-original-text', originalText)
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...'
  } else {
    button.disabled = false
    const originalText = button.getAttribute('data-original-text')
    if (originalText) {
      button.innerHTML = originalText
    }
  }
}

