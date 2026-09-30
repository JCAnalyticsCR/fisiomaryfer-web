(() => {
  const whatsappNumber = '50671041425';
  const messages = {
    general: 'Hola María, conocí Renacer Vita en su página web y quisiera agendar una cita de fisioterapia.',
    onco: 'Hola María, quisiera información sobre rehabilitación oncológica.',
    sport: 'Hola María, quisiera información sobre rehabilitación deportiva.',
    ortho: 'Hola María, quisiera información sobre fisioterapia ortopédica.'
  };

  document.querySelectorAll('.js-wa').forEach(link => {
    const message = messages[link.dataset.msg] || messages.general;
    link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  });

  const header = document.getElementById('header');
  const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();

  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const setMenu = open => {
    mobileMenu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', open);
  };

  menuButton.addEventListener('click', () => setMenu(mobileMenu.hidden));
  mobileMenu.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileMenu.hidden) setMenu(false);
  });
  matchMedia('(min-width: 1080px)').addEventListener('change', event => {
    if (event.matches) setMenu(false);
  });

  const mobileDock = document.getElementById('mobileDock');
  const heroActions = document.querySelector('.hero-actions');
  const contact = document.getElementById('contacto');
  const faq = document.getElementById('preguntas');
  const reviews = document.getElementById('resenas');
  const footer = document.querySelector('.footer');
  let heroPassed = false;
  let contactVisible = false;
  let faqVisible = false;
  let reviewsVisible = false;
  let footerVisible = false;
  const syncDock = () => mobileDock.classList.toggle('is-visible', heroPassed && !contactVisible && !faqVisible && !reviewsVisible && !footerVisible);

  new IntersectionObserver(([entry]) => {
    heroPassed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    syncDock();
  }).observe(heroActions);

  new IntersectionObserver(([entry]) => {
    contactVisible = entry.isIntersecting;
    syncDock();
  }, { threshold: .12 }).observe(contact);

  new IntersectionObserver(([entry]) => {
    faqVisible = entry.isIntersecting;
    syncDock();
  }, { threshold: .08 }).observe(faq);

  new IntersectionObserver(([entry]) => {
    reviewsVisible = entry.isIntersecting;
    syncDock();
  }, { threshold: .06 }).observe(reviews);

  new IntersectionObserver(([entry]) => {
    footerVisible = entry.isIntersecting;
    syncDock();
  }, { threshold: .05 }).observe(footer);

  const careItems = [...document.querySelectorAll('.care-item')];
  careItems.forEach(item => {
    const trigger = item.querySelector('.care-trigger');
    trigger.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      careItems.forEach(otherItem => {
        otherItem.classList.remove('is-open');
        otherItem.querySelector('.care-trigger').setAttribute('aria-expanded', 'false');
      });
      item.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
    });
  });

  const faqItems = [...document.querySelectorAll('.faq-list details')];
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach(otherItem => {
        if (otherItem !== item) otherItem.open = false;
      });
    });
  });

  const reviewForm = document.getElementById('reviewForm');
  const reviewMessage = document.getElementById('reviewMessage');
  const reviewCount = document.getElementById('reviewCount');
  const reviewNameField = document.getElementById('reviewNameField');
  const reviewName = document.getElementById('reviewName');
  const reviewStatus = document.getElementById('reviewStatus');
  const reviewWall = document.getElementById('reviewWall');
  const reviewDialog = document.getElementById('reviewDialog');
  const reviewOpenButton = document.getElementById('reviewOpenButton');
  const reviewCloseButton = document.getElementById('reviewCloseButton');
  const reviewEntry = document.getElementById('reviewEntry');
  const reviewEntryTitle = document.getElementById('reviewEntryTitle');
  const reviewEntryText = document.getElementById('reviewEntryText');
  const reviewStorageKey = 'renacerVita.review.v1';

  const renderReviewCard = review => {
    const existing = reviewWall.querySelector('[data-saved-review]');
    if (existing) existing.remove();

    const card = document.createElement('article');
    card.className = 'testimonial testimonial--personal';
    card.dataset.savedReview = 'true';

    const top = document.createElement('div');
    top.className = 'testimonial__top';
    const stars = document.createElement('span');
    stars.className = 'testimonial__stars';
    stars.textContent = `${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}`;
    stars.setAttribute('aria-label', `${review.rating} de 5 estrellas`);
    const badge = document.createElement('span');
    badge.className = 'testimonial__service';
    badge.textContent = 'Su reseña';
    top.append(stars, badge);

    const quote = document.createElement('blockquote');
    quote.textContent = `“${review.message}”`;
    const footer = document.createElement('footer');
    const avatar = document.createElement('span');
    avatar.className = 'testimonial__avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = review.signature === 'Anónima' ? '♡' : review.signature.trim().charAt(0).toUpperCase();
    const identity = document.createElement('div');
    const author = document.createElement('strong');
    author.textContent = review.signature;
    const date = document.createElement('small');
    date.textContent = new Intl.DateTimeFormat('es-CR', { dateStyle: 'long' }).format(new Date(review.createdAt));
    identity.append(author, date);
    const mark = document.createElement('i');
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '“';
    footer.append(avatar, identity, mark);
    card.append(top, quote, footer);
    reviewWall.prepend(card);
  };

  const renderSavedReview = review => {
    reviews.classList.add('has-saved-review');
    renderReviewCard(review);
    reviewEntry.classList.add('is-complete');
    reviewEntryTitle.textContent = 'Gracias por compartir su experiencia.';
    reviewEntryText.textContent = 'Su reseña aparece destacada al inicio de este espacio.';
    reviewOpenButton.hidden = true;
  };

  try {
    const savedReview = JSON.parse(localStorage.getItem(reviewStorageKey));
    if (savedReview && Number.isInteger(savedReview.rating) && savedReview.message && savedReview.signature && savedReview.createdAt) {
      renderSavedReview(savedReview);
    }
  } catch {
    localStorage.removeItem(reviewStorageKey);
  }

  reviewMessage.addEventListener('input', () => {
    reviewCount.textContent = String(reviewMessage.value.length);
  });

  reviewOpenButton.addEventListener('click', () => {
    reviewStatus.textContent = '';
    reviewDialog.showModal();
  });

  reviewCloseButton.addEventListener('click', () => reviewDialog.close());
  reviewDialog.addEventListener('click', event => {
    if (event.target === reviewDialog) reviewDialog.close();
  });

  reviewForm.querySelectorAll('input[name="identity"]').forEach(option => {
    option.addEventListener('change', () => {
      const anonymous = option.value === 'anonymous' && option.checked;
      reviewNameField.classList.toggle('is-hidden', anonymous);
      reviewName.disabled = anonymous;
      reviewName.required = !anonymous;
      if (anonymous) reviewName.value = '';
    });
  });

  reviewForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!reviewForm.checkValidity()) {
      reviewForm.reportValidity();
      return;
    }

    const rating = reviewForm.querySelector('input[name="rating"]:checked').value;
    const anonymous = reviewForm.querySelector('input[name="identity"]:checked').value === 'anonymous';
    const signature = anonymous ? 'Anónima' : reviewName.value.trim();
    const review = {
      rating: Number(rating),
      signature,
      message: reviewMessage.value.trim(),
      createdAt: new Date().toISOString()
    };

    try {
      if (localStorage.getItem(reviewStorageKey)) {
        reviewStatus.textContent = 'Este dispositivo ya registró una reseña.';
        return;
      }
      localStorage.setItem(reviewStorageKey, JSON.stringify(review));
      renderSavedReview(review);
      reviewDialog.close();
    } catch {
      reviewStatus.textContent = 'No fue posible guardar la reseña. Revise que el navegador permita almacenar datos del sitio.';
    }
  });

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = [
    ...document.querySelectorAll('.section-intro, .method-photo, .method-cards article, .care-explorer__heading, .care-item, .services-intro, .service-card, .promise-copy, .promise-stack article, .about-gallery, .about-copy, .contact-card, .faq-heading, .faq details, .reviews-heading, .review-showcase__heading, .testimonial, .review-entry')
  ];

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal-item');
    element.style.setProperty('--reveal-delay', `${(index % 3) * 70}ms`);
  });

  document.querySelectorAll('.method-photo, .about-gallery, .faq-heading').forEach(element => element.classList.add('reveal-from-left'));
  document.querySelectorAll('.about-copy, .contact-card').forEach(element => element.classList.add('reveal-from-right'));

  if (!reducedMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    revealTargets.forEach(element => revealObserver.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add('is-visible'));
  }
})();
