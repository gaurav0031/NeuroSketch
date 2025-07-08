// Print Manager - Handles printing functionality for test results
document.addEventListener("DOMContentLoaded", () => {
  // Get the print button
  const printButton = document.getElementById("printResults")

  if (printButton) {
    printButton.addEventListener("click", preparePrintView)
  }

  // Function to prepare the print view
  function preparePrintView() {
    // Show print-only elements
    document.querySelectorAll(".print-header, .user-info, .recommendations, .verification-qr").forEach((el) => {
      el.classList.remove("d-none")
    })

    // Fill in user information from localStorage
    const userDataString = localStorage.getItem("userData")
    if (userDataString) {
      const userData = JSON.parse(userDataString)

      // Fill in user details
      document.getElementById("printName").textContent = userData.fullName || "Not provided"
      document.getElementById("printEmail").textContent = userData.email || "Not provided"
      document.getElementById("printAge").textContent = formatDate(userData.age) || "Not provided"
      document.getElementById("printGender").textContent = userData.gender || "Not provided"

      // Current date for the report
      const currentDate = new Date()
      document.getElementById("printDate").textContent = currentDate.toLocaleDateString()
      document.getElementById("reportDate").textContent =
        currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString()

      // Generate a unique report ID
      const reportId = generateReportId()
      document.getElementById("printReportId").textContent = reportId

      // Generate QR code for verification
      try {
        generateQRCode(reportId, userData.email)
      } catch (error) {
        console.error("Failed to generate QR code:", error)
        const qrcodeContainer = document.getElementById("qrcode")
        if (qrcodeContainer) {
          qrcodeContainer.innerHTML = `<p>Verification ID: ${reportId}</p>`
        }
      }
    }

    // Update recommendations based on test results
    updateRecommendations()

    // Trigger print dialog
    setTimeout(() => {
      window.print()

      // Hide print-only elements after printing
      setTimeout(() => {
        document.querySelectorAll(".print-header, .user-info, .recommendations, .verification-qr").forEach((el) => {
          el.classList.add("d-none")
        })
      }, 1000)
    }, 500)
  }

  // Format date from yyyy-mm-dd to a more readable format
  function formatDate(dateString) {
    if (!dateString) return ""

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Generate a unique report ID
  function generateReportId() {
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    return `NS-${timestamp}-${randomStr}`.toUpperCase()
  }

  // Generate QR code for verification
  function generateQRCode(reportId, email) {
    const qrcodeContainer = document.getElementById("qrcode")
    if (!qrcodeContainer) return

    // Clear previous QR code
    qrcodeContainer.innerHTML = ""

    try {
      // Check if QRCode is available globally
      if (typeof QRCode !== "undefined") {
        // Create a simpler verification string
        const verificationString = `NeuroSketch:${reportId}:${email}`

        // Generate QR code
        QRCode.toCanvas(
          qrcodeContainer,
          verificationString,
          {
            width: 128,
            margin: 1,
            errorCorrectionLevel: "M",
          },
          (error) => {
            if (error) {
              console.error("Error generating QR code:", error)
              qrcodeContainer.innerHTML = `<p>Report ID: ${reportId}</p>`
            }
          },
        )
      } else {
        console.error("QRCode library is not loaded.")
        qrcodeContainer.innerHTML = `<p>Report ID: ${reportId}</p>`
      }
    } catch (error) {
      console.error("Error in QR code generation:", error)
      qrcodeContainer.innerHTML = `<p>Report ID: ${reportId}</p>`
    }
  }

  // Fetch saved result from Firebase if available
  async function fetchSavedResult(reportId) {
    // Since Firebase imports are not working, store results locally
    try {
      const savedResultsJSON = localStorage.getItem("savedResults")
      if (savedResultsJSON) {
        const savedResults = JSON.parse(savedResultsJSON)
        const result = savedResults.find((result) => result.reportId === reportId)
        if (result) {
          console.log("Found saved result:", result)
          return result
        }
      }
      return null
    } catch (error) {
      console.error("Error fetching saved result:", error)
      return null
    }
  }

  // Update recommendations based on test results
  function updateRecommendations() {
    const recommendationsList = document.getElementById("recommendationsList")
    if (!recommendationsList) return

    // Clear existing recommendations
    recommendationsList.innerHTML = ""

    // Get overall health percentage
    const overallHealthyPercent = document.getElementById("overallHealthyPercent")
    const healthPercent = overallHealthyPercent ? Number.parseInt(overallHealthyPercent.textContent) : 0

    // Add general recommendations
    addRecommendation(recommendationsList, "Consult with a healthcare professional for a comprehensive evaluation")

    if (healthPercent >= 80) {
      // Healthy recommendations
      addRecommendation(recommendationsList, "Continue monitoring your neurological health with periodic assessments")
      addRecommendation(recommendationsList, "Maintain a healthy lifestyle with regular exercise and a balanced diet")
      addRecommendation(recommendationsList, "Stay mentally active with puzzles, reading, and learning new skills")
    } else if (healthPercent >= 60) {
      // Moderate recommendations
      addRecommendation(recommendationsList, "Schedule a follow-up assessment in 3-6 months")
      addRecommendation(
        recommendationsList,
        "Consider regular physical activity that improves coordination and balance",
      )
      addRecommendation(recommendationsList, "Maintain a healthy diet rich in antioxidants and omega-3 fatty acids")
      addRecommendation(recommendationsList, "Practice stress-reduction techniques like meditation or yoga")
    } else {
      // Concerning recommendations
      addRecommendation(recommendationsList, "Consult with a neurologist as soon as possible")
      addRecommendation(recommendationsList, "Keep a symptom diary to track any changes in your condition")
      addRecommendation(recommendationsList, "Consider physical therapy to improve motor function")
      addRecommendation(recommendationsList, "Ensure your living environment is safe and free of fall hazards")
      addRecommendation(recommendationsList, "Discuss medication options with your healthcare provider")
    }

    // Add test-specific recommendations
    addTestSpecificRecommendations(recommendationsList)
  }

  // Add a recommendation to the list
  function addRecommendation(list, text) {
    const li = document.createElement("li")
    li.textContent = text
    list.appendChild(li)
  }

  // Add test-specific recommendations
  function addTestSpecificRecommendations(list) {
    // Check spiral test results
    const spiralStatus = document.getElementById("spiralStatusResult")
    if (spiralStatus && spiralStatus.textContent === "Not Healthy") {
      addRecommendation(list, "Practice fine motor control exercises like drawing, writing, or playing an instrument")
    }

    // Check tap test results
    const tapStatus = document.getElementById("tapStatusResult")
    if (tapStatus && tapStatus.textContent === "Not Healthy") {
      addRecommendation(list, "Practice finger tapping exercises to improve coordination and speed")
    }

    // Check reaction test results
    const reactionStatus = document.getElementById("reactionStatusResult")
    if (reactionStatus && reactionStatus.textContent === "Not Healthy") {
      addRecommendation(list, "Engage in activities that improve reaction time, such as video games or sports")
    }

    // Check voice test results
    const voiceStatus = document.getElementById("voiceStatusResult")
    if (voiceStatus && voiceStatus.textContent === "Not Healthy") {
      addRecommendation(list, "Consider speech therapy to improve voice control and strength")
      addRecommendation(list, "Practice vocal exercises daily to maintain voice quality")
    }
  }
})
