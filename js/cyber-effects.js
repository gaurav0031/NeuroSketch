// Cyberpunk Visual Effects Manager
document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Initializing Cyberpunk Effects...")

  // Initialize all effects
  initMatrixRain()
  initParticleSystem()
  initScanLines()
  initFloatingElements()
  initCyberCursor()
  initGlitchEffects()
  initAudioVisualizer()

  // Add performance monitoring
  monitorPerformance()
})

// Matrix Rain Effect
function initMatrixRain() {
  const matrixContainer = document.createElement("div")
  matrixContainer.className = "matrix-rain"
  document.body.appendChild(matrixContainer)

  const characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
  const columns = Math.floor(window.innerWidth / 20)

  for (let i = 0; i < columns; i++) {
    createMatrixColumn(matrixContainer, i * 20, characters)
  }
}

function createMatrixColumn(container, x, characters) {
  const column = document.createElement("div")
  column.className = "matrix-column"
  column.style.left = x + "px"
  column.style.animationDuration = Math.random() * 3 + 2 + "s"
  column.style.animationDelay = Math.random() * 2 + "s"

  // Generate random characters
  let text = ""
  for (let i = 0; i < 20; i++) {
    text += characters[Math.floor(Math.random() * characters.length)] + "<br>"
  }
  column.innerHTML = text

  container.appendChild(column)

  // Restart animation when it ends
  column.addEventListener("animationend", () => {
    column.style.animationDelay = Math.random() * 2 + "s"
    // Regenerate text
    let newText = ""
    for (let i = 0; i < 20; i++) {
      newText += characters[Math.floor(Math.random() * characters.length)] + "<br>"
    }
    column.innerHTML = newText
  })
}

// Particle System
function initParticleSystem() {
  const particleContainer = document.createElement("div")
  particleContainer.className = "particle-system"
  document.body.appendChild(particleContainer)

  // Create particles periodically
  setInterval(() => {
    if (particleContainer.children.length < 50) {
      createParticle(particleContainer)
    }
  }, 200)
}

function createParticle(container) {
  const particle = document.createElement("div")
  particle.className = "particle"

  // Random starting position
  particle.style.left = Math.random() * window.innerWidth + "px"
  particle.style.bottom = "0px"

  // Random color
  const colors = ["var(--neon-cyan)", "var(--neon-pink)", "var(--neon-green)", "var(--neon-purple)"]
  const color = colors[Math.floor(Math.random() * colors.length)]
  particle.style.background = color
  particle.style.boxShadow = `0 0 6px ${color}`

  // Random animation duration
  particle.style.animationDuration = Math.random() * 5 + 3 + "s"

  container.appendChild(particle)

  // Remove particle after animation
  particle.addEventListener("animationend", () => {
    particle.remove()
  })
}

// Scan Lines Effect
function initScanLines() {
  const scanLines = document.createElement("div")
  scanLines.className = "scan-lines"
  document.body.appendChild(scanLines)
}

// Floating Elements
function initFloatingElements() {
  const sections = document.querySelectorAll("section")

  sections.forEach((section) => {
    // Add floating elements to each section
    for (let i = 0; i < 3; i++) {
      const element = document.createElement("div")
      element.className = "floating-element"
      element.style.left = Math.random() * 100 + "%"
      element.style.top = Math.random() * 100 + "%"
      element.style.animationDelay = Math.random() * 6 + "s"
      element.style.animationDuration = Math.random() * 4 + 4 + "s"

      section.style.position = "relative"
      section.appendChild(element)
    }
  })
}

