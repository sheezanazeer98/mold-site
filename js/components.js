/**
 * ClearMend — Shared UI components
 * Renders the site-wide header, footer and icon library.
 * Driven entirely by window.SITE_CONFIG.
 */
(function () {
  const C = window.SITE_CONFIG;

  /* --------------------------------------------------------------
     Inline SVG logo mark — a clean shield cradling a water drop
     and a curving air-flow ribbon. Cyan → emerald gradient.
  ----------------------------------------------------------------*/
  const LOGO_MARK = (size = 36) => `
    <svg viewBox="0 0 48 48" width="${size}" height="${size}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="cm-grad" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#22d3ee"/>
          <stop offset="0.5" stop-color="#06b6d4"/>
          <stop offset="1" stop-color="#10b981"/>
        </linearGradient>
      </defs>
      <path d="M24 3 7 9v12.5c0 10.3 7.6 18.7 17 21.5 9.4-2.8 17-11.2 17-21.5V9L24 3Z"
            stroke="url(#cm-grad)" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M24 14c-3.6 4.2-6 7.5-6 11a6 6 0 0 0 12 0c0-3.5-2.4-6.8-6-11Z"
            fill="url(#cm-grad)" opacity="0.92"/>
      <path d="M14 30c2.4 1.6 4.8 2 7 2s4.6-1.2 7-3.6c2.4-2.4 4.8-3.2 6-3"
            stroke="url(#cm-grad)" stroke-width="2" stroke-linecap="round"/>
    </svg>`;

  const LOGO_WORDMARK = `
    <span class="flex items-center gap-2.5">
      ${LOGO_MARK(34)}
      <span class="font-display text-[1.35rem] font-bold tracking-tight">
        <span class="text-ink-900">Clear</span><span class="text-gradient-primary">Mend</span>
      </span>
    </span>`;

  const LOGO_WORDMARK_LIGHT = `
    <span class="flex items-center gap-2.5">
      ${LOGO_MARK(34)}
      <span class="font-display text-[1.35rem] font-bold tracking-tight">
        <span class="text-white">Clear</span><span class="text-gradient-primary">Mend</span>
      </span>
    </span>`;

  /* --------------------------------------------------------------
     Icon set — mold / remediation / restoration themed
  ----------------------------------------------------------------*/
  const ICONS = {
    // utility
    phone:    '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>',
    email:    '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
    menu:     '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close:    '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
    mapPin:   '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    chevronRight: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
    arrowRight: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>',
    check:    '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>',

    // service icons — mold/remediation themed
    microscope:'<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M9 3h4l1 2v5h-6V5l1-2Z"/><path d="M8 10h7"/><path d="M11.5 10 13 16"/><path d="M7 16h10l1 4H6l1-4Z"/><path d="M9 16a4 4 0 1 1 8 0"/></svg>',
    shield:   '<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5 3.4 8.8 8 10 4.6-1.2 8-5 8-10V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    spore:    '<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><circle cx="5" cy="6" r="1.5"/><circle cx="19" cy="6" r="1.5"/><circle cx="4" cy="17" r="1.5"/><circle cx="20" cy="18" r="1.5"/><path d="M8.8 9.2 5.8 6.8"/><path d="m15.3 9 3-2.2"/><path d="M9 15 5.4 16.6"/><path d="m15.2 14.9 3.6 2"/></svg>',
    drop:     '<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 3c3.5 5 7 8 7 12a7 7 0 0 1-14 0c0-4 3.5-7 7-12Z"/><path d="M9 14a3 3 0 0 0 3 3"/></svg>',
    house:    '<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M3 11 12 4l9 7"/><path d="M5 10v9h14v-9"/><path d="M10 19v-5h4v5"/></svg>',
    air:      '<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 16h14a3 3 0 1 1-3 3"/><path d="M3 12h18"/></svg>',
    clock:    '<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    star:     '<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9L12 3Z"/></svg>',
    dollar:   '<svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M12 3v18"/><path d="M8 7.5C8 5.6 9.8 4 12 4s4 1.6 4 3.5c0 1.9-1.8 3.5-4 3.5s-4 1.6-4 3.5S9.8 18 12 18s4-1.6 4-3.5"/></svg>',

    // social
    facebook: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85V15.5H7.08v-3.47h3.05V9.43c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.42C19.61 23.03 24 18.06 24 12.07Z"/></svg>',
    instagram:'<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.26.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.15 3.22-1.67 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.64-.07 4.85-.07Zm0-2.16C8.74 0 8.33.01 7.05.07 2.69.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.71 21.31.28 16.95.07 15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32A6.16 6.16 0 0 0 12 5.84Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"/></svg>',
    google:   '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.19-1.78 4.13-1.15 1.15-2.94 2.4-6.06 2.4-4.83 0-8.6-3.9-8.6-8.72s3.77-8.72 8.6-8.72c2.6 0 4.5 1.03 5.9 2.35l2.31-2.31C18.75 1.44 16.13 0 12.48 0 5.87 0 .31 5.39.31 12s5.56 12 12.17 12c3.57 0 6.27-1.17 8.37-3.36 2.16-2.16 2.84-5.21 2.84-7.67 0-.76-.05-1.47-.17-2.05h-11.04Z"/></svg>',
    starFilled:'<svg class="w-5 h-5 text-accent-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.29a1 1 0 0 0 .95.69h3.46c.97 0 1.37 1.24.59 1.81l-2.8 2.03a1 1 0 0 0-.37 1.12l1.07 3.29c.3.92-.75 1.69-1.54 1.12l-2.8-2.03a1 1 0 0 0-1.18 0l-2.8 2.03c-.78.57-1.83-.2-1.54-1.12l1.07-3.29a1 1 0 0 0-.36-1.12L2.98 8.72c-.78-.57-.38-1.81.59-1.81h3.46a1 1 0 0 0 .95-.69l1.07-3.29Z"/></svg>',
  };

  window.getIcon = (name) => ICONS[name] || '';
  window.getLogoMark = LOGO_MARK;

  /* --------------------------------------------------------------
     Header — minimal, flat, solid, fast.
     No backdrop-blur, no announcement rotator, no sliding highlight,
     no scroll-driven style morph. Just a clean top bar.
  ----------------------------------------------------------------*/
  window.renderHeader = function (activePage) {
    const el = document.getElementById('site-header');
    if (!el) return;

    const navLinks = C.navigation.map(item => `
      <a href="${item.url}"
         data-nav="${item.id}"
         class="inline-flex items-center px-3 py-2 text-[0.94rem] font-medium transition-colors ${
           activePage === item.id
             ? 'text-primary-700'
             : 'text-ink-700 hover:text-ink-950'
         }">
        ${item.label}${activePage === item.id ? '<span class="ml-1.5 w-1 h-1 rounded-full bg-primary-500"></span>' : ''}
      </a>`).join('');

    const mobileLinks = C.navigation.map(item => `
      <a href="${item.url}"
         class="flex items-center justify-between px-5 py-4 text-base font-medium border-b border-ink-100 ${
           activePage === item.id
             ? 'text-primary-700 bg-primary-50/60'
             : 'text-ink-800 hover:text-primary-700'
         }">
        <span>${item.label}</span>
        ${ICONS.chevronRight}
      </a>`).join('');

    el.innerHTML = `
      <nav id="site-nav" class="sticky top-0 z-50 bg-white border-b border-ink-100">
        <div class="container-site">
          <div class="flex items-center justify-between h-16 lg:h-[74px]">

            <!-- Logo -->
            <a href="/" class="flex items-center gap-2.5" aria-label="${C.companyName} home">
              ${LOGO_MARK(32)}
              <span class="font-display text-[1.28rem] font-bold tracking-tight leading-none">
                <span class="text-ink-950">Clear</span><span class="text-gradient-primary">Mend</span>
              </span>
            </a>

            <!-- Center nav -->
            <div class="hidden lg:flex items-center gap-6">
              ${navLinks}
            </div>

            <!-- Right cluster -->
            <div class="flex items-center gap-3">
              <a href="tel:${C.phoneRaw}" class="hidden md:inline-flex items-center gap-2 text-ink-800 hover:text-primary-700 text-sm font-semibold transition-colors">
                <span class="text-primary-600">${ICONS.phone.replace('w-5 h-5', 'w-4 h-4')}</span>
                <span class="tabular-nums">${C.phone}</span>
              </a>

              <a href="/contact" class="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white text-sm bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 transition-colors">
                Free Assessment
              </a>

              <button id="mobile-menu-btn" class="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-ink-900 hover:bg-ink-50 transition-colors" aria-label="Toggle menu" aria-expanded="false">
                <span id="menu-icon-open">${ICONS.menu}</span>
                <span id="menu-icon-close" class="hidden">${ICONS.close}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu -->
        <div id="mobile-menu" class="hidden lg:hidden border-t border-ink-100 bg-white">
          ${mobileLinks}
          <div class="p-5 space-y-3">
            <a href="tel:${C.phoneRaw}" class="btn-primary w-full">
              ${ICONS.phone}<span class="ml-2">Call ${C.phone}</span>
            </a>
            <a href="/contact" class="btn-outline w-full">Free Assessment</a>
          </div>
        </div>
      </nav>`;
  };

  /* --------------------------------------------------------------
     Footer
  ----------------------------------------------------------------*/
  window.renderFooter = function () {
    const el = document.getElementById('site-footer');
    if (!el) return;

    const quickLinks = C.navigation.map(item =>
      `<li><a href="${item.url}" class="text-ink-300 hover:text-white transition-colors">${item.label}</a></li>`
    ).join('');

    const serviceLinks = C.services.slice(0, 6).map(s =>
      `<li><a href="/services#${s.id}" class="text-ink-300 hover:text-white transition-colors">${s.title}</a></li>`
    ).join('');

    const topAreas = C.serviceAreas.slice(0, 8).map(area =>
      `<li class="text-ink-300">${area}</li>`
    ).join('');

    el.innerHTML = `
      <!-- CTA banner -->
      <section class="relative overflow-hidden bg-ink-950 text-white">
        <div class="absolute inset-0 bg-mesh-primary opacity-60"></div>
        <div class="absolute inset-0 bg-grid-dark mask-fade-b"></div>
        <div class="absolute -top-32 -left-32 w-[24rem] h-[24rem] bg-primary-500/25 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-32 -right-32 w-[24rem] h-[24rem] bg-accent-500/20 rounded-full blur-3xl"></div>

        <div class="container-site relative py-20 lg:py-24 text-center">
          <span class="eyebrow text-primary-300 mb-5 inline-flex">Your home, restored</span>
          <h2 class="heading-lg text-white mb-5 text-balance max-w-3xl mx-auto">
            Ready to breathe easier? Let's make your air <span class="text-gradient-primary">clear</span>.
          </h2>
          <p class="text-ink-200 text-lg mb-10 max-w-2xl mx-auto">
            Book a complimentary ClearMend assessment. Certified inspectors, transparent pricing, and a written scope of work — fast.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:${C.phoneRaw}" class="btn-primary text-base !px-8 !py-4">
              ${ICONS.phone}<span class="ml-2">Call ${C.phone}</span>
            </a>
            <a href="/contact" class="btn-ghost text-base !px-8 !py-4">
              Request Free Assessment
            </a>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-ink-950 text-white border-t border-white/5">
        <div class="container-site py-16 lg:py-20">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <a href="/" class="inline-flex items-center gap-2.5 mb-5">
                ${LOGO_WORDMARK_LIGHT}
              </a>
              <p class="text-ink-300 text-sm leading-relaxed mb-6 max-w-xs">${C.description}</p>
              <div class="flex gap-3">
                <a href="${C.social.facebook}" aria-label="Facebook"  class="w-10 h-10 bg-white/5 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors border border-white/10">${ICONS.facebook}</a>
                <a href="${C.social.instagram}" aria-label="Instagram" class="w-10 h-10 bg-white/5 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors border border-white/10">${ICONS.instagram}</a>
                <a href="${C.social.google}" aria-label="Google" class="w-10 h-10 bg-white/5 hover:bg-primary-500 rounded-full flex items-center justify-center transition-colors border border-white/10">${ICONS.google}</a>
              </div>
            </div>

            <div>
              <h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300 mb-5">Explore</h3>
              <ul class="space-y-3 text-sm">${quickLinks}</ul>
            </div>

            <div>
              <h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300 mb-5">Services</h3>
              <ul class="space-y-3 text-sm">${serviceLinks}</ul>
            </div>

            <div>
              <h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300 mb-5">Contact</h3>
              <ul class="space-y-3 text-sm">
                <li><a href="tel:${C.phoneRaw}" class="flex items-center gap-2 text-ink-300 hover:text-white transition-colors">${ICONS.phone}<span>${C.phone}</span></a></li>
                <li><a href="mailto:${C.email}" class="flex items-center gap-2 text-ink-300 hover:text-white transition-colors">${ICONS.email}<span>${C.email}</span></a></li>
                <li class="flex items-start gap-2 text-ink-300">${ICONS.mapPin}<span>${C.address}</span></li>
              </ul>
              <h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-primary-300 mt-7 mb-4">Top Areas</h3>
              <ul class="grid grid-cols-2 gap-1.5 text-sm">${topAreas}</ul>
            </div>
          </div>
        </div>

        <div class="border-t border-white/5">
          <div class="container-site py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-ink-400">
            <p>&copy; ${new Date().getFullYear()} ${C.companyName}. All rights reserved.</p>
            <div class="flex items-center gap-5">
              <span class="inline-flex items-center gap-2">${getIcon('shield')}<span>${C.license}</span></span>
            </div>
          </div>
        </div>
      </footer>`;
  };

  /* --------------------------------------------------------------
     Star rating helper
  ----------------------------------------------------------------*/
  window.renderStars = function (count) {
    return Array(count).fill(ICONS.starFilled).join('');
  };
})();
