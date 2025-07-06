// Import the functions you need from Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js"
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js"

// Firebase configuration with the provided details
const firebaseConfig = {
  apiKey: "AIzaSyAuwZCQy9f5iS8WxtWjOfOOSAZU1eEtvOs",
  authDomain: "neurosketch-b1011.firebaseapp.com",
  projectId: "neurosketch-b1011",
  storageBucket: "neurosketch-b1011.firebasestorage.app",
  messagingSenderId: "460372908007",
  appId: "1:460372908007:web:fd4dd388b2f5633a108f42",
  measurementId: "G-TEX9628980",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

// Firebase helper functions
// Save results to Firestore
async function saveResultsToFirebase(userData, testResults) {
  try {
    // Create a timestamp
    const timestamp = new Date().toISOString()
    const serverTime = serverTimestamp()

    // Combine user data and test results
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
      timestamp: timestamp,
      createdAt: serverTime,
      reportId: generateReportId(),
    }

    // Save to Firestore
    const docRef = await addDoc(collection(db, "testResults"), data)
    console.log("Results saved with ID: ", docRef.id)
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error saving results to Firebase:", error)
    return { success: false, error }
  }
}

// Calculate overall score from test results
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

// Generate a unique report ID
function generateReportId() {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  return `NS-${timestamp}-${randomStr}`.toUpperCase()
}

// Get results from Firestore by user email
async function getResultsByEmail(email) {
  try {
    const snapshot = await getDocs(query(collection(db, "testResults"), where("email", "==", email)))

    const results = []
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() })
    })

    return results
  } catch (error) {
    console.error("Error getting results:", error)
    return []
  }
}

// Get a specific test result by ID
async function getResultById(resultId) {
  try {
    const docRef = doc(db, "testResults", resultId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      console.log("No such document!")
      return null
    }
  } catch (error) {
    console.error("Error getting result:", error)
    return null
  }
}

// Export everything we need
export {
  app,
  auth,
  db,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  saveResultsToFirebase,
  getResultsByEmail,
  getResultById,
}