// Cyber Cursor Effect
function initCyberCursor() {
  const cursor = document.createElement("div")
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid var(--neon-cyan);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transition: transform 0.1s ease;
  `
  document.body.appendChild(cursor)

  const trail = []
  for (let i = 0; i < 5; i++) {
    const trailElement = document.createElement("div")
    trailElement.style.cssText = `
      position: fixed;
      width: ${15 - i * 2}px;
      height: ${15 - i * 2}px;
      background: var(--neon-cyan);
      border-radius: 50%;
      pointer-events: none;
      z-index: ${9998 - i};
      opacity: ${0.8 - i * 0.15};
      transition: all 0.1s ease;
    `
    document.body.appendChild(trailElement)
    trail.push(trailElement)
  }

  let mouseX = 0,
    mouseY = 0

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX
    mouseY = e.clientY

    cursor.style.left = mouseX - 10 + "px"
    cursor.style.top = mouseY - 10 + "px"

    // Update trail with delay
    trail.forEach((element, index) => {
      setTimeout(() => {
        element.style.left = mouseX - (7.5 - index) + "px"
        element.style.top = mouseY - (7.5 - index) + "px"
      }, index * 20)
    })
  })

  // Cursor interactions
  document.addEventListener("mousedown", () => {
    cursor.style.transform = "scale(1.5)"
    cursor.style.borderColor = "var(--neon-pink)"
  })

  document.addEventListener("mouseup", () => {
    cursor.style.transform = "scale(1)"
    cursor.style.borderColor = "var(--neon-cyan)"
  })

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0"
    trail.forEach((element) => (element.style.opacity = "0"))
  })

  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1"
    trail.forEach((element, index) => {
      element.style.opacity = 0.8 - index * 0.15
    })
  })
}

// Glitch Effects
function initGlitchEffects() {
  // Add glitch effect to random elements
  const elements = document.querySelectorAll("h1, h2, h3, .brand-text")

  elements.forEach((element) => {
    element.setAttribute("data-text", element.textContent)

    // Random glitch trigger
    setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% chance
        element.classList.add("glitch")
        setTimeout(() => {
          element.classList.remove("glitch")
        }, 200)
      }
    }, 2000)
  })
}

// Audio Visualizer for Voice Test
function initAudioVisualizer() {
  const canvas = document.getElementById("audioVisualization")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  const bars = 64
  const barWidth = canvas.width / bars

  // Create animated bars even without audio
  function drawBars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < bars; i++) {
      const barHeight = Math.random() * canvas.height * 0.8
      const x = i * barWidth
      const y = canvas.height - barHeight

      // Create gradient
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0)
      gradient.addColorStop(0, "#00ffff")
      gradient.addColorStop(0.5, "#ff0080")
      gradient.addColorStop(1, "#8000ff")

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth - 2, barHeight)

      // Add glow effect
      ctx.shadowColor = "#00ffff"
      ctx.shadowBlur = 10
      ctx.fillRect(x, y, barWidth - 2, barHeight)
      ctx.shadowBlur = 0
    }

    requestAnimationFrame(drawBars)
  }

  drawBars()
}

// Performance Monitor
function monitorPerformance() {
  let frameCount = 0
  let lastTime = performance.now()

  function checkFPS() {
    frameCount++
    const currentTime = performance.now()

    if (currentTime - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))

      // Reduce effects if FPS is too low
      if (fps < 30) {
        console.warn("⚠️ Low FPS detected, reducing effects...")
        document.body.classList.add("reduced-motion")

        // Remove some particles
        const particles = document.querySelectorAll(".particle")
        particles.forEach((particle, index) => {
          if (index % 2 === 0) particle.remove()
        })

        // Reduce matrix columns
        const matrixColumns = document.querySelectorAll(".matrix-column")
        matrixColumns.forEach((column, index) => {
          if (index % 3 === 0) column.remove()
        })
      }

      frameCount = 0
      lastTime = currentTime
    }

    requestAnimationFrame(checkFPS)
  }

  checkFPS()
}

// Responsive Effects
function handleResize() {
  // Recreate matrix rain on resize
  const matrixRain = document.querySelector(".matrix-rain")
  if (matrixRain) {
    matrixRain.remove()
    initMatrixRain()
  }
}

window.addEventListener("resize", debounce(handleResize, 250))

// Utility function for debouncing
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Add cyber sound effects (optional)
function playCyberSound(type) {
  // Create audio context for sound effects
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()

  const sounds = {
    click: () => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1)

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    },

    hover: () => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(600, audioContext.currentTime)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.05)
    },
  }

  if (sounds[type]) {
    try {
      sounds[type]()
    } catch (error) {
      console.log("Audio context not available")
    }
  }
}

// Add sound effects to buttons
document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-cyber, .cyber-card, .test-card")) {
    playCyberSound("click")
  }
})

document.addEventListener("mouseover", (e) => {
  if (e.target.matches(".btn-cyber, .cyber-card, .test-card")) {
    playCyberSound("hover")
  }
})

// Export for use in other modules
window.CyberEffects = {
  playCyberSound,
  initMatrixRain,
  initParticleSystem,
  initGlitchEffects,
}
