const factoryPhotos = [{"file": "FYS09393", "category": "Facility", "title": "A working day at Green Cocopeat", "alt": "Material handling in the open yard"}, {"file": "FYS09403", "category": "Production", "title": "Taking shape", "alt": "A cocopeat block at the pressing machine"}, {"file": "FYS09435", "category": "Products", "title": "Texture, up close", "alt": "A close look at a compressed cocopeat slab"}, {"file": "FYS09452-2", "category": "Facility", "title": "Inside our world", "alt": "A wide view of the production facility"}, {"file": "FYS09385", "category": "Facility", "title": "On the move", "alt": "Tractor and cocopeat inside the storage shed"}, {"file": "FYS09398", "category": "Production", "title": "Behind the process", "alt": "Processing equipment inside the factory"}, {"file": "FYS09404", "category": "Production", "title": "Fresh from the press", "alt": "Compressed cocopeat blocks on the production line"}, {"file": "FYS09407", "category": "Production", "title": "A closer look inside", "alt": "Machinery and conveyors in the production shed"}, {"file": "FYS09417", "category": "Products", "title": "Blocks, ready for the next step", "alt": "Rows of stacked cocopeat blocks"}, {"file": "FYS09421-2", "category": "Products", "title": "On the scales", "alt": "A cocopeat block on a weighing scale"}, {"file": "FYS09422", "category": "Products", "title": "Product in focus", "alt": "A tall view of a cocopeat block and scale"}, {"file": "FYS09423-2", "category": "Products", "title": "From our production floor", "alt": "A weighed block with stacked products behind it"}, {"file": "FYS09431", "category": "Products", "title": "A different format", "alt": "Cocopeat slabs on the factory floor"}, {"file": "FYS09433", "category": "Products", "title": "Made in slabs", "alt": "An overhead view of compressed cocopeat slabs"}, {"file": "FYS09449", "category": "Facility", "title": "Room to prepare", "alt": "Cocopeat spread across the outdoor yard"}, {"file": "FYS09453", "category": "Facility", "title": "The everyday operation", "alt": "Tractor, trailer and material at the facility"}, {"file": "FYS09458", "category": "Facility", "title": "Space to work", "alt": "A wide view across the open yard"}, {"file": "FYS09459-2", "category": "Facility", "title": "Where it begins", "alt": "Raw material beside the facility building"}, {"file": "FYS09465", "category": "Facility", "title": "Across the yard", "alt": "A detail of cocopeat spread outdoors"}, {"file": "FYS09479", "category": "Facility", "title": "Coconut to cocopeat", "alt": "Coconut husks and processed material side by side"}];
(() => {
  'use strict';
  const base = 'assets/media/demo/';
  const $ = id => document.getElementById(id);
  const hero = $('hero-video');
  const motion = $('hero-motion');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let backgroundEnabled = !reduced.matches && !navigator.connection?.saveData;
  function syncMotion() {
    motion.textContent = hero.paused ? 'Play background' : 'Pause background';
    motion.setAttribute('aria-pressed', String(!hero.paused));
  }
  async function playBackground() {
    if (!hero.src) hero.src = hero.dataset.src;
    try { await hero.play(); } catch { /* The poster remains visible if autoplay is unavailable. */ }
    syncMotion();
  }
  hero.addEventListener('play', syncMotion);
  hero.addEventListener('pause', syncMotion);
  motion.addEventListener('click', () => {
    backgroundEnabled = hero.paused;
    if (backgroundEnabled) playBackground(); else hero.pause();
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) { backgroundEnabled = false; hero.pause(); }
  });
  let heroVisible = true;
  new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting;
    if (heroVisible && backgroundEnabled && !document.hidden) playBackground(); else hero.pause();
  }, {threshold: .15}).observe(hero);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { hero.pause(); $('factory-video').pause(); }
    else if (heroVisible && backgroundEnabled) playBackground();
  });
  $('factory-video').addEventListener('play', () => hero.pause());
  let items = factoryPhotos;
  let current = 0;
  const dialog = $('photo-dialog');
  function render() {
    const photo = items[current];
    $('gallery-image').src = base + photo.file + '.webp';
    $('gallery-image').alt = photo.alt;
    $('gallery-category').textContent = photo.category;
    $('gallery-title').textContent = photo.title;
    $('gallery-count').textContent = `${String(current + 1).padStart(2, '0')} / ${items.length}`;
    $('gallery-expand').setAttribute('aria-label', `View ${photo.title} in fullscreen`);
    for (const [i, button] of [...$('gallery-thumbnails').children].entries()) {
      button.setAttribute('aria-pressed', String(i === current));
    }
    if (dialog.open) renderDialog();
  }
  function renderDialog() {
    const photo = items[current];
    $('dialog-image').src = base + photo.file + '.webp';
    $('dialog-image').alt = photo.alt;
    $('dialog-caption').textContent = photo.title;
    $('dialog-count').textContent = `${current + 1} / ${items.length}`;
  }
  function move(delta) {
    current = (current + delta + items.length) % items.length;
    render();
    const thumb = $('gallery-thumbnails').children[current];
    const strip = $('gallery-thumbnails');
    strip.scrollTo({left: thumb.offsetLeft - strip.offsetLeft - strip.clientWidth / 2 + thumb.clientWidth / 2, behavior: reduced.matches ? 'instant' : 'smooth'});
  }
  function thumbnails() {
    $('gallery-thumbnails').replaceChildren(...items.map((photo, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', photo.title);
      const image = document.createElement('img');
      image.src = base + photo.file + '-thumb.webp';
      image.alt = '';
      image.loading = 'lazy';
      image.width = 120; image.height = 85;
      button.append(image);
      button.addEventListener('click', () => { current = i; render(); });
      return button;
    }));
    $('gallery-thumbnails').scrollLeft = 0;
    render();
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    items = factoryPhotos.filter(photo => button.dataset.filter === 'All' || photo.category === button.dataset.filter);
    current = 0;
    thumbnails();
  }));
  $('gallery-prev').addEventListener('click', () => move(-1));
  $('gallery-next').addEventListener('click', () => move(1));
  $('dialog-prev').addEventListener('click', () => move(-1));
  $('dialog-next').addEventListener('click', () => move(1));
  $('gallery-expand').addEventListener('click', () => { dialog.showModal(); renderDialog(); });
  $('dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
  });
  let touchStart = null;
  $('gallery-image').addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, {passive:true});
  $('gallery-image').addEventListener('touchend', e => {
    if (touchStart === null) return;
    const delta = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(delta) > 55) move(delta > 0 ? -1 : 1);
    touchStart = null;
  }, {passive:true});
  thumbnails();
})();
const fullFilm = document.getElementById('factory-video');
const fullFilmButton = document.getElementById('film-play');
fullFilmButton.addEventListener('click', async () => {
  if (!fullFilm.paused) { fullFilm.pause(); return; }
  try { await fullFilm.play(); }
  catch { fullFilmButton.textContent = 'Unable to play — use the video controls to retry'; }
});
fullFilm.addEventListener('play', () => { fullFilmButton.textContent = 'Pause film'; });
fullFilm.addEventListener('pause', () => { fullFilmButton.textContent = '▶ Play full film · 33 sec'; });
