// Theme Toggle Functionality
document.addEventListener("DOMContentLoaded", () => {
  console.log("Theme toggle initialized")

  const themeToggle = document.getElementById("themeToggle")
  const themeIcon = themeToggle?.querySelector("i")

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem("theme") || "light"
  applyTheme(savedTheme)

  // Theme toggle event listener
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "light"
      const newTheme = currentTheme === "light" ? "dark" : "light"

      applyTheme(newTheme)
      localStorage.setItem("theme", newTheme)

      // Show notification
      if (window.showNotification) {
        window.showNotification(`Switched to ${newTheme} mode`, "info")
      }
    })
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)

    if (themeIcon) {
      if (theme === "dark") {
        themeIcon.className = "fas fa-sun"
      } else {
        themeIcon.className = "fas fa-moon"
      }
    }

    console.log(`Applied ${theme} theme`)
  }
})
