const factoryPhotos = [{"file": "FYS09393", "category": "Facility", "title": "A working day at Green Cocopeat", "alt": "Material handling in the open yard"}, {"file": "FYS09403", "category": "Production", "title": "Taking shape", "alt": "A cocopeat block at the pressing machine"}, {"file": "FYS09435", "category": "Products", "title": "Texture, up close", "alt": "A close look at a compressed cocopeat slab"}, {"file": "FYS09452-2", "category": "Facility", "title": "Inside our world", "alt": "A wide view of the production facility"}, {"file": "FYS09385", "category": "Facility", "title": "On the move", "alt": "Tractor and cocopeat inside the storage shed"}, {"file": "FYS09398", "category": "Production", "title": "Behind the process", "alt": "Processing equipment inside the factory"}, {"file": "FYS09404", "category": "Production", "title": "Fresh from the press", "alt": "Compressed cocopeat blocks on the production line"}, {"file": "FYS09407", "category": "Production", "title": "A closer look inside", "alt": "Machinery and conveyors in the production shed"}, {"file": "FYS09417", "category": "Products", "title": "Blocks, ready for the next step", "alt": "Rows of stacked cocopeat blocks"}, {"file": "FYS09421-2", "category": "Products", "title": "On the scales", "alt": "A cocopeat block on a weighing scale"}, {"file": "FYS09422", "category": "Products", "title": "Product in focus", "alt": "A tall view of a cocopeat block and scale"}, {"file": "FYS09423-2", "category": "Products", "title": "From our production floor", "alt": "A weighed block with stacked products behind it"}, {"file": "FYS09431", "category": "Products", "title": "A different format", "alt": "Cocopeat slabs on the factory floor"}, {"file": "FYS09433", "category": "Products", "title": "Made in slabs", "alt": "An overhead view of compressed cocopeat slabs"}, {"file": "FYS09449", "category": "Facility", "title": "Room to prepare", "alt": "Cocopeat spread across the outdoor yard"}, {"file": "FYS09453", "category": "Facility", "title": "The everyday operation", "alt": "Tractor, trailer and material at the facility"}, {"file": "FYS09458", "category": "Facility", "title": "Space to work", "alt": "A wide view across the open yard"}, {"file": "FYS09459-2", "category": "Facility", "title": "Where it begins", "alt": "Raw material beside the facility building"}, {"file": "FYS09465", "category": "Facility", "title": "Across the yard", "alt": "A detail of cocopeat spread outdoors"}, {"file": "FYS09479", "category": "Facility", "title": "Coconut to cocopeat", "alt": "Coconut husks and processed material side by side"}];
(() => {
  'use strict';
  const base = 'assets/media/demo/';
  const $ = id => document.getElementById(id);
  const hero = $('hero-video');
  const motion = $('hero-motion');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const filmDialog = $('film-dialog');
  const fullFilm = $('factory-video');
  const filmStatus = $('film-status');
  let advanceAfterFilm = false;
  let backgroundEnabled = !reduced.matches && !navigator.connection?.saveData;
  let heroVisible = true;
  function syncMotion() {
    const playing = !hero.paused;
    motion.classList.toggle('is-playing', playing);
    motion.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
    motion.title = playing ? 'Pause background video' : 'Play background video';
  }
  async function playBackground() {
    if (filmDialog.open || document.hidden) return;
    if (!hero.src) hero.src = hero.dataset.src;
    try { await hero.play(); } catch { /* Keep the original hero image when playback is unavailable. */ }
    syncMotion();
  }
  // Reveal only once the browser is actually playing decoded video frames.
  hero.addEventListener('playing', () => hero.classList.add('is-ready'));
  hero.addEventListener('error', () => hero.classList.remove('is-ready'));
  hero.addEventListener('emptied', () => hero.classList.remove('is-ready'));
  hero.addEventListener('play', syncMotion);
  hero.addEventListener('pause', syncMotion);
  motion.addEventListener('click', () => {
    backgroundEnabled = hero.paused;
    if (backgroundEnabled) playBackground(); else hero.pause();
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) { backgroundEnabled = false; hero.pause(); }
  });
  new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    if (heroVisible && backgroundEnabled && !document.hidden && !filmDialog.open) playBackground(); else hero.pause();
  }, {threshold: .15}).observe(hero);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { hero.pause(); fullFilm.pause(); }
    else if (heroVisible && backgroundEnabled && !filmDialog.open) playBackground();
  });
  $('watch-process').addEventListener('click', async () => {
    advanceAfterFilm = false;
    filmStatus.textContent = 'Enjoy a closer look. Then continue to our story.';
    hero.pause();
    filmDialog.showModal();
    fullFilm.currentTime = 0;
    try { await fullFilm.play(); }
    catch { if (filmDialog.open) filmStatus.textContent = 'Press play in the video controls to start the film.'; }
  });
  $('film-close').addEventListener('click', () => filmDialog.close());
  filmDialog.addEventListener('click', event => {
    if (event.target === filmDialog) {
      const rect = filmDialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) filmDialog.close();
    }
  });
  fullFilm.addEventListener('ended', () => {
    if (!filmDialog.open) return;
    advanceAfterFilm = true;
    filmDialog.close();
  });
  fullFilm.addEventListener('error', () => { filmStatus.textContent = 'The film could not load. Please close and try again.'; });
  filmDialog.addEventListener('close', () => {
    fullFilm.pause();
    if (advanceAfterFilm) {
      advanceAfterFilm = false;
      const nextSection = $('about');
      nextSection.setAttribute('tabindex', '-1');
      nextSection.focus({preventScroll: true});
      nextSection.scrollIntoView({behavior: reduced.matches ? 'instant' : 'smooth', block: 'start'});
    } else if (heroVisible && backgroundEnabled && !document.hidden) playBackground();
  });
  let items = factoryPhotos;
  let current = 0;
  const dialog = $('photo-dialog');
  const rail = $('gallery-cards');
  function renderDialog() {
    const photo = items[current];
    $('dialog-image').src = base + photo.file + '.webp';
    $('dialog-image').alt = photo.alt;
    $('dialog-caption').textContent = photo.title;
    $('dialog-count').textContent = `${current + 1} / ${items.length}`;
  }
  function renderCards() {
    rail.replaceChildren(...items.map((photo, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'journal-card';
      card.setAttribute('aria-label', `View ${photo.title} in fullscreen`);
      const image = document.createElement('img');
      image.src = base + photo.file + '.webp';
      image.alt = photo.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      const number = document.createElement('span');
      number.className = 'card-number';
      number.textContent = String(i + 1).padStart(2, '0');
      const expand = document.createElement('span');
      expand.className = 'card-expand';
      expand.setAttribute('aria-hidden', 'true');
      expand.textContent = '↗';
      const caption = document.createElement('span');
      caption.className = 'card-caption';
      const category = document.createElement('span');
      category.className = 'card-category';
      category.textContent = photo.category;
      const title = document.createElement('strong');
      title.textContent = photo.title;
      caption.append(category, title);
      card.append(image, number, expand, caption);
      card.addEventListener('click', () => {
        current = i;
        dialog.showModal();
        renderDialog();
      });
      return card;
    }));
    rail.scrollLeft = 0;
    $('gallery-count').textContent = `${items.length} photographs to explore`;
    updateArrows();
  }
  function updateArrows() {
    $('gallery-prev').disabled = rail.scrollLeft < 2;
    $('gallery-next').disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2;
  }
  function scrollCards(direction) {
    const card = rail.firstElementChild;
    if (card) rail.scrollBy({left: direction * (card.getBoundingClientRect().width + 20), behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  rail.addEventListener('scroll', updateArrows, {passive:true});
  new ResizeObserver(updateArrows).observe(rail);
  rail.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollCards(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    items = factoryPhotos.filter(photo => button.dataset.filter === 'All' || photo.category === button.dataset.filter);
    current = 0;
    renderCards();
  }));
  $('gallery-prev').addEventListener('click', () => scrollCards(-1));
  $('gallery-next').addEventListener('click', () => scrollCards(1));
  function movePhoto(delta) { current = (current + delta + items.length) % items.length; renderDialog(); }
  $('dialog-prev').addEventListener('click', () => movePhoto(-1));
  $('dialog-next').addEventListener('click', () => movePhoto(1));
  $('dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); movePhoto(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); movePhoto(1); }
  });
  renderCards();
})();
