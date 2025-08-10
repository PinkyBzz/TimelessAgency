// Timeless site JS: nav toggle, reveal on scroll, dynamic links
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // Mobile nav toggle
  const navToggle = $('#nav-toggle');
  const menu = $('#menu');
  const backdrop = $('#nav-backdrop');
  if(navToggle && menu){
    const setOpen = (open) => {
      menu.classList.toggle('open', open);
      navToggle.classList.toggle('active', open);
      navToggle.setAttribute('aria-expanded', String(open));
      if(backdrop){
        backdrop.classList.toggle('show', open);
        backdrop.toggleAttribute('hidden', !open);
      }
      document.body.classList.toggle('nav-open', open);
    };
    navToggle.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
    if(backdrop){ backdrop.addEventListener('click', () => setOpen(false)); }
  }

  // Brand logo fallback loader (handles both filename variants and legacy ones)
  const brandLogos = $$('.brand-logo');
  if (brandLogos.length) {
    const candidates = [
      'timelessbackground.jpeg', // nama yang diinginkan (baru)
      'timelessagencybackground.jpeg', // nama lama
      'timelessagencybackgground.jpeg', // kemungkinan salah ketik
      'timeless.png',
      'timeless,.png'
    ];
    brandLogos.forEach(img => {
      let i = 0;
      const tryNext = () => {
        if (i >= candidates.length) return;
        const src = candidates[i++];
        if (img.getAttribute('src') !== src) img.src = src;
      };
      img.addEventListener('error', tryNext);
      // Force start from first candidate to ensure consistent look
      tryNext();
    });
  }

  // Smooth reveal on scroll
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('is-visible');
        observer.unobserve(e.target);
      }
    })
  },{threshold: .12});
  $$('.reveal').forEach(el=>observer.observe(el));

  // Year footer
  const yearEl = document.getElementById('year');
  if(yearEl){ yearEl.textContent = new Date().getFullYear(); }

  // Contact links (update phone and username as needed)
  const PHONE = '6285183565910'; // Nomor WhatsApp tujuan (format internasional, tanpa +)
  const IG = 'username_anda'; // TODO: ganti dengan username Instagram Anda
  const EMAIL = 'timelessgacor25@gmail.com'; // Alamat email tujuan

  function buildWaLink(text){
    const msg = encodeURIComponent(text || 'Halo Timeless, saya tertarik dengan layanan Anda.');
    const ua = navigator.userAgent || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    // On desktop, go straight to web.whatsapp.com to avoid api.whatsapp.com blocks
    if(!isMobile){
      return `https://web.whatsapp.com/send?phone=${PHONE}&text=${msg}&app_absent=0`;
    }
    // On mobile, wa.me is the most reliable universal link
    return `https://wa.me/${PHONE}?text=${msg}&app_absent=0`;
  }
  function buildIgLink(){
    return `https://instagram.com/${IG}`;
  }

  const waButtons = ['#cta-wa', '#cta-wa-2', '#footer-wa', '#wa-hero', '#wa-contact']
    .map(sel=>$(sel)).filter(Boolean);
  waButtons.forEach(btn=>{
    btn.setAttribute('href', buildWaLink());
    btn.setAttribute('target','_blank');
    btn.setAttribute('rel','noopener');
  });

  const igButtons = ['#cta-ig', '#footer-ig', '#ig-contact']
    .map(sel=>$(sel)).filter(Boolean);
  igButtons.forEach(btn=>{
    btn.setAttribute('href', buildIgLink());
    btn.setAttribute('target','_blank');
    btn.setAttribute('rel','noopener');
  });

  // Direct email links
  function buildMailto(subject, body){
    const sub = encodeURIComponent(subject || 'Brief Layanan Timeless');
    const bod = encodeURIComponent(body || 'Halo Timeless, saya ingin mendiskusikan kebutuhan saya.');
    return `mailto:${EMAIL}?subject=${sub}&body=${bod}`;
  }
  const emailLinks = ['#email-direct', '#footer-email']
    .map(sel=>$(sel)).filter(Boolean);
  emailLinks.forEach(a => {
    a.setAttribute('href', buildMailto());
  });

  // Gallery lazy loader (reads data-src to support future assets)
  const lazyImgs = $$('img[data-src]');
  if(lazyImgs.length){
    const lazyObs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const img = e.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          lazyObs.unobserve(img);
        }
      })
    },{rootMargin:'200px'});
    lazyImgs.forEach(img=>lazyObs.observe(img));
  }
})();
