// Theme Toggle Functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle")
  const body = document.body
  const icon = themeToggle.querySelector("i")

  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem("theme") || "light"

  // Apply the current theme
  if (currentTheme === "dark") {
    body.setAttribute("data-theme", "dark")
    icon.className = "fas fa-sun"
  } else {
    body.setAttribute("data-theme", "light")
    icon.className = "fas fa-moon"
  }

  // Theme toggle event listener
  themeToggle.addEventListener("click", () => {
    const currentTheme = body.getAttribute("data-theme")

    if (currentTheme === "dark") {
      body.setAttribute("data-theme", "light")
      icon.className = "fas fa-moon"
      localStorage.setItem("theme", "light")
      showThemeNotification("Switched to Light Mode", "info")
    } else {
      body.setAttribute("data-theme", "dark")
      icon.className = "fas fa-sun"
      localStorage.setItem("theme", "dark")
      showThemeNotification("Switched to Dark Mode", "info")
    }
  })

  function showThemeNotification(message, type) {
    // Create a simple notification for theme changes
    const notification = document.createElement("div")
    notification.className = `alert alert-${type} position-fixed`
    notification.style.cssText =
      "top: 20px; left: 50%; transform: translateX(-50%); z-index: 9999; min-width: 200px; text-align: center;"
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 2000)
  }
})

// Voice command integration for theme switching
window.toggleTheme = () => {
  document.getElementById("themeToggle").click()
}

window.setDarkMode = () => {
  const body = document.body
  const icon = document.querySelector("#themeToggle i")

  body.setAttribute("data-theme", "dark")
  icon.className = "fas fa-sun"
  localStorage.setItem("theme", "dark")

  if (window.showNotification) {
    window.showNotification("Dark mode activated", "info")
  }
}

window.setLightMode = () => {
  const body = document.body
  const icon = document.querySelector("#themeToggle i")

  body.setAttribute("data-theme", "light")
  icon.className = "fas fa-moon"
  localStorage.setItem("theme", "light")

  if (window.showNotification) {
    window.showNotification("Light mode activated", "info")
  }
}
