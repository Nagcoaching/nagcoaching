/**
 * Avis Google — sélection aléatoire + rotation
 * Nag Coaching
 */

function shuffleArray(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandomReviews(reviews, count) {
  return shuffleArray(reviews).slice(0, count);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString('fr-FR', options);
}

function renderStars() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
  `;
}

function getInitial(name) {
  return name.charAt(0).toUpperCase();
}

function renderTags(tags) {
  if (!tags || tags.length === 0) return '';
  return `
    <div class="review-tags">
      ${tags.map(tag => `<span class="review-tag">${tag}</span>`).join('')}
    </div>
  `;
}

function renderReviewCard(review) {
  const photoHtml = review.photo
    ? `<img src="${review.photo}" alt="${review.author}" class="testimonial-avatar">`
    : `<div class="testimonial-avatar" style="background: var(--color-primary); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.25rem;">${getInitial(review.author)}</div>`;

  return `
    <div class="testimonial-card">
      <div class="testimonial-stars">
        ${renderStars()}
      </div>
      <p class="testimonial-text">"${review.text}"</p>
      ${renderTags(review.tags)}
      <div class="testimonial-author">
        ${photoHtml}
        <div class="testimonial-info">
          <h4>${review.author}, ${review.age} ans</h4>
          <span>${formatDate(review.date)}</span>
        </div>
      </div>
    </div>
  `;
}

function renderReviews(container, reviews) {
  container.innerHTML = reviews.map(r => renderReviewCard(r)).join('');
}

async function initReviews(options) {
  const {
    jsonUrl = 'src/data/reviews.json',
    containerSelector,
    count = 6,
    shuffleButtonSelector = null,
    autoRotateMs = 0
  } = options;

  try {
    const res = await fetch(jsonUrl);
    const data = await res.json();
    const allReviews = data.reviews || [];

    const container = document.querySelector(containerSelector);
    if (!container) return;

    let currentReviews = pickRandomReviews(allReviews, count);
    renderReviews(container, currentReviews);

    // Bouton shuffle
    if (shuffleButtonSelector) {
      const btn = document.querySelector(shuffleButtonSelector);
      if (btn) {
        btn.addEventListener('click', () => {
          currentReviews = pickRandomReviews(allReviews, count);
          renderReviews(container, currentReviews);
          // Scroll smooth vers les avis
          container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
    }

    // Auto-rotation
    if (autoRotateMs > 0) {
      setInterval(() => {
        currentReviews = pickRandomReviews(allReviews, count);
        renderReviews(container, currentReviews);
      }, autoRotateMs);
    }

  } catch (error) {
    console.error('Erreur chargement avis:', error);
  }
}

// Export pour utilisation
window.initReviews = initReviews;
