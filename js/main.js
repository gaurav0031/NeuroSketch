// Global variables to store user data and test results
const currentUser = null
const userData = null
const testResults = {
  spiral: { status: "Not Tested", healthy: 0, parkinsons: 0, rawScore: 0 },
  tap: { status: "Not Tested", healthy: 0, parkinsons: 0, rawScore: 0 },
  reaction: { status: "Not Tested", healthy: 0, parkinsons: 0, rawScore: 0 },
  voice: { status: "Not Tested", healthy: 0, parkinsons: 0, rawScore: 0 },
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  console.log("NeuroSketch application initialized")

  // Initialize Firebase if available
  initializeFirebase()

  // Initialize UI enhancements
  initializeUIEnhancements()

  // Initialize test functionality
  initializeTests()

  // Setup navigation and form handling
  setupNavigation()
  setupForms()

  // Check URL parameters for direct test access
  checkDirectTestAccess()
})

// Initialize Firebase
function initializeFirebase() {
  // Check if Firebase is already initialized
  if (typeof firebase !== "undefined") {
    console.log("Firebase is available")

    // Store Firebase services in window object for global access
    window.db = firebase.firestore()
    window.auth = firebase.auth()

    // Set up authentication state observer
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User is signed in:", user.uid)
        window.currentUser = user
      } else {
        console.log("No user is signed in")
        window.currentUser = null
      }
    })
  } else {
    console.warn("Firebase is not available. Using local storage fallback.")

    // Create a warning notification
    createNotification(
      "Warning: Running in offline mode. Data will be saved locally but not to the cloud database.",
      "warning",
    )

    // Create a mock Firebase object for fallback
    window.firebase = {
      isOfflineMode: true,
    }
  }
}

// Initialize UI enhancements
function initializeUIEnhancements() {
  // Add floating elements to animated backgrounds
  document.querySelectorAll(".animated-bg").forEach((bg) => {
    for (let i = 1; i <= 4; i++) {
      const floatElement = document.createElement("div")
      floatElement.className = `float-element float-${i}`
      bg.appendChild(floatElement)
    }
  })

  // Add scroll effects to navbar
  const navbar = document.querySelector(".navbar")
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }
    })
  }

  // Add hover effects to buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-2px)"
    })

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0)"
    })
  })

  // Add animation to progress bars
  document.querySelectorAll(".progress-bar").forEach((bar) => {
    bar.style.width = "0%"
    setTimeout(() => {
      bar.style.width = bar.getAttribute("aria-valuenow") + "%"
    }, 500)
  })
}

// Initialize test functionality
function initializeTests() {
  // Initialize all test modules
  if (typeof initializeSpiralTest === "function") initializeSpiralTest()
  if (typeof initializeTapTest === "function") initializeTapTest()
  if (typeof initializeReactionTest === "function") initializeReactionTest()
  if (typeof initializeVoiceTest === "function") initializeVoiceTest()

  // Setup test buttons
  setupTestButtons()

  // Setup results view button
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

  // Setup print results button
  const printResultsBtn = document.getElementById("printResults")
  if (printResultsBtn) {
    printResultsBtn.addEventListener("click", () => {
      // Declare preparePrintView before using it
      const preparePrintView = window.preparePrintView
      if (typeof preparePrintView === "function") {
        preparePrintView()
      } else {
        window.print()
      }
    })
  }
}

// Setup navigation
function setupNavigation() {
  // Handle navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        // Hide all sections
        document.querySelectorAll("section").forEach((section) => {
          section.classList.add("d-none")
        })

        // Show target section
        targetElement.classList.remove("d-none")
        targetElement.scrollIntoView({ behavior: "smooth" })

        // Update active nav link
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("active")
        })
        this.classList.add("active")
      }
    })
  })

  // Handle hash change
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.substring(1)
    if (hash) {
      const section = document.getElementById(hash)
      if (section) {
        // Hide all sections
        document.querySelectorAll("section").forEach((s) => {
          s.classList.add("d-none")
        })
        // Show target section
        section.classList.remove("d-none")
        section.scrollIntoView({ behavior: "smooth" })
      }
    }
  })

  // Check initial hash
  if (window.location.hash) {
    const hash = window.location.hash.substring(1)
    const section = document.getElementById(hash)
    if (section) {
      // Hide all sections
      document.querySelectorAll("section").forEach((s) => {
        s.classList.add("d-none")
      })
      // Show target section
      section.classList.remove("d-none")
      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }
}

