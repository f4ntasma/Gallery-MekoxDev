// Variables globales
const particles = []
const mouse = { x: 0, y: 0 }
let isLoaded = false

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  initLoader()
  initCursor()
  initParticles()
  initNavigation()
  initScrollAnimations()
  initFormHandling()
  initProjectCards()
  initTimelineAnimations()
})

// Loader épico
function initLoader() {
  const loader = document.getElementById("loader")
  const progressFill = document.querySelector(".progress-fill")
  const percentage = document.querySelector(".loading-percentage")

  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 15
    if (progress > 100) progress = 100

    progressFill.style.width = progress + "%"
    percentage.textContent = Math.floor(progress) + "%"

    if (progress >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        loader.style.opacity = "0"
        setTimeout(() => {
          loader.style.display = "none"
          isLoaded = true
          document.body.style.overflow = "auto"
        }, 500)
      }, 500)
    }
  }, 100)
}

// Cursor personalizado
function initCursor() {
  const cursor = document.getElementById("cursor")
  const cursorTrail = document.getElementById("cursor-trail")

  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX
    mouse.y = e.clientY

    cursor.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`

    setTimeout(() => {
      cursorTrail.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`
    }, 100)
  })

  // Efectos hover
  const hoverElements = document.querySelectorAll("button, a, .project-card, .skill-item, .timeline-marker")

  hoverElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.style.transform += " scale(2)"
      cursorTrail.style.transform += " scale(1.5)"
    })

    element.addEventListener("mouseleave", () => {
      cursor.style.transform = cursor.style.transform.replace(" scale(2)", "")
      cursorTrail.style.transform = cursorTrail.style.transform.replace(" scale(1.5)", "")
    })
  })
}

// Sistema de partículas
function initParticles() {
  const canvas = document.getElementById("particles-canvas")
  const ctx = canvas.getContext("2d")

  function resizeCanvas() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  resizeCanvas()
  window.addEventListener("resize", resizeCanvas)

  // Crear partículas
  for (let i = 0; i < 100; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? "#ff6b35" : "#00ff88",
      opacity: Math.random() * 0.5 + 0.2,
    })
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particles.forEach((particle, index) => {
      // Actualizar posición
      particle.x += particle.vx
      particle.y += particle.vy

      // Rebote en bordes
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

      // Interacción con mouse
      const dx = mouse.x - particle.x
      const dy = mouse.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        const force = (100 - distance) / 100
        particle.vx += dx * force * 0.01
        particle.vy += dy * force * 0.01
      }

      // Dibujar partícula
      ctx.save()
      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = particle.color
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Conectar partículas cercanas
      particles.slice(index + 1).forEach((otherParticle) => {
        const dx2 = particle.x - otherParticle.x
        const dy2 = particle.y - otherParticle.y
        const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

        if (distance2 < 150) {
          ctx.save()
          ctx.globalAlpha = 0.1
          ctx.strokeStyle = particle.color
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.stroke()
          ctx.restore()
        }
      })
    })

    requestAnimationFrame(animateParticles)
  }

  animateParticles()
}

// Navegación
function initNavigation() {
  const navbar = document.querySelector(".navbar")
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")

  // Scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Mobile menu toggle
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active")
    hamburger.classList.toggle("active")
  })

  // Smooth scrolling
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = link.getAttribute("href")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }

      // Close mobile menu
      navMenu.classList.remove("active")
      hamburger.classList.remove("active")
    })
  })

  // Hero buttons
  const heroButtons = document.querySelectorAll("[data-target]")
  heroButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const targetId = button.getAttribute("data-target")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Animaciones de scroll
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate")
      }
    })
  }, observerOptions)

  // Observar elementos animables
  const animateElements = document.querySelectorAll(".project-card, .timeline-item, .skill-item")
  animateElements.forEach((el) => observer.observe(el))
}

// Animaciones de timeline
function initTimelineAnimations() {
  const timelineItems = document.querySelectorAll(".timeline-item")

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate")
          }, index * 200)
        }
      })
    },
    { threshold: 0.3 },
  )

  timelineItems.forEach((item) => timelineObserver.observe(item))
}

