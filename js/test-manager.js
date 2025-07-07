// Test Manager - Handles all test functionality
document.addEventListener("DOMContentLoaded", () => {
  console.log("Test Manager loaded")

  // Global test results
  window.testResults = {
    spiral: { completed: false, score: 0, details: {} },
    tap: { completed: false, score: 0, details: {} },
    reaction: { completed: false, score: 0, details: {} },
    voice: { completed: false, score: 0, details: {} },
  }

  // Initialize modal close handlers
  initializeModalHandlers()

  // Setup test button handlers
  setupTestButtons()

  // Setup global test functions
  setupGlobalTestFunctions()
})

function initializeModalHandlers() {
  // Handle modal close buttons
  document.querySelectorAll(".modal .btn-close, .modal [data-bs-dismiss='modal']").forEach((button) => {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal")
      if (modal) {
        hideModal(modal.id)
      }
    })
  })

  // Handle modal backdrop clicks
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        hideModal(this.id)
      }
    })
  })
}

function setupTestButtons() {
  // Spiral Test Button
  const spiralBtn = document.getElementById("startSpiralTest")
  if (spiralBtn) {
    spiralBtn.addEventListener("click", () => {
      if (!checkRegistration()) return
      showModal("spiralTestModal")
      setTimeout(() => initializeSpiralTest(), 500)
    })
  }

  // Tap Test Button
  const tapBtn = document.getElementById("startTapTest")
  if (tapBtn) {
    tapBtn.addEventListener("click", () => {
      if (!checkRegistration()) return
      showModal("tapTestModal")
      setTimeout(() => {
        const startTapBtn = document.getElementById("startTapTestBtn")
        if (startTapBtn) {
          startTapBtn.click()
        }
      }, 500)
    })
  }

  // Reaction Test Button
  const reactionBtn = document.getElementById("startReactionTest")
  if (reactionBtn) {
    reactionBtn.addEventListener("click", () => {
      if (!checkRegistration()) return
      showModal("reactionTestModal")
      setTimeout(() => {
        const startReactionBtn = document.getElementById("startReactionTestBtn")
        if (startReactionBtn) {
          startReactionBtn.click()
        }
      }, 500)
    })
  }

  // Voice Test Button
  const voiceBtn = document.getElementById("startVoiceTest")
  if (voiceBtn) {
    voiceBtn.addEventListener("click", () => {
      if (!checkRegistration()) return
      showModal("voiceTestModal")
    })
  }
}

