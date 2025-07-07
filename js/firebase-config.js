// Firebase Configuration and Database Functions
console.log("Firebase config loaded")

// Initialize Firebase (already done in HTML)
const db = window.db
const auth = window.auth

// Save results to Firebase
async function saveResultsToFirebase(userData, testResults) {
  try {
    // Generate unique document ID
    const timestamp = Date.now().toString(36)
    const randomStr = Math.random().toString(36).substring(2, 8)
    const reportId = `NS-${timestamp}-${randomStr}`.toUpperCase()

    // Prepare data for Firebase
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

      // Additional metadata
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }

    // Save to Firestore
    await db.collection("assessmentResults").doc(reportId).set(resultsData)

    console.log("Results saved to Firebase with ID:", reportId)
    return { success: true, id: reportId }
  } catch (error) {
    console.error("Error saving to Firebase:", error)
    return { success: false, error: error.message }
  }
}

// Helper function to calculate overall score
function calculateOverallScore(testResults, scoreType) {
  let totalScore = 0
  let testsCompleted = 0

  // Check each test
  Object.values(testResults).forEach((test) => {
    if (test.completed) {
      totalScore += test.score
      testsCompleted++
    }
  })

  // Return average or 0 if no tests completed
  return testsCompleted > 0 ? Math.round(totalScore / testsCompleted) : 0
}

// Get user results from Firebase
async function getUserResults(email) {
  try {
    const snapshot = await db
      .collection("assessmentResults")
      .where("email", "==", email)
      .orderBy("timestamp", "desc")
      .get()

    const results = []
    snapshot.forEach((doc) => {
      results.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return { success: true, results: results }
  } catch (error) {
    console.error("Error getting user results:", error)
    return { success: false, error: error.message }
  }
}

// Export functions
window.saveResultsToFirebase = saveResultsToFirebase
window.getUserResults = getUserResults