// Setup forms
function setupForms() {
  // Get registration form
  const registrationForm = document.getElementById("registrationForm")

  if (registrationForm) {
    registrationForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Validate form
      if (!validateForm(this)) {
        return false
      }

      // Show loading state
      const submitBtn = this.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn ? submitBtn.innerHTML : "SUBMIT"
      if (submitBtn) {
        submitBtn.innerHTML =
          '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...'
        submitBtn.disabled = true
      }

      // Get form data
      const formData = new FormData(this)
      const userData = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        age: formData.get("age"),
        gender: formData.get("gender"),
        familyHistory: formData.get("familyHistory"),
        medicalSituation: formData.get("medicalSituation"),
        createdAt: new Date().toISOString(),
      }

      // Store user data in localStorage
      localStorage.setItem("userData", JSON.stringify(userData))

      // Show success message
      createNotification("Registration successful! Redirecting to tests...", "success")

      // Transition to tests section
      setTimeout(() => {
        hideSection("register")
        showSection("tests")

        // Reset button state
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnText
          submitBtn.disabled = false
        }
      }, 1500)
    })
  }
}

// Validate form
function validateForm(form) {
  let isValid = true

  // Check required fields
  form.querySelectorAll("[required]").forEach((field) => {
    if (!field.value.trim()) {
      isValid = false
      field.classList.add("is-invalid")

      // Create error message if it doesn't exist
      if (!field.nextElementSibling || !field.nextElementSibling.classList.contains("invalid-feedback")) {
        const feedback = document.createElement("div")
        feedback.className = "invalid-feedback"
        feedback.textContent = "This field is required"
        field.parentNode.insertBefore(feedback, field.nextSibling)
      }
    } else {
      field.classList.remove("is-invalid")
      field.classList.add("is-valid")

      // Remove error message if it exists
      if (field.nextElementSibling && field.nextElementSibling.classList.contains("invalid-feedback")) {
        field.nextElementSibling.remove()
      }
    }
  })

  // Check email format
  const emailField = form.querySelector('input[type="email"]')
  if (emailField && emailField.value.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailField.value.trim())) {
      isValid = false
      emailField.classList.add("is-invalid")

      // Create error message if it doesn't exist
      if (!emailField.nextElementSibling || !emailField.nextElementSibling.classList.contains("invalid-feedback")) {
        const feedback = document.createElement("div")
        feedback.className = "invalid-feedback"
        feedback.textContent = "Please enter a valid email address"
        emailField.parentNode.insertBefore(feedback, emailField.nextSibling)
      }
    }
  }

  return isValid
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

  // Setup modal close buttons
  setupModalCloseButtons()
}

// Show modal
function showModal(modalId) {
  const modal = document.getElementById(modalId)
  if (!modal) {
    console.error(`Modal not found: ${modalId}`)
    return
  }

  // Remove any existing backdrops
  document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
    backdrop.remove()
  })

  // Add backdrop
  const backdrop = document.createElement("div")
  backdrop.className = "modal-backdrop fade show"
  document.body.appendChild(backdrop)

  // Show modal
  modal.classList.add("show")
  modal.style.display = "block"
  document.body.classList.add("modal-open")

  // Prevent Bootstrap from handling this modal
  modal.setAttribute("data-handled", "true")
}

// Hide modal
function hideModal(modalId) {
  const modal = document.getElementById(modalId)
  if (!modal) {
    console.error(`Modal not found: ${modalId}`)
    return
  }

  // Hide modal
  modal.classList.remove("show")
  modal.style.display = "none"
  document.body.classList.remove("modal-open")

  // Remove backdrop
  const backdrop = document.querySelector(".modal-backdrop")
  if (backdrop) {
    backdrop.remove()
  }
}

