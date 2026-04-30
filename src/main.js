// Import CSS
import './style.css'

// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn')
const navLinks = document.querySelector('.nav-links')

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active')
    mobileMenuBtn.classList.toggle('active')
  })
  
  // Close mobile menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active')
      mobileMenuBtn.classList.remove('active')
    })
  })
}

// ===== Smooth Scroll for Anchor Links =====
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
    }
  })
})

// ===== Contact Form Submission =====
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
      // Offline fallback - open WhatsApp
      const whatsappMessage = `Halo NusaERP!%0A%0A*Lead dari Website*%0A${'Nama: ' + data.name}%0A${'Email: ' + data.email}%0A${'Phone: ' + (data.phone || '-')}%0A${'Kebutuhan: ' + (data.message || '-')}`
      const whatsappURL = `https://wa.me/628****2778?text=${whatsappMessage}`
      
      const useWhatsApp = confirm('Maaf, terjadi kesalahan koneksi.%0AAtau hubungi kami via WhatsApp?')
      if (useWhatsApp) {
        window.open(whatsappURL, '_blank')
      }
    } finally {
      btn.innerHTML = originalText
      btn.disabled = false
    }
  })
}

// ===== Navbar Background on Scroll =====
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar')
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)'
  } else {
    navbar.style.boxShadow = 'none'
  }
})

// ===== Intersection Observer for Scroll Animations =====
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
          entry.target.parentElement.classList.contains('steps') ||
          entry.target.parentElement.classList.contains('packages-grid')) {
        const items = entry.target.parentElement.children
        const itemIndex = Array.from(items).indexOf(entry.target)
        entry.target.style.transitionDelay = `${itemIndex * 0.1}s`
      }
      entry.target.classList.add('visible')
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// Observe elements with animation classes
document.querySelectorAll('.feature-card, .package-card, .step, .why-card, .section-header, .contact-wrapper').forEach(el => {
  el.classList.add('fade-in-up')
  observer.observe(el)
})

// Add fade-in-left to contact-info
const contactInfo = document.querySelector('.contact-info')
if (contactInfo) {
  contactInfo.classList.add('fade-in-left')
  observer.observe(contactInfo)
}

// Add fade-in-right to contact-details
const contactDetails = document.querySelector('.contact-details')
if (contactDetails) {
  contactDetails.classList.add('fade-in-right')
  observer.observe(contactDetails)
}

// ===== Update Stats from API (Optional) =====
async function updateStats() {
  try {
    const response = await fetch('http://localhost:3000/api/stats')
    if (response.ok) {
      const stats = await response.json()
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
    if (chatWindow.classList.contains('active')) {
      chatInput.focus()
    }
  })
}

// Close chat window
if (chatClose) {
  chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active')
  })
}

// Handle form submission
if (chatForm) {
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const message = chatInput.value.trim()
    if (!message) return
    
    // Add user message
    addMessage(message, 'user')
    chatInput.value = ''
    
    // Disable input
    chatInput.disabled = true
    const submitBtn = chatForm.querySelector('button[type="submit"]')
    const originalText = submitBtn.textContent
    submitBtn.textContent = 'Mengirim...'
    submitBtn.disabled = true
    
    // Show typing indicator
    const typingDiv = addTypingIndicator()
    
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000)
      
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          customerName: 'Website Visitor',
          timestamp: new Date().toISOString()
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeout)
      typingDiv.remove()
      
      if (response.ok) {
        const data = await response.json()
        const botMessage = data.response?.message || data.response || 'Maaf, ada kesalahan.'
        addMessage(botMessage, 'bot')
      } else {
        throw new Error('Server error')
      }
    } catch (error) {
      console.error('Chat error:', error)
      typingDiv.remove()
      
      // Offline auto-response
      const responses = [
        'Terima kasih! Saat ini CS sedang offline. Hubungi WhatsApp: +628****2778 untuk respon cepat.',
        'Halo! Mohon maaf CS tidak aktif. Silakan isi form kontak atau WA ke +628****2778.',
        'Pesan terkirim! Tim NusaERP akan menghubungi Anda segera. Atau hubungi: +628****2778.'
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      setTimeout(() => addMessage(randomResponse, 'bot'), 1000)
    } finally {
      chatInput.disabled = false
      submitBtn.textContent = originalText
      submitBtn.disabled = false
      chatInput.focus()
    }
  })
}

// Add typing indicator
function addTypingIndicator() {
  const div = document.createElement('div')
  div.className = 'chat-message bot'
  div.innerHTML = `
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `
  chatMessages.appendChild(div)
  chatMessages.scrollTop = chatMessages.scrollHeight
  return div
}

// Add message to chat
function addMessage(text, sender) {
  const div = document.createElement('div')
  div.className = `chat-message ${sender}`
  div.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`
  chatMessages.appendChild(div)
  chatMessages.scrollTop = chatMessages.scrollHeight
}

console.log('🏝️ NusaERP website loaded!')
