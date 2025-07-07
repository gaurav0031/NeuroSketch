// Theme Toggle Functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle")
  const body = document.body

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem("theme") || "light"
  setTheme(savedTheme)

  // Theme toggle click handler
  themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme") || "light"
    const newTheme = currentTheme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    // Show notification
    if (window.showNotification) {
      window.showNotification(`Switched to ${newTheme} mode`, "info")
    }
  })

  function setTheme(theme) {
    body.setAttribute("data-theme", theme)

    // Update toggle button icons
    const sunIcon = themeToggle.querySelector(".fa-sun")
    const moonIcon = themeToggle.querySelector(".fa-moon")

    if (theme === "dark") {
      sunIcon.style.display = "inline-block"
      moonIcon.style.display = "none"
    } else {
      sunIcon.style.display = "none"
      moonIcon.style.display = "inline-block"
    }
  }
})