// Setup modal close buttons
function setupModalCloseButtons() {
  const closeButtons = document.querySelectorAll('.modal .btn-close, .modal [data-bs-dismiss="modal"]')
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

    // Add entrance animation
    section.classList.add("fade-in")
    setTimeout(() => {
      section.classList.remove("fade-in")
    }, 1000)
  }
}

// Hide section
function hideSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    // Add exit animation
    section.classList.add("fade-out")
    setTimeout(() => {
      section.classList.add("d-none")
      section.style.display = "none"
      section.classList.remove("fade-out")
    }, 300)
  }
}

// Show results
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
  const testResults = window.testResults || {}
  const completedTests = Object.values(testResults).filter((test) => test.status !== "Not Tested").length

  // Hide tests section and show results with animation
  hideSection("tests")
  showSection("results")

  if (completedTests === 0) {
    // No tests completed
    updateOverallResults({
      healthyPercent: 50,
      parkinsonsPercent: 50,
      title: "Assessment Incomplete",
      text: "Please complete at least one test to get a comprehensive assessment.",
      status: "neutral",
    })
  } else {
    // Calculate average scores
    let totalHealthy = 0
    let totalParkinsons = 0

    Object.values(testResults).forEach((test) => {
      if (test.status !== "Not Tested") {
        totalHealthy += test.healthy
        totalParkinsons += test.parkinsons
      }
    })

    const avgHealthy = Math.round(totalHealthy / completedTests)
    const avgParkinsons = Math.round(totalParkinsons / completedTests)

    // Determine overall status and message
    let title, text, status

    if (avgHealthy >= 80) {
      title = "Likely Healthy"
      text =
        "Based on your test results, you are likely not showing signs of Parkinson's disease. Your motor control, reaction time, and coordination appear to be within normal ranges. However, this is not a medical diagnosis. If you have concerns, please consult a healthcare professional."
      status = "healthy"
    } else if (avgHealthy >= 60) {
      title = "Mostly Healthy"
      text =
        "Based on your test results, you are showing mostly normal motor function with some minor variations. While these results don't necessarily indicate Parkinson's disease, we recommend monitoring your symptoms and consulting with a healthcare professional for a thorough evaluation."
      status = "healthy"
    } else if (avgHealthy >= 40) {
      title = "Potential Early Signs"
      text =
        "Your test results show some patterns that may be associated with early motor changes. These could be related to various factors, including but not limited to Parkinson's disease. We strongly recommend consulting a neurologist for proper evaluation and diagnosis."
      status = "not-healthy"
    } else {
      title = "Significant Risk Detected"
      text =
        "Your test results indicate significant motor function changes that are commonly associated with Parkinson's disease. Please consult with a neurologist as soon as possible for a comprehensive evaluation. Early diagnosis and treatment can significantly improve quality of life."
      status = "not-healthy"
    }

    // Update UI with results
    updateOverallResults({
      healthyPercent: avgHealthy,
      parkinsonsPercent: avgParkinsons,
      title: title,
      text: text,
      status: status,
    })
  }
}

