// Fixed Reaction Time Test Implementation
document.addEventListener("DOMContentLoaded", () => {
  console.log("Reaction Test Fix loaded")

  function initializeReactionTestFixed() {
    const reactionTestContainer = document.getElementById("reactionTestContainer")
    const reactionCountdown = document.getElementById("reactionCountdown")
    const reactionTime = document.getElementById("reactionTime")
    const reactionResult = document.getElementById("reactionResult")

    if (!reactionTestContainer) {
      console.error("Reaction test container not found")
      return
    }

    console.log("Initializing fixed reaction test")

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
      waitingForClick = false
      startTime = 0

      // Clear any existing timeouts
      if (reactionTestTimeout) {
        clearTimeout(reactionTestTimeout)
        reactionTestTimeout = null
      }

      startNextTrial()
    }

    function startNextTrial() {
      // Reset container state
      reactionTestContainer.className = "position-relative waiting"
      reactionTestContainer.style.backgroundColor = ""
      reactionTestContainer.style.borderColor = ""

      waitingForClick = false
      startTime = 0

      if (reactionCountdown) {
        reactionCountdown.style.display = "block"
        reactionCountdown.style.color = "var(--royal-blue)"
      }
      if (reactionTime) {
        reactionTime.style.display = "none"
      }
      if (reactionResult) {
        reactionResult.textContent = `Trial ${currentTrial + 1}/${numTrials}: Click when the screen turns green`
        reactionResult.style.color = "var(--text-primary)"
      }

      // Countdown
      if (reactionCountdown) {
        reactionCountdown.textContent = "3"

        setTimeout(() => {
          reactionCountdown.textContent = "2"
          setTimeout(() => {
            reactionCountdown.textContent = "1"
            setTimeout(() => {
              reactionCountdown.textContent = "Wait..."
              reactionCountdown.style.color = "var(--medical-orange)"

              // Random delay before turning green (2-5 seconds)
              const delay = 2000 + Math.random() * 3000
              reactionTestTimeout = setTimeout(() => {
                // Turn screen green
                reactionTestContainer.className = "position-relative ready"
                reactionTestContainer.style.backgroundColor = "var(--medical-green)"
                reactionTestContainer.style.borderColor = "var(--medical-green)"

                if (reactionCountdown) {
                  reactionCountdown.textContent = "CLICK NOW!"
                  reactionCountdown.style.color = "var(--royal-white)"
                }

                startTime = Date.now()
                waitingForClick = true

                console.log("Screen turned green, waiting for click")
              }, delay)
            }, 1000)
          }, 1000)
        }, 1000)
      }
    }

    // Handle click on reaction test container
    function handleContainerClick(event) {
      event.preventDefault()
      event.stopPropagation()

      console.log("Container clicked, waitingForClick:", waitingForClick, "startTime:", startTime)

      // Check if clicked too early
      if (!waitingForClick && startTime === 0) {
        // Clicked too early - clear any pending timeout
        if (reactionTestTimeout) {
          clearTimeout(reactionTestTimeout)
          reactionTestTimeout = null
        }

        reactionTestContainer.className = "position-relative too-early"
        reactionTestContainer.style.backgroundColor = "var(--medical-red)"
        reactionTestContainer.style.borderColor = "var(--medical-red)"

        falseStarts++

        if (reactionResult) {
          reactionResult.textContent = "Too early! Wait for green. Try again..."
          reactionResult.style.color = "var(--medical-red)"
        }

        if (reactionCountdown) {
          reactionCountdown.textContent = "TOO EARLY!"
          reactionCountdown.style.color = "var(--royal-white)"
        }

        // Reset and start next trial after a delay
        setTimeout(() => {
          startNextTrial()
        }, 2000)
        return
      }

      if (waitingForClick && startTime > 0) {
        // Valid click - record reaction time
        const endTime = Date.now()
        const reactionTimeMs = endTime - startTime
        reactionTimes.push(reactionTimeMs)

        console.log("Valid click! Reaction time:", reactionTimeMs)

        // Reset the container state
        reactionTestContainer.className = "position-relative"
        reactionTestContainer.style.backgroundColor = ""
        reactionTestContainer.style.borderColor = ""

        if (reactionTime) {
          reactionTime.textContent = `${reactionTimeMs} ms`
          reactionTime.style.display = "block"
          reactionTime.style.color = "var(--medical-green)"
        }

        if (reactionCountdown) {
          reactionCountdown.style.display = "none"
        }

        // Reset for next trial
        waitingForClick = false
        startTime = 0

        currentTrial++

        if (currentTrial < numTrials) {
          // More trials to go
          if (reactionResult) {
            reactionResult.textContent = `Good! ${reactionTimeMs} ms. Next trial in 2 seconds...`
            reactionResult.style.color = "var(--medical-green)"
          }

          // Start next trial after delay
          setTimeout(() => {
            startNextTrial()
          }, 2000)
        } else {
          // All trials complete, calculate average
          const avgReactionTime = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length

          if (reactionResult) {
            reactionResult.innerHTML = `
              <div class="text-center">
                <div><strong>Test Complete!</strong></div>
                <div>Average reaction time: ${Math.round(avgReactionTime)} ms</div>
                <div>Trials: ${reactionTimes.join(", ")} ms</div>
                ${falseStarts > 0 ? `<div style="color: var(--medical-red);">False starts: ${falseStarts}</div>` : ""}
              </div>
            `
            reactionResult.style.color = "var(--text-primary)"
          }

          console.log("Reaction test results:", {
            reactionTimes,
            avgReactionTime,
            falseStarts,
          })

          // Calculate score based on reaction time
          // Use the average reaction time to calculate the score
          if (window.calculateTestResults) {
            window.calculateTestResults("reaction", avgReactionTime, {
              trials: reactionTimes.length,
              falseStarts: falseStarts,
              fastest: Math.min(...reactionTimes),
              slowest: Math.max(...reactionTimes),
              average: avgReactionTime,
            })
          }

          // Close modal after 4 seconds
          setTimeout(() => {
            const modal = document.getElementById("reactionTestModal")
            if (modal && window.hideModal) {
              window.hideModal("reactionTestModal")
            }
          }, 4000)
        }
      }
    }

    // Remove existing event listeners and add new ones
    const newContainer = reactionTestContainer.cloneNode(true)
    reactionTestContainer.parentNode.replaceChild(newContainer, reactionTestContainer)

    // Add event listeners to the new container
    newContainer.addEventListener("click", handleContainerClick)
    newContainer.addEventListener("touchstart", (e) => {
      e.preventDefault()
      handleContainerClick(e)
    })

    console.log("Reaction test initialized successfully")
  }

  // Initialize the fixed reaction test
  initializeReactionTestFixed()

  // Make it available globally
  window.initializeReactionTestFixed = initializeReactionTestFixed
})
