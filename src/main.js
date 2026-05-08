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

console.log('🏝️ NusaERP website loaded!')