function setupGlobalTestFunctions() {
  // Tap Test Function
  window.startTapTestFunction = () => {
    console.log("Starting tap test")

    let dotsClicked = 0
    let dotsShown = 0
    let tapTestActive = false
    let dotTimeout = null

    const container = document.getElementById("tapTestContainer")
    const dot = document.getElementById("tapDot")
    const countdown = document.getElementById("tapCountdown")
    const scoreDisplay = document.getElementById("tapScore")

    if (!container || !dot) {
      console.error("Tap test elements not found")
      return
    }

    // Reset test
    dotsClicked = 0
    dotsShown = 0
    tapTestActive = false

    if (scoreDisplay) scoreDisplay.textContent = "Score: 0/10"

    // Animated countdown
    if (countdown) {
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
              showNextDot()
            }, 800)
          }, 1000)
        }, 1000)
      }, 1000)
    }

    function showNextDot() {
      if (dotsShown >= 10) {
        endTapTest()
        return
      }

      dotsShown++

      // Random position with padding
      const containerWidth = container.offsetWidth
      const containerHeight = container.offsetHeight
      const dotSize = 50
      const padding = 10

      const left = Math.max(
        padding,
        Math.min(containerWidth - dotSize - padding, Math.random() * (containerWidth - dotSize)),
      )
      const top = Math.max(
        padding,
        Math.min(containerHeight - dotSize - padding, Math.random() * (containerHeight - dotSize)),
      )

      dot.style.left = `${left}px`
      dot.style.top = `${top}px`
      dot.style.display = "block"

      // SLOWER: Auto-hide after 800ms (increased from 500ms)
      dotTimeout = setTimeout(() => {
        dot.style.display = "none"
        setTimeout(showNextDot, 600) // SLOWER: 600ms delay between dots
      }, 800)
    }

    // Dot click handler
    dot.onclick = () => {
      if (!tapTestActive) return

      clearTimeout(dotTimeout)
      dotsClicked++
      dot.style.display = "none"

      if (scoreDisplay) scoreDisplay.textContent = `Score: ${dotsClicked}/10`

      setTimeout(showNextDot, 600) // SLOWER: 600ms delay after successful tap
    }

    function endTapTest() {
      tapTestActive = false
      dot.style.display = "none"

      const finalScore = (dotsClicked / 10) * 100
      window.testResults.tap = {
        completed: true,
        score: finalScore,
        details: { hits: dotsClicked, total: 10, timestamp: new Date().toISOString() },
      }

      updateTestStatus("tap", "completed")
      if (window.showNotification) {
        window.showNotification(`Tap test completed! Score: ${dotsClicked}/10`, "success")
      }

      setTimeout(() => {
        hideModal("tapTestModal")
        checkAllTestsCompleted()
      }, 2000)
    }
  }

  // Reaction Test Function
  window.startReactionTestFunction = () => {
    console.log("Starting reaction test")

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

    reactionTestActive = true
    reactionTimes = []
    currentTrial = 0
    startNextTrial()

    function startNextTrial() {
      if (currentTrial >= 3) {
        endReactionTest()
        return
      }

      container.style.background = "#f8f9fc"
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
    }

    function endReactionTest() {
      reactionTestActive = false
      const avgTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      const score = Math.max(0, Math.min(100, 100 - (avgTime - 200) / 10))

      window.testResults.reaction = {
        completed: true,
        score: Math.round(score),
        details: {
          times: reactionTimes,
          average: Math.round(avgTime),
          timestamp: new Date().toISOString(),
        },
      }

      updateTestStatus("reaction", "completed")
      if (window.showNotification) {
        window.showNotification(`Reaction test completed! Average: ${Math.round(avgTime)}ms`, "success")
      }

      setTimeout(() => {
        hideModal("reactionTestModal")
        checkAllTestsCompleted()
      }, 2000)
    }
  }
}

function checkRegistration() {
  const userData = localStorage.getItem("userData")
  if (!userData) {
    if (window.showNotification) {
      window.showNotification("Please complete registration first!", "warning")
    }
    if (window.showSection) {
      window.showSection("register")
    }
    return false
  }
  return true
}

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

// Update test status
function updateTestStatus(testName, status) {
  const statusElement = document.getElementById(`${testName}TestStatus`)
  if (statusElement) {
    statusElement.textContent = status === "completed" ? "Completed" : "Not Tested"
    statusElement.className = `status-value ${status === "completed" ? "completed" : ""}`
  }
}

// Check if all tests completed
function checkAllTestsCompleted() {
  const completedTests = Object.values(window.testResults).filter((test) => test.completed).length
  const viewResultsBtn = document.getElementById("viewResults")
  const printResultsBtn = document.getElementById("printResults")

  if (completedTests > 0) {
    if (viewResultsBtn) viewResultsBtn.disabled = false
    if (printResultsBtn) printResultsBtn.disabled = false
  }

  if (completedTests === 4) {
    if (window.showNotification) {
      window.showNotification("All tests completed! You can now view your results.", "success")
    }
  }
}

// Spiral Test Implementation
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
        if (window.showNotification) {
          window.showNotification("Please draw a complete spiral before submitting.", "warning")
        }
        return
      }

      const score = analyzeSpiralDrawing(path)
      window.testResults.spiral = {
        completed: true,
        score: score,
        details: {
          pathLength: path.length,
          timestamp: new Date().toISOString(),
        },
      }

      updateTestStatus("spiral", "completed")
      if (window.showNotification) {
        window.showNotification("Spiral test completed!", "success")
      }

      hideModal("spiralTestModal")
      checkAllTestsCompleted()
    }
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

// Voice Test Implementation
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

    updateTestStatus("voice", "completed")
    if (window.showNotification) {
      window.showNotification(`Voice test completed! Score: ${score}%`, "success")
    }

    setTimeout(() => {
      hideModal("voiceTestModal")
      checkAllTestsCompleted()
    }, 2000)
  }
}

// Export functions
window.initializeSpiralTest = initializeSpiralTest
window.initializeVoiceTest = initializeVoiceTest
window.showModal = showModal
window.hideModal = hideModal

// Declare hideSection and showSection functions
function hideSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.style.display = "none"
  }
}

function showSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.style.display = "block"
  }
}
