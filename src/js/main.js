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

  // Phone validation
  const phoneField = form.querySelector('input[type="tel"]');
  if (phoneField && phoneField.value) {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    if (!phoneRegex.test(phoneField.value)) {
      isValid = false;
      phoneField.style.borderColor = '#EF4444';
    }
  }

  return isValid;
}

// Format phone number as user types
document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);

    if (value.length >= 2) {
      value = value.slice(0, 2) + ' ' + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + ' ' + value.slice(5);
    }
    if (value.length >= 8) {
      value = value.slice(0, 8) + ' ' + value.slice(8);
    }
    if (value.length >= 11) {
      value = value.slice(0, 11) + ' ' + value.slice(11);
    }

    e.target.value = value;
  });
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