// Update overall results
function updateOverallResults(results) {
  const { healthyPercent, parkinsonsPercent, title, text, status } = results

  // Update progress bars
  const overallHealthyBar = document.getElementById("overallHealthyBar")
  const overallParkinsonBar = document.getElementById("overallParkinsonBar")
  const overallHealthyPercent = document.getElementById("overallHealthyPercent")
  const overallParkinsonPercent = document.getElementById("overallParkinsonPercent")

  // Set initial width to 0 to enable animation
  if (overallHealthyBar) {
    overallHealthyBar.style.width = "0%"
    overallHealthyBar.setAttribute("aria-valuenow", healthyPercent)
  }

  if (overallParkinsonBar) {
    overallParkinsonBar.style.width = "0%"
    overallParkinsonBar.setAttribute("aria-valuenow", parkinsonsPercent)
  }

  // Set text
  if (overallHealthyPercent) overallHealthyPercent.textContent = healthyPercent
  if (overallParkinsonPercent) overallParkinsonPercent.textContent = parkinsonsPercent

  // Animate bars after a short delay
  setTimeout(() => {
    if (overallHealthyBar) overallHealthyBar.style.width = `${healthyPercent}%`
    if (overallParkinsonBar) overallParkinsonBar.style.width = `${parkinsonsPercent}%`

    // Update conclusion box
    const conclusionBox = document.getElementById("conclusionBox")
    const conclusionTitle = document.getElementById("conclusionTitle")
    const conclusionText = document.getElementById("conclusionText")

    if (conclusionBox) conclusionBox.className = `conclusion mt-4 p-3 rounded ${status}`
    if (conclusionTitle) conclusionTitle.textContent = title
    if (conclusionText) conclusionText.textContent = text

    // Add animation to conclusion box
    if (conclusionBox) {
      conclusionBox.classList.add("shake")
      setTimeout(() => {
        conclusionBox.classList.remove("shake")
      }, 1000)
    }
  }, 500)
}

// Update results table
function updateResultsTable() {
  const testResults = window.testResults || {}

  // Update each test row
  updateResultTableRow("spiral", testResults.spiral)
  updateResultTableRow("tap", testResults.tap)
  updateResultTableRow("reaction", testResults.reaction)
  updateResultTableRow("voice", testResults.voice)
}

// Update individual result table row
function updateResultTableRow(testName, testResult = {}) {
  const status = testResult.status || "Not Tested"
  const healthy = testResult.healthy || 0
  const parkinsons = testResult.parkinsons || 0
  const rawScore = testResult.rawScore || 0

  // Get table cells
  const statusCell = document.getElementById(`${testName}StatusResult`)
  const healthyCell = document.getElementById(`${testName}HealthyResult`)
  const parkinsonsCell = document.getElementById(`${testName}ParkinsonResult`)
  const rawScoreCell = document.getElementById(`${testName}RawResult`)

  // Update cells
  if (statusCell) statusCell.textContent = status
  if (healthyCell) healthyCell.textContent = `${healthy}%`
  if (parkinsonsCell) parkinsonsCell.textContent = `${parkinsons}%`

  // Format raw score based on test type
  if (rawScoreCell) {
    if (testName === "reaction") {
      // For reaction test, show milliseconds
      rawScoreCell.textContent = `${Math.round(rawScore)} ms`
    } else if (rawScore) {
      // For other tests, show score out of 100
      rawScoreCell.textContent = `${Math.round(rawScore)}/100`
    } else {
      rawScoreCell.textContent = "-"
    }
  }
}

// Save results
async function saveResults() {
  // Get user data from localStorage
  const userDataString = localStorage.getItem("userData")
  if (!userDataString) {
    createNotification("User data not found. Please complete the registration form first.", "error")
    return
  }

  const userData = JSON.parse(userDataString)
  const testResults = window.testResults || {}

  try {
    // Show loading indicator
    const saveResultsBtn = document.getElementById("saveResults")
    if (saveResultsBtn) {
      saveResultsBtn.innerHTML =
        '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Saving...'
      saveResultsBtn.disabled = true
    }

    let result

    // Check if Firebase is available
    if (typeof firebase !== "undefined" && !firebase.isOfflineMode && typeof window.db !== "undefined") {
      // Save to Firebase
      result = await saveToFirebase(userData, testResults)
    } else {
      // Save to localStorage
      result = saveToLocalStorage(userData, testResults)
    }

    // Reset button
    if (saveResultsBtn) {
      saveResultsBtn.innerHTML = "Save Results"
      saveResultsBtn.disabled = false
    }

    if (result.success) {
      createNotification(`Results saved successfully! Report ID: ${result.id}`, "success")
    } else {
      createNotification("Error saving results. Please try again.", "error")
    }
  } catch (error) {
    console.error("Error saving results:", error)

    // Fallback to localStorage
    const result = saveToLocalStorage(userData, testResults)

    // Reset button
    const saveResultsBtn = document.getElementById("saveResults")
    if (saveResultsBtn) {
      saveResultsBtn.innerHTML = "Save Results"
      saveResultsBtn.disabled = false
    }

    createNotification("Error occurred. Results saved to local storage as a backup.", "warning")
  }
}

