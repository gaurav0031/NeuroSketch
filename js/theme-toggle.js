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
      // Switch to light mode
      body.setAttribute("data-theme", "light")
      icon.className = "fas fa-moon"
      localStorage.setItem("theme", "light")
    } else {
      // Switch to dark mode
      body.setAttribute("data-theme", "dark")
      icon.className = "fas fa-sun"
      localStorage.setItem("theme", "dark")
    }
  })
})

// CSS variables for theme switching
const themeStyles = `
    :root {
        --bg-primary: #ffffff;
        --bg-secondary: #f8f9fa;
        --text-primary: #212529;
        --text-secondary: #6c757d;
        --border-color: #dee2e6;
        --royal-blue: #1e3a8a;
        --royal-purple: #7c3aed;
        --royal-gold: #f59e0b;
        --medical-green: #10b981;
        --medical-red: #ef4444;
    }
    
    [data-theme="dark"] {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --text-primary: #ffffff;
        --text-secondary: #cccccc;
        --border-color: #404040;
        --royal-blue: #3b82f6;
        --royal-purple: #8b5cf6;
        --royal-gold: #fbbf24;
        --medical-green: #34d399;
        --medical-red: #f87171;
    }
    
    [data-theme="dark"] body {
        background-color: var(--bg-primary);
        color: var(--text-primary);
    }
    
    [data-theme="dark"] .navbar {
        background-color: var(--bg-secondary) !important;
        border-bottom: 1px solid var(--border-color);
    }
    
    [data-theme="dark"] .navbar-brand,
    [data-theme="dark"] .nav-link {
        color: var(--text-primary) !important;
    }
    
    [data-theme="dark"] .card,
    [data-theme="dark"] .test-card {
        background-color: var(--bg-secondary);
        border-color: var(--border-color);
        color: var(--text-primary);
    }
    
    [data-theme="dark"] .modal-content {
        background-color: var(--bg-secondary);
        color: var(--text-primary);
    }
    
    [data-theme="dark"] .form-control {
        background-color: var(--bg-primary);
        border-color: var(--border-color);
        color: var(--text-primary);
    }
    
    [data-theme="dark"] .form-control:focus {
        background-color: var(--bg-primary);
        border-color: var(--royal-blue);
        color: var(--text-primary);
    }
    
    [data-theme="dark"] .bg-light {
        background-color: var(--bg-secondary) !important;
    }
`

// Inject theme styles
const styleSheet = document.createElement("style")
styleSheet.textContent = themeStyles
document.head.appendChild(styleSheet)

// Function to show notification
function showNotification(message, type) {
  // Implementation of showNotification function
  console.log(`Notification: ${message} (Type: ${type})`)
}
