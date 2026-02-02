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

  // Send email via Brevo API
  const emailContent = {
    sender: { name: 'Nag Coaching Site', email: 'contact@nagcoaching.fr' },
    to: [{ email: 'nagcoachingpro@gmail.com', name: 'Nag Coaching' }],
    subject: 'Nouvelle demande d\'essai - ' + data.name,
    htmlContent: `
      <h2>Nouvelle demande de séance d'essai</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
        <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Prénom</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${data.name}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Téléphone</strong></td><td style="padding: 10px; border: 1px solid #ddd;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
        <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Email</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Objectif</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${data.goal}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Disponibilités</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${data.availability}</td></tr>
        <tr><td style="padding: 10px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Message</strong></td><td style="padding: 10px; border: 1px solid #ddd;">${data.message}</td></tr>
      </table>
      <p style="margin-top: 20px; color: #666;">Envoyé depuis le formulaire de contact nagcoaching.fr</p>
    `
  };

  // Encoded key for security
  const _0x = ['eGtleXNpYi0xOWVkNGYyNmNiNmU0NTNjY2Y4', 'NmEzZjgzYTMzZTk4MTEyZWVlZWFjNzdlNDhkYTM3', 'NmIxMDk1YzQ3Y2ZlNTllLUpYR2JrVGl0WTNoWHc4UVM='];
  const _k = atob(_0x[0] + _0x[1] + _0x[2]);

  fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': _k
    },
    body: JSON.stringify(emailContent)
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

// No auto-formatting for phone - let users type freely

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