// Save to Firebase
async function saveToFirebase(userData, testResults) {
  try {
    // Generate a unique report ID
    const reportId = generateReportId()

    // Create data object
    const data = {
      // User information
      fullName: userData.fullName || "",
      email: userData.email || "",
      age: userData.age || "",
      gender: userData.gender || "",
      familyHistory: userData.familyHistory || "",
      medicalSituation: userData.medicalSituation || "",

      // Test results
      testResults: {
        spiral: testResults.spiral || { status: "Not Tested", healthy: 0, parkinsons: 0, rawScore: 0 },
        tap: testResults.tap || { status: "Not Tested", healthy: 0, parkinsons: 0, rawScore: 0 },
        reaction: testResults.reaction || { status: "Not Tested", healthy: 0, parkinsons: 0, rawScore: 0 },
        voice: testResults.voice || { status: "Not Tested", healthy: 0, parkinsons: 0, rawScore: 0 },
      },

      // Overall assessment
      overallHealthy: calculateOverallScore(testResults, "healthy"),
      overallParkinsons: calculateOverallScore(testResults, "parkinsons"),

      // Timestamps
      timestamp: new Date().toISOString(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      reportId: reportId,
    }

    // Save to Firestore
    const docRef = await window.db.collection("testResults").add(data)
    console.log("Results saved with ID:", docRef.id)

    return { success: true, id: reportId }
  } catch (error) {
    console.error("Error saving to Firebase:", error)
    return { success: false, error }
  }
}

// Save to localStorage
function saveToLocalStorage(userData, testResults) {
  // Generate a unique report ID
  const reportId = generateReportId()

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

// Calculate overall score
function calculateOverallScore(testResults, scoreType) {
  let totalScore = 0
  let testsCompleted = 0

  // Check each test
  Object.values(testResults).forEach((test) => {
    if (test && test.status !== "Not Tested") {
      totalScore += test[scoreType] || 0
      testsCompleted++
    }
  })

  // Return average or 0 if no tests completed
  return testsCompleted > 0 ? Math.round(totalScore / testsCompleted) : 0
}

// Generate a unique report ID
function generateReportId() {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `NS-${timestamp}-${randomStr}`.toUpperCase()
}

// Create notification
function createNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `alert alert-${type} alert-dismissible fade show notification`
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `

  // Add styles
  notification.style.position = "fixed"
  notification.style.top = "20px"
  notification.style.right = "20px"
  notification.style.zIndex = "9999"
  notification.style.maxWidth = "400px"
  notification.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)"
  notification.style.borderRadius = "8px"

  // Add to document
  document.body.appendChild(notification)

  // Add animation
  notification.style.animation = "fadeInRight 0.5s forwards"

  // Add animation keyframes if they don't exist
  if (!document.getElementById("notification-styles")) {
    const style = document.createElement("style")
    style.id = "notification-styles"
    style.innerHTML = `
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(50px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes fadeOutRight {
        from {
          opacity: 1;
          transform: translateX(0);
        }
        to {
          opacity: 0;
          transform: translateX(50px);
        }
      }
    `
    document.head.appendChild(style)
  }

  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    notification.style.animation = "fadeOutRight 0.5s forwards"
    setTimeout(() => {
      notification.remove()
    }, 500)
  }, 5000)

  // Add click event to close button
  const closeButton = notification.querySelector(".btn-close")
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      notification.style.animation = "fadeOutRight 0.5s forwards"
      setTimeout(() => {
        notification.remove()
      }, 500)
    })
  }
}

// Check for direct test access
function checkDirectTestAccess() {
  const urlParams = new URLSearchParams(window.location.search)
  const directAccess = urlParams.get("direct-test-access")

  if (directAccess === "true") {
    console.log("Direct test access enabled")

    // Wait a moment for the page to fully load
    setTimeout(() => {
      hideSection("register")
      showSection("tests")
    }, 500)
  }
}
