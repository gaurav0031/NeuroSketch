// Dark/Light Mode Toggle Implementation
document.addEventListener("DOMContentLoaded", () => {
  console.log("Theme Toggle loaded")

  // Initialize theme
  function initializeTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme") || "light"
    document.documentElement.setAttribute("data-theme", savedTheme)

    console.log("Theme initialized:", savedTheme)
  }

  // Create theme toggle button
  function createThemeToggle() {
    const navbar = document.querySelector(".navbar-nav")
    if (navbar) {
      const themeToggleItem = document.createElement("li")
      themeToggleItem.className = "nav-item"
      themeToggleItem.innerHTML = `
        <button class="theme-toggle ms-2" id="themeToggle" title="Toggle Dark/Light Mode">
          <i class="fas fa-sun"></i>
          <i class="fas fa-moon"></i>
        </button>
      `

      // Insert before the last item (voice control button if it exists)
      const lastItem = navbar.lastElementChild
      navbar.insertBefore(themeToggleItem, lastItem)

      // Add click handler
      const toggleButton = document.getElementById("themeToggle")
      toggleButton.addEventListener("click", toggleTheme)

      console.log("Theme toggle button created")
    }
  }

  // Toggle theme function
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    // Apply new theme
    document.documentElement.setAttribute("data-theme", newTheme)

    // Save preference
    localStorage.setItem("theme", newTheme)

    // Add transition effect
    document.body.style.transition = "background-color 0.3s ease, color 0.3s ease"

    // Remove transition after animation
    setTimeout(() => {
      document.body.style.transition = ""
    }, 300)

    console.log("Theme toggled to:", newTheme)

    // Show notification
    showThemeNotification(newTheme)
  }

  // Show theme change notification
  function showThemeNotification(theme) {
    const notification = document.createElement("div")
    notification.className = "theme-notification"
    notification.innerHTML = `
      <i class="fas fa-${theme === "dark" ? "moon" : "sun"} me-2"></i>
      ${theme === "dark" ? "Dark" : "Light"} mode activated
    `

    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      background: var(--bg-primary);
      color: var(--text-primary);
      padding: 12px 24px;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow-heavy);
      border: 1px solid var(--border-color);
      animation: themeNotificationSlide 0.3s ease;
      font-weight: 600;
    `

    // Add to document
    document.body.appendChild(notification)

    // Auto-dismiss after 2 seconds
    setTimeout(() => {
      notification.style.animation = "themeNotificationSlide 0.3s ease reverse"
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 2000)
  }

  // Add CSS for theme notification animation
  const style = document.createElement("style")
  style.textContent = `
    @keyframes themeNotificationSlide {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  `
  document.head.appendChild(style)

  // Initialize theme on load
  initializeTheme()

  // Create toggle button after a short delay
  setTimeout(createThemeToggle, 100)

  // Make toggle function available globally
  window.toggleTheme = toggleTheme

  console.log("Theme toggle system initialized")
})
