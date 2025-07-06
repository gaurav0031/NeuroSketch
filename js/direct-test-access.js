// This file provides a direct way to access the tests without Firebase authentication
// For development and testing purposes only

document.addEventListener("DOMContentLoaded", () => {
  // Check if URL has a special parameter
  const urlParams = new URLSearchParams(window.location.search)
  const directAccess = urlParams.get("direct-test-access")

  if (directAccess === "true") {
    console.log("Direct test access enabled")

    // Wait a moment for the page to fully load
    setTimeout(() => {
      const registerSection = document.getElementById("register")
      const testsSection = document.getElementById("tests")

      if (registerSection && testsSection) {
        console.log("Showing tests section directly")
        registerSection.classList.add("d-none")
        testsSection.classList.remove("d-none")
        testsSection.scrollIntoView({ behavior: "smooth" })
      } else {
        console.error("Could not find register or tests section")
      }
    }, 500)
  }
})