// Tarjetas de proyectos
function initProjectCards() {
  const projectCards = document.querySelectorAll(".project-card")

  projectCards.forEach((card, index) => {
    // Efecto 3D
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`
    })

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
    })

    // Animación de entrada
    setTimeout(() => {
      card.classList.add("animate")
    }, index * 200)
  })
}

// Manejo de formularios
function initFormHandling() {
  const form = document.getElementById("contact-form")

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      // Animación de envío
      const submitBtn = form.querySelector('button[type="submit"]')
      const originalText = submitBtn.innerHTML

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENVIANDO...'
      submitBtn.disabled = true

      // Simular envío
      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> ¡MISIÓN COMPLETADA!'
        submitBtn.style.background = "linear-gradient(45deg, #00ff88, #00ff88)"

        setTimeout(() => {
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false
          submitBtn.style.background = ""
          form.reset()
        }, 2000)
      }, 2000)
    })
  }
}

// Efectos adicionales
document.addEventListener("DOMContentLoaded", () => {
  // Efecto de escritura para el hero
  const heroTitle = document.querySelector(".hero-title .glitch-text")
  if (heroTitle) {
    const text = heroTitle.textContent
    heroTitle.textContent = ""

    let i = 0
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 100)
      }
    }

    setTimeout(typeWriter, 1000)
  }

  // Efecto parallax
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallaxElements = document.querySelectorAll(".floating-shapes")

    parallaxElements.forEach((element) => {
      const speed = 0.5
      element.style.transform = `translateY(${scrolled * speed}px)`
    })
  })

  // Efecto de hover en skills
  const skillItems = document.querySelectorAll(".skill-item")
  skillItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const icon = item.querySelector(".skill-icon")
      icon.style.transform = "scale(1.5) rotate(360deg)"
      icon.style.transition = "transform 0.5s ease"
    })

    item.addEventListener("mouseleave", () => {
      const icon = item.querySelector(".skill-icon")
      icon.style.transform = "scale(1) rotate(0deg)"
    })
  })

  // Efecto de glitch aleatorio
  setInterval(() => {
    const glitchElements = document.querySelectorAll(".glitch-text")
    const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)]

    if (randomElement) {
      randomElement.style.animation = "none"
      setTimeout(() => {
        randomElement.style.animation = "glitch 0.3s ease-in-out"
      }, 10)
    }
  }, 5000)

  // Efecto de matrix rain en el fondo
  createMatrixRain()
})

// Matrix rain effect
function createMatrixRain() {
  const matrixContainer = document.createElement("div")
  matrixContainer.className = "matrix-rain-container"
  matrixContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.1;
    `

  document.body.appendChild(matrixContainer)

  const characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"

  for (let i = 0; i < 50; i++) {
    const column = document.createElement("div")
    column.style.cssText = `
            position: absolute;
            top: -100%;
            left: ${Math.random() * 100}%;
            color: #ff6b35;
            font-family: monospace;
            font-size: 14px;
            animation: matrixFall ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `

    let text = ""
    for (let j = 0; j < 20; j++) {
      text += characters[Math.floor(Math.random() * characters.length)] + "<br>"
    }
    column.innerHTML = text

    matrixContainer.appendChild(column)
  }

  // Agregar CSS para la animación
  const style = document.createElement("style")
  style.textContent = `
        @keyframes matrixFall {
            0% { transform: translateY(-100vh); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
        }
    `
  document.head.appendChild(style)
}

// Efectos de sonido (opcional)
function playSound(type) {
  // Aquí puedes agregar efectos de sonido si lo deseas
  // const audio = new Audio(`sounds/${type}.mp3`);
  // audio.play();
}

// Optimización de rendimiento
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Aplicar debounce a eventos de scroll y resize
window.addEventListener(
  "scroll",
  debounce(() => {
    // Lógica de scroll optimizada
  }, 16),
)

window.addEventListener(
  "resize",
  debounce(() => {
    // Lógica de resize optimizada
  }, 250),
)

console.log("🚀 CYBER PORTFOLIO LOADED SUCCESSFULLY! 🚀")

