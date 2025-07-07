// Fixed Tap Speed Test Implementation
document.addEventListener("DOMContentLoaded", () => {
  console.log("Tap Test Fix loaded")

  // Enhanced tap test functionality
  function initializeTapTestFixed() {
    const tapTestContainer = document.getElementById("tapTestContainer")
    const tapCountdown = document.getElementById("tapCountdown")
    const tapDot = document.getElementById("tapDot")
    const tapScore = document.getElementById("tapScore")

    if (!tapTestContainer || !tapDot) {
      console.error("Tap test elements not found")
      return
    }

    let dotsClicked = 0
    let dotsShown = 0
    let tapTestActive = false
    let dotTimeout = null
    let tapTimes = []
    let dotAppearTimes = []
    let missedDots = 0

    // Enhanced startTapTestFunction
    window.startTapTestFunction = () => {
      console.log("Starting tap test...")

      // Reset all variables
      dotsClicked = 0
      dotsShown = 0
      tapTestActive = false
      tapTimes = []
      dotAppearTimes = []
      missedDots = 0

      // Clear any existing timeouts
      if (dotTimeout) {
        clearTimeout(dotTimeout)
        dotTimeout = null
      }

      // Hide dot initially
      tapDot.style.display = "none"

      // Update score display
      if (tapScore) {
        tapScore.textContent = "Score: 0/10"
        tapScore.className = "mb-2 text-center"
      }

      // Start countdown
      if (tapCountdown) {
        tapCountdown.style.display = "block"
        tapCountdown.style.color = "var(--royal-blue)"
        tapCountdown.textContent = "3"

        setTimeout(() => {
          tapCountdown.textContent = "2"
          setTimeout(() => {
            tapCountdown.textContent = "1"
            setTimeout(() => {
              tapCountdown.textContent = "GO!"
              tapCountdown.style.color = "var(--medical-green)"
              setTimeout(() => {
                tapCountdown.style.display = "none"
                tapTestActive = true
                showNextDot()
              }, 500)
            }, 1000)
          }, 1000)
        }, 1000)
      }
    }

    // Enhanced dot showing function
    function showNextDot() {
      if (dotsShown >= 10) {
        endTapTest()
        return
      }

      dotsShown++

      // Get container dimensions
      const containerRect = tapTestContainer.getBoundingClientRect()
      const containerWidth = tapTestContainer.offsetWidth
      const containerHeight = tapTestContainer.offsetHeight
      const dotSize = 50

      // Calculate safe positioning (ensure dot is fully visible)
      const padding = 25 // Half dot size + some margin
      const maxLeft = containerWidth - dotSize - padding
      const maxTop = containerHeight - dotSize - padding

      const left = Math.max(padding, Math.random() * maxLeft)
      const top = Math.max(padding, Math.random() * maxTop)

      // Position and show the dot
      tapDot.style.left = left + "px"
      tapDot.style.top = top + "px"
      tapDot.style.width = dotSize + "px"
      tapDot.style.height = dotSize + "px"
      tapDot.style.display = "block"
      tapDot.style.position = "absolute"
      tapDot.style.zIndex = "1000"
      tapDot.style.cursor = "pointer"

      // Add visual feedback
      tapDot.classList.add("scale-in")
      setTimeout(() => {
        tapDot.classList.remove("scale-in")
      }, 300)

      // Record appearance time
      dotAppearTimes[dotsShown - 1] = Date.now()

      // Auto-hide after 2 seconds
      dotTimeout = setTimeout(() => {
        if (tapDot.style.display === "block") {
          tapDot.style.display = "none"
          missedDots++
          tapTimes[dotsShown - 1] = -1 // Mark as missed

          // Update score to show miss
          if (tapScore) {
            tapScore.innerHTML = `Score: ${dotsClicked}/10 <span style="color: var(--medical-red);">(Missed: ${missedDots})</span>`
          }

          // Show next dot after brief delay
          setTimeout(() => {
            if (tapTestActive) {
              showNextDot()
            }
          }, 300)
        }
      }, 2000)
    }

    // Enhanced dot click handler
    function handleDotClick(event) {
      if (!tapTestActive || tapDot.style.display === "none") {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      dotsClicked++

      // Record reaction time
      const reactionTime = Date.now() - dotAppearTimes[dotsShown - 1]
      tapTimes[dotsShown - 1] = reactionTime

      // Visual feedback
      tapDot.style.transform = "scale(1.2)"
      tapDot.style.background = "var(--medical-green)"

      setTimeout(() => {
        tapDot.style.transform = "scale(1)"
        tapDot.style.background = "linear-gradient(135deg, var(--royal-blue), var(--royal-purple))"
      }, 150)

      // Update score
      if (tapScore) {
        tapScore.innerHTML = `Score: ${dotsClicked}/10`
      }

      // Hide dot and clear timeout
      setTimeout(() => {
        tapDot.style.display = "none"
        if (dotTimeout) {
          clearTimeout(dotTimeout)
          dotTimeout = null
        }

        // Show next dot
        setTimeout(() => {
          if (tapTestActive) {
            showNextDot()
          }
        }, 300)
      }, 200)
    }

    // Enhanced test end function
    function endTapTest() {
      tapTestActive = false
      tapDot.style.display = "none"

      if (dotTimeout) {
        clearTimeout(dotTimeout)
        dotTimeout = null
      }

      // Calculate results
      const accuracy = (dotsClicked / 10) * 100
      const avgReactionTime =
        tapTimes.filter((time) => time > 0).reduce((sum, time) => sum + time, 0) / Math.max(1, dotsClicked)

      // Show completion message
      if (tapScore) {
        tapScore.innerHTML = `
          <div class="text-center">
            <div class="mb-2"><strong>Test Complete!</strong></div>
            <div>Accuracy: ${dotsClicked}/10 (${Math.round(accuracy)}%)</div>
            <div>Average Time: ${Math.round(avgReactionTime)}ms</div>
          </div>
        `
      }

      // Show loading animation
      setTimeout(() => {
        if (tapScore) {
          tapScore.innerHTML = `
            <div class="text-center">
              <div class="loading-dots mb-2">
                <span class="loading-dot"></span>
                <span class="loading-dot"></span>
                <span class="loading-dot"></span>
              </div>
              <div>Analyzing results...</div>
            </div>
          `
        }

        // Calculate and update test results
        setTimeout(() => {
          // Use accuracy as the primary score
          const testScore = accuracy

          // Update global test results
          if (window.calculateTestResults) {
            window.calculateTestResults("tap", testScore, {
              accuracy: Math.round(accuracy),
              dotsClicked: dotsClicked,
              totalDots: 10,
              missedDots: missedDots,
              avgReactionTime: Math.round(avgReactionTime),
            })
          }

          // Show final score
          if (tapScore) {
            tapScore.innerHTML = `
              <div class="text-center">
                <div class="mb-2"><strong>Analysis Complete!</strong></div>
                <div>Final Score: ${dotsClicked}/10</div>
                <div style="color: var(--medical-green);">Results saved successfully</div>
              </div>
            `
          }

          // Close modal after delay
          setTimeout(() => {
            const modal = document.getElementById("tapTestModal")
            if (modal && window.hideModal) {
              window.hideModal("tapTestModal")
            }
          }, 2000)
        }, 2000)
      }, 1000)
    }

    // Remove any existing event listeners and add new ones
    const newTapDot = tapDot.cloneNode(true)
    tapDot.parentNode.replaceChild(newTapDot, tapDot)

    // Add click event listener
    newTapDot.addEventListener("click", handleDotClick)
    newTapDot.addEventListener("touchstart", (e) => {
      e.preventDefault()
      handleDotClick(e)
    })

    // Prevent container clicks from interfering
    tapTestContainer.addEventListener("click", (e) => {
      if (e.target === tapTestContainer) {
        e.stopPropagation()
      }
    })

    console.log("Tap test initialized successfully")
  }

  // Initialize the fixed tap test
  initializeTapTestFixed()

  // Also ensure it's available globally
  window.initializeTapTestFixed = initializeTapTestFixed
})
