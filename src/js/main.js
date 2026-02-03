// NAG COACHING - Main JavaScript

// Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('active');
}

// FAQ Accordion
function toggleFaq(button) {
  const item = button.parentElement;
  const wasActive = item.classList.contains('active');

  // Close all FAQ items
  document.querySelectorAll('.faq-item').forEach(faq => {
    faq.classList.remove('active');
  });

  // Open clicked one if it wasn't already open
  if (!wasActive) {
    item.classList.add('active');
  }
}

// Lightbox
function openLightbox(imageSrc) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  lightboxImage.src = imageSrc;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = 'none';
  }

  lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
  const animateElements = document.querySelectorAll('.card, .testimonial-card, .proof-item, .faq-item');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });
});

// Form validation
function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = '#EF4444';
    } else {
      field.style.borderColor = '#E2E8F0';
    }
  });

  // Phone validation - simplified (at least 10 digits)
  const phoneField = form.querySelector('input[type="tel"]');
  if (phoneField && phoneField.value) {
    const digitsOnly = phoneField.value.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      isValid = false;
      phoneField.style.borderColor = '#EF4444';
    }
  }

  return isValid;
}

// Submit contact form
function submitContactForm(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  if (!validateForm(form)) {
    return false;
  }

  // Disable button during submission
  submitBtn.disabled = true;
  submitBtn.textContent = 'Envoi en cours...';

  // Collect form data
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    phone: formData.get('phone'),
    email: formData.get('email') || 'Non renseigné',
    goal: formData.get('goal') || 'Non renseigné',
    availability: formData.get('availability') || 'Non renseigné',
    message: formData.get('message') || 'Aucun'
  };

  // Send email via secure serverless function (API key is server-side)
  fetch('/api/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erreur envoi');
    }
    return response.json();
  })
  .then(() => {
    // Show success message
    showFormSuccess(data);
  })
  .catch(error => {
    console.error('Erreur:', error);
    // Show success anyway (fallback to WhatsApp)
    showFormSuccess(data);
  });

  return false;
}

function showFormSuccess(data) {
  // Build WhatsApp message with form data
  const whatsappMessage = encodeURIComponent(
    'Bonjour, je souhaite réserver une séance d\'essai gratuite.\n\n' +
    'Prénom: ' + data.name + '\n' +
    'Téléphone: ' + data.phone + '\n' +
    (data.email !== 'Non renseigné' ? 'Email: ' + data.email + '\n' : '') +
    (data.goal !== 'Non renseigné' ? 'Objectif: ' + data.goal + '\n' : '') +
    (data.availability !== 'Non renseigné' ? 'Disponibilités: ' + data.availability + '\n' : '') +
    (data.message !== 'Aucun' ? 'Message: ' + data.message : '')
  );

  const whatsappLink = 'https://wa.me/33674466641?text=' + whatsappMessage;

  const formFields = document.getElementById('formFields');
  const formSuccess = document.getElementById('formSuccess');

  if (formFields && formSuccess) {
    formFields.style.display = 'none';
    formSuccess.style.display = 'block';

    const whatsappBtn = document.getElementById('whatsappSuccessBtn');
    if (whatsappBtn) {
      whatsappBtn.setAttribute('href', whatsappLink);
    }

    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// Limit phone to 10 digits max
document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.setAttribute('maxlength', '10');
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
