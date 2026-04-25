// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn')
const navLinks = document.querySelector('.nav-links')

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active')
    mobileMenuBtn.classList.toggle('active')
  })
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute('href'))
    if (target) {
      const navHeight = document.querySelector('.navbar').offsetHeight
      const targetPosition = target.offsetTop - navHeight
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
      // Close mobile menu if open
      navLinks.classList.remove('active')
      mobileMenuBtn.classList.remove('active')
    }
  })
})

// Form submission to API
const contactForm = document.getElementById('contactForm')
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault()
    
    const formData = new FormData(this)
    const data = {
      name: formData.get('name') || this.querySelector('input[type="text"]').value,
      email: formData.get('email') || this.querySelector('input[type="email"]').value,
      phone: formData.get('phone') || this.querySelector('input[type="tel"]').value,
      message: formData.get('message') || this.querySelector('textarea').value
    }
    
    // Validate
    if (!data.name || !data.email) {
      alert('Nama dan Email wajib diisi!')
      return
    }
    
    const btn = this.querySelector('button[type="submit"]')
    const originalText = btn.innerHTML
    btn.innerHTML = '⏳ Mengirim...'
    btn.disabled = true
    
    try {
      // Submit to NusaERP API
      const response = await fetch('http://localhost:3000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        alert('Terima kasih! Pesan Anda telah terkirim. Tim NusaERP akan menghubungi Anda segera untuk demo gratis.')
        this.reset()
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.')
    } finally {
      btn.innerHTML = originalText
      btn.disabled = false
    }
  })
}

// Navbar background on scroll
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar')
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)'
  } else {
    navbar.style.boxShadow = 'none'
  }
})

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Add staggered delay for grid items
      if (entry.target.parentElement.classList.contains('features-grid') ||
          entry.target.parentElement.classList.contains('why-grid') ||
          entry.target.parentElement.classList.contains('steps')) {
        const items = entry.target.parentElement.children;
        const itemIndex = Array.from(items).indexOf(entry.target);
        entry.target.style.transitionDelay = `${itemIndex * 0.1}s`;
      }
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  })
}, observerOptions)

// Observe elements with animation classes
document.querySelectorAll('.feature-card, .package-card, .step, .why-card, .section-header, .contact-wrapper').forEach(el => {
  el.classList.add('fade-in-up');
  observer.observe(el);
})

// Add fade-in-left to contact-info
const contactInfo = document.querySelector('.contact-info');
if (contactInfo) {
  contactInfo.classList.add('fade-in-left');
  observer.observe(contactInfo);
}

// Add fade-in-right to contact-form
const contactFormSection = document.querySelector('.contact-form');
if (contactFormSection) {
  contactFormSection.classList.add('fade-in-right');
  observer.observe(contactFormSection);
}

// Update stats from API (optional real-time)
async function updateStats() {
  try {
    const response = await fetch('http://localhost:3000/api/stats')
    if (response.ok) {
      const stats = await response.json()
      // Update any stat displays if needed
      console.log('Stats:', stats)
    }
  } catch (error) {
    console.log('Stats API not available')
  }
}

// Update stats on load
updateStats()

// ===== Chat Widget =====
const chatToggle = document.getElementById('chatToggle')
const chatWindow = document.getElementById('chatWindow')
const chatClose = document.getElementById('chatClose')
const chatForm = document.getElementById('chatForm')
const chatInput = document.getElementById('chatInput')
const chatMessages = document.getElementById('chatMessages')

// Toggle chat window
if (chatToggle) {
  chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('active')
  })
}

// Close chat window
if (chatClose) {
  chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active')
  })
}

// Handle chat form submission
if (chatForm) {
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const message = chatInput.value.trim()
    if (!message) return
    
    // Add user message to chat
    addMessage(message, 'user')
    chatInput.value = ''
    
    // Disable input while waiting
    chatInput.disabled = true
    const submitBtn = chatForm.querySelector('button[type="submit"]')
    const originalBtnText = submitBtn.innerHTML
    submitBtn.innerHTML = '⏳ Menunggu CS...'
    submitBtn.disabled = true
    
    // Show typing indicator
    const typingDiv = addTypingIndicator()
    
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s timeout
      
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, customerName: 'Website Visitor' }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      // Remove typing indicator
      if (typingDiv) typingDiv.remove()
      
      if (response.ok) {
        const data = await response.json()
        // Response is in data.response.message
        if (data.response && data.response.message) {
          addMessage(data.response.message, 'bot')
        } else if (data.response) {
          addMessage(data.response, 'bot')
        } else {
          addMessage('Maaf, terjadi kesalahan dalam memproses pesan.', 'bot')
        }
      } else {
        throw new Error('Server error')
      }
    } catch (error) {
      console.error('Chat error:', error)
      // Remove typing indicator
      if (typingDiv) typingDiv.remove()
      if (error.name === 'AbortError') {
        addMessage('Waktu tunggu habis. Silakan coba lagi.', 'bot')
      } else {
        addMessage('Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi kami via WhatsApp.', 'bot')
      }
    } finally {
      chatInput.disabled = false
      submitBtn.innerHTML = originalBtnText
      submitBtn.disabled = false
      chatInput.focus()
    }
  })
}

// Add typing indicator (three animated dots)
function addTypingIndicator() {
  const typingDiv = document.createElement('div')
  typingDiv.className = 'chat-message bot typing-indicator-container'
  typingDiv.innerHTML = `
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `
  chatMessages.appendChild(typingDiv)
  chatMessages.scrollTop = chatMessages.scrollHeight
  return typingDiv
}

// Add message to chat window
function addMessage(text, sender) {
  const msgDiv = document.createElement('div')
  msgDiv.className = `chat-message ${sender}`
  // Convert newlines to <br> and wrap in <p>
  const formattedText = text.replace(/\n/g, '<br>')
  msgDiv.innerHTML = `<p>${formattedText}</p>`
  chatMessages.appendChild(msgDiv)
  chatMessages.scrollTop = chatMessages.scrollHeight
}

console.log('🏝️ NusaERP website loaded!')
