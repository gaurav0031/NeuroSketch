// Print Manager - Handles printing functionality for test results
document.addEventListener("DOMContentLoaded", () => {
  // Setup print button handlers
  setupPrintHandlers()

  // Setup print styles
  setupPrintStyles()
})

function setupPrintHandlers() {
  // Print results button
  const printResultsBtn = document.getElementById("printResults")
  if (printResultsBtn) {
    printResultsBtn.addEventListener("click", () => {
      preparePrintData()
      window.print()
    })
  }

  // Handle print events
  window.addEventListener("beforeprint", () => {
    preparePrintData()
    showPrintElements()
  })

  window.addEventListener("afterprint", () => {
    hidePrintElements()
  })
}

function preparePrintData() {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}")
  const timestamp = new Date().toLocaleString()
  const reportId = `NS-${Date.now().toString(36)}`.toUpperCase()

  // Update print elements
  document.getElementById("reportDate").textContent = timestamp
  document.getElementById("printName").textContent = userData.fullName || "N/A"
  document.getElementById("printEmail").textContent = userData.email || "N/A"
  document.getElementById("printAge").textContent = userData.age || "N/A"
  document.getElementById("printGender").textContent = userData.gender || "N/A"
  document.getElementById("printReportId").textContent = reportId

  // Generate QR code for verification
  if (window.QRCode && document.getElementById("qrcode")) {
    document.getElementById("qrcode").innerHTML = ""
    new window.QRCode(document.getElementById("qrcode"), {
      text: `https://neurosketch.com/verify/${reportId}`,
      width: 100,
      height: 100,
    })
  }

  // Update recommendations based on results
  updateRecommendations()
}

function updateRecommendations() {
  const completedTests = Object.values(window.testResults || {}).filter((test) => test.completed)
  const avgScore =
    completedTests.length > 0 ? completedTests.reduce((sum, test) => sum + test.score, 0) / completedTests.length : 0

  const recommendationsList = document.getElementById("recommendationsList")
  if (recommendationsList) {
    let recommendations = []

    if (avgScore >= 80) {
      recommendations = [
        "Continue regular health monitoring and annual check-ups",
        "Maintain an active lifestyle with regular exercise",
        "Follow a balanced diet rich in antioxidants",
        "Consider annual neurological screening if family history exists",
      ]
    } else if (avgScore >= 60) {
      recommendations = [
        "Schedule a consultation with a neurologist for further evaluation",
        "Consider more frequent health monitoring",
        "Discuss results with your primary care physician",
        "Maintain detailed symptom tracking if any symptoms are present",
      ]
    } else {
      recommendations = [
        "Urgent consultation with a neurologist is recommended",
        "Comprehensive neurological evaluation should be scheduled",
        "Discuss immediate treatment options with healthcare providers",
        "Consider seeking a second opinion from a movement disorder specialist",
      ]
    }

    recommendationsList.innerHTML = recommendations.map((rec) => `<li>${rec}</li>`).join("")
  }
}

function showPrintElements() {
  // Show elements that should only appear in print
  document
    .querySelectorAll(".print-header, .print-date, .user-info, .recommendations, .verification-qr")
    .forEach((element) => {
      element.classList.remove("d-none")
    })

  // Hide elements that shouldn't appear in print
  document.querySelectorAll(".btn, .navbar, .notification, .modal").forEach((element) => {
    element.style.display = "none"
  })
}

function hidePrintElements() {
  // Hide print-only elements
  document
    .querySelectorAll(".print-header, .print-date, .user-info, .recommendations, .verification-qr")
    .forEach((element) => {
      element.classList.add("d-none")
    })

  // Show normal elements
  document.querySelectorAll(".btn, .navbar").forEach((element) => {
    element.style.display = ""
  })
}

function setupPrintStyles() {
  // Add print-specific styles if not already present
  if (!document.getElementById("printStyles")) {
    const printStyles = document.createElement("style")
    printStyles.id = "printStyles"
    printStyles.textContent = `
      @media print {
        .no-print { display: none !important; }
        .print-only { display: block !important; }
        
        body { 
          font-size: 12pt; 
          line-height: 1.4;
          color: black !important;
          background: white !important;
        }
        
        .container { max-width: none !important; }
        .card { border: 1px solid #000 !important; }
        .progress-bar { background-color: #000 !important; }
        
        h1, h2, h3, h4, h5, h6 { 
          color: black !important;
          page-break-after: avoid;
        }
        
        .page-break { page-break-before: always; }
        
        table { 
          border-collapse: collapse;
          width: 100%;
        }
        
        th, td {
          border: 1px solid #000;
          padding: 8px;
          text-align: left;
        }
        
        .conclusion {
          border: 2px solid #000 !important;
          padding: 15px !important;
          margin: 20px 0 !important;
        }
      }
    `
    document.head.appendChild(printStyles)
  }
}

// Export functions
window.printManager = {
  preparePrintData,
  showPrintElements,
  hidePrintElements,
}
