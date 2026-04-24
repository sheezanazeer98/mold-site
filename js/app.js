/**
 * ClearMend — Single Page Application
 * Client-side router, page initializers, GSAP reveal, canvas hero.
 */
(function () {
  'use strict';

  var C = window.SITE_CONFIG;
  var appEl = document.getElementById('app');
  var currentRoute = null;
  var currentParams = {};

  // =========================================================
  // CACHES
  // =========================================================
  var postsCache = null;
  var postContentCache = {};

  // =========================================================
  // ROUTES
  // =========================================================
  var ROUTES = [
    { id: 'home',          path: '/',              nav: 'home',          title: 'ClearMend | Certified Mold Remediation & Indoor Air Restoration',                                                   desc: 'ClearMend delivers certified mold remediation, inspection, and indoor air restoration. Black mold removal, water damage, HVAC sanitizing. Call (888) 744-6636.' },
    { id: 'about',         path: '/about',         nav: 'about',         title: 'About ClearMend | Certified Mold Remediation Experts',                                                              desc: 'Learn about ClearMend — an IICRC-certified mold remediation company restoring healthy indoor air with documented, lab-verified workflows.' },
    { id: 'services',      path: '/services',      nav: 'services',      title: 'Mold Remediation & Indoor Air Services | ClearMend',                                                                desc: 'Mold inspection, remediation, black mold removal, water damage restoration, HVAC sanitizing, and indoor air quality testing from ClearMend.' },
    { id: 'service-areas', path: '/service-areas', nav: 'service-areas', title: 'Service Areas | ClearMend Mold Remediation',                                                                        desc: 'ClearMend serves Scranton, Wilkes-Barre, Stroudsburg, the Pocono Mountains, and all of Northeastern Pennsylvania. Call (888) 744-6636.' },
    { id: 'contact',       path: '/contact',       nav: 'contact',       title: 'Contact ClearMend | Free Mold Assessment',                                                                          desc: 'Contact ClearMend for a free mold assessment. Call (888) 744-6636 or fill out our online form. Serving homes and businesses across NEPA.' },
    { id: 'blog',          path: '/blog',          nav: 'blog',          title: 'Insights | ClearMend',                                                                                              desc: 'Guides on mold prevention, indoor air quality, moisture control, and healthy homes — published by the ClearMend field team.' },
    { id: 'blog-post',     path: '/blog/:slug',    nav: 'blog',          title: 'Article | ClearMend',                                                                                               desc: 'Read the latest mold remediation and indoor air quality insights from ClearMend.' },
  ];

  // =========================================================
  // UTILITIES
  // =========================================================
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function normalizeImageSrc(src) {
    if (!src || typeof src !== 'string') return '';
    src = src.trim();
    if (!src || src === '""' || src === "''") return '';
    if (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:')) return src;
    return '/' + src;
  }

  function normalizePath(path) {
    path = path.split('?')[0].split('#')[0];
    path = path.replace(/\.html$/, '');
    if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1);
    if (path === '' || path === '/index') path = '/';
    return path;
  }

  function getHash(url) {
    var idx = url.indexOf('#');
    return idx !== -1 ? url.substring(idx) : '';
  }

  function matchRoute(path) {
    var normalized = normalizePath(path);
    for (var i = 0; i < ROUTES.length; i++) {
      if (ROUTES[i].path === normalized) return { route: ROUTES[i], params: {} };
    }
    var blogMatch = normalized.match(/^\/blog\/([a-z0-9][a-z0-9-]*)$/);
    if (blogMatch) return { route: ROUTES[ROUTES.length - 1], params: { slug: blogMatch[1] } };
    return null;
  }

  // =========================================================
  // SEO
  // =========================================================
  function updateMeta(route, params) {
    document.title = route.title;

    var setMeta = function (sel, attr, val) {
      var el = document.querySelector(sel);
      if (el) el.setAttribute(attr, val);
    };

    var canonical = C.seo.siteUrl + (route.id === 'blog-post' ? '/blog/' + params.slug : route.path);
    setMeta('meta[name="description"]', 'content', route.desc);
    setMeta('link[rel="canonical"]', 'href', canonical);
    setMeta('meta[property="og:title"]', 'content', route.title);
    setMeta('meta[property="og:description"]', 'content', route.desc);
    setMeta('meta[property="og:url"]', 'content', canonical);
    setMeta('meta[property="og:image"]', 'content', C.seo.siteUrl + C.seo.ogImage);
    setMeta('meta[name="twitter:title"]', 'content', route.title);
    setMeta('meta[name="twitter:description"]', 'content', route.desc);
    setMeta('meta[name="twitter:image"]', 'content', C.seo.siteUrl + C.seo.ogImage);
  }

  // =========================================================
  // NAVIGATION
  // =========================================================
  function navigate(url, push) {
    var hash = getHash(url);
    var path = url.split('#')[0];
    var match = matchRoute(path);

    if (!match) { match = { route: ROUTES[0], params: {} }; path = '/'; }

    var route = match.route;
    var params = match.params;
    var isSamePage = currentRoute && currentRoute.id === route.id &&
      JSON.stringify(currentParams) === JSON.stringify(params);

    if (!isSamePage) {
      destroyHeroCanvas();
      var tmpl = document.getElementById('page-' + route.id);
      if (tmpl) {
        appEl.innerHTML = '';
        appEl.appendChild(tmpl.content.cloneNode(true));
        var firstChild = appEl.firstElementChild;
        if (firstChild) firstChild.classList.add('page-enter');
      }

      renderHeader(route.nav);
      updateMeta(route, params);

      currentRoute = route;
      currentParams = params;

      var initFn = PAGE_INITS[route.id];
      if (initFn) initFn(params);

      refreshAnimations();
      runGsapReveals();

      if (!hash) window.scrollTo(0, 0);
    }

    if (push !== false) {
      var cleanPath = route.id === 'blog-post' ? '/blog/' + params.slug : route.path;
      history.pushState({ path: cleanPath + hash }, '', cleanPath + hash);
    }

    if (hash) {
      setTimeout(function () {
        var target = document.querySelector(hash);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  }

  // =========================================================
  // LINK INTERCEPTION
  // =========================================================
  function shouldIntercept(anchor) {
    if (!anchor || !anchor.href) return false;
    if (anchor.target === '_blank') return false;
    if (anchor.hasAttribute('download')) return false;
    var href = anchor.getAttribute('href');
    if (!href || href.startsWith('#')) return false;
    if (href.startsWith('tel:') || href.startsWith('mailto:')) return false;
    if (href.startsWith('http') && !href.startsWith(location.origin)) return false;
    if (href.startsWith('/admin')) return false;
    return true;
  }

  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a');
    if (!anchor) return;

    var href = anchor.getAttribute('href');
    if (href && href.startsWith('#')) {
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    if (!shouldIntercept(anchor)) return;

    e.preventDefault();
    navigate(anchor.getAttribute('href'), true);
  });

  window.addEventListener('popstate', function () {
    navigate(location.pathname + location.hash, false);
  });

  // =========================================================
  // PAGE INITIALIZERS
  // =========================================================
  var PAGE_INITS = {};

  // ---------- HOME ----------
  PAGE_INITS.home = function () {
    initHeroCountUps();
    initHeroGauge();
    initHeroBars();
    initHeroUnderline();

    // trust / stats strip
    var badgesGrid = document.getElementById('trust-badges');
    if (badgesGrid) {
      badgesGrid.innerHTML = C.trustBadges.map(function (b) {
        return ''
          + '<div class="group flex items-start gap-4 py-8 px-6 hover:bg-ink-50/60 transition-colors cursor-default">'
            + '<div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 border border-primary-500/15 flex items-center justify-center text-primary-700 shrink-0 group-hover:scale-105 transition-transform duration-300">' + getIcon(b.icon) + '</div>'
            + '<div><h3 class="font-bold text-ink-900 text-sm">' + b.title + '</h3>'
              + '<p class="text-ink-500 text-xs mt-1 leading-relaxed">' + b.text + '</p></div>'
          + '</div>';
      }).join('');
    }

    // Hero stars
    var heroStars = document.getElementById('hero-stars');
    if (heroStars) heroStars.innerHTML = renderStars(5);

    // Services bento — mixed tile sizes
    var bento = document.getElementById('services-bento');
    if (bento) {
      bento.innerHTML = C.services.map(function (s, i) {
        // Layout: first two are wider
        var span = (i === 0 ? 'lg:col-span-4' : i === 1 ? 'lg:col-span-2' : i === 2 ? 'lg:col-span-2' : i === 3 ? 'lg:col-span-2' : i === 4 ? 'lg:col-span-2' : 'lg:col-span-4');
        var wrapClass = 'reveal relative group bg-white border border-ink-100 rounded-3xl p-7 hover:border-primary-300 transition-all duration-500 overflow-hidden ' + span;
        return ''
          + '<a href="/services#' + s.id + '" class="' + wrapClass + '">'
            + '<div class="absolute -top-8 -right-8 w-40 h-40 bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>'
            + '<div class="relative">'
              + '<div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white mb-5 shadow-glow-primary group-hover:-translate-y-1 transition-transform">' + getIcon(s.icon) + '</div>'
              + '<h3 class="font-display text-xl font-bold text-ink-900 mb-2">' + s.title + '</h3>'
              + '<p class="text-ink-600 text-sm leading-relaxed mb-5 line-clamp-3">' + s.description.slice(0, 140) + '...</p>'
              + '<span class="inline-flex items-center gap-1.5 text-primary-700 text-sm font-semibold group-hover:gap-2.5 transition-all">Learn more ' + getIcon('arrowRight') + '</span>'
            + '</div>'
          + '</a>';
      }).join('');
    }

    // Stats grid (in about section)
    var statsGrid = document.getElementById('home-stats');
    if (statsGrid) {
      statsGrid.innerHTML = C.stats.map(function (s) {
        return ''
          + '<div class="glass p-5 text-center">'
            + '<p class="font-display text-3xl font-bold text-gradient-primary">' + s.value + '</p>'
            + '<p class="text-ink-200 text-xs mt-1 uppercase tracking-[0.15em]">' + s.label + '</p>'
          + '</div>';
      }).join('');
    }

    // Process timeline
    var process = document.getElementById('process-steps');
    if (process) {
      process.innerHTML = C.processSteps.map(function (p, i) {
        return ''
          + '<div class="reveal relative bg-white border border-ink-100 rounded-3xl p-8 hover:shadow-premium transition-all duration-500 group">'
            + '<div class="absolute -top-5 left-8 w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-display font-bold shadow-glow-primary">' + (i + 1) + '</div>'
            + '<h3 class="font-display text-xl font-bold text-ink-900 mt-5 mb-3">' + p.title + '</h3>'
            + '<p class="text-ink-600 text-sm leading-relaxed">' + p.text + '</p>'
          + '</div>';
      }).join('');
    }

    // Testimonials
    var testiStars = document.getElementById('testimonial-summary-stars');
    if (testiStars) testiStars.innerHTML = renderStars(5);

    var testimonialsGrid = document.getElementById('testimonials-grid');
    if (testimonialsGrid) {
      testimonialsGrid.innerHTML = C.testimonials.map(function (t) {
        return ''
          + '<div class="reveal bg-white rounded-3xl p-7 border border-ink-100 shadow-sm hover:shadow-premium transition-all duration-500">'
            + '<div class="flex gap-0.5 mb-4">' + renderStars(t.rating) + '</div>'
            + '<p class="text-ink-700 leading-relaxed mb-6">"' + t.text + '"</p>'
            + '<div class="flex items-center gap-3 pt-5 border-t border-ink-100">'
              + '<div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-bold text-sm">' + t.name.charAt(0) + '</div>'
              + '<div><p class="font-semibold text-ink-900 text-sm">' + t.name + '</p>'
                + '<p class="text-ink-500 text-xs">' + t.location + '</p></div>'
            + '</div>'
          + '</div>';
      }).join('');
    }

    // Areas preview
    var areasPreview = document.getElementById('areas-preview');
    if (areasPreview) {
      areasPreview.innerHTML = C.serviceAreas.slice(0, 18).map(function (area) {
        return '<span class="reveal inline-flex items-center gap-1.5 px-4 py-2 bg-white rounded-full text-sm font-medium text-ink-700 border border-ink-200 hover:border-primary-400 hover:text-primary-700 transition-colors cursor-default">'
          + '<span class="w-1.5 h-1.5 rounded-full bg-accent-400"></span>' + area + '</span>';
      }).join('');
    }

    // Recent posts
    var recentPosts = document.getElementById('recent-posts');
    if (recentPosts) {
      fetchPosts().then(function (posts) {
        var recent = posts.slice(0, 3);
        if (recent.length === 0) {
          recentPosts.innerHTML = '<p class="text-ink-500 text-center col-span-3">Articles coming soon.</p>';
          return;
        }
        recentPosts.innerHTML = recent.map(function (p) {
          var date = new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          var imgSrc = normalizeImageSrc(p.image) || '/images/blog-thumbnail.jpg';
          return ''
            + '<article class="reveal group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:shadow-premium transition-all duration-500">'
              + '<a href="/blog/' + p.slug + '">'
                + '<div class="aspect-[16/10] overflow-hidden bg-ink-100">'
                  + '<img src="' + imgSrc + '" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" onerror="this.src=\'/images/blog-thumbnail.jpg\'">'
                + '</div>'
                + '<div class="p-6">'
                  + '<time class="text-xs text-primary-700 font-semibold uppercase tracking-[0.18em]">' + date + '</time>'
                  + '<h3 class="font-display text-lg font-bold text-ink-900 mt-2 mb-2 group-hover:text-primary-700 transition-colors">' + p.title + '</h3>'
                  + '<p class="text-ink-600 text-sm line-clamp-2">' + (p.excerpt || '') + '</p>'
                + '</div>'
              + '</a>'
            + '</article>';
        }).join('');
        // Async inject: runGsapReveals already ran before fetch resolved — observe these cards now
        observeRevealElements(recentPosts);
      }).catch(function () {
        recentPosts.innerHTML = '<p class="text-ink-500 text-center col-span-3">Articles coming soon.</p>';
      });
    }
  };

  // ---------- ABOUT ----------
  PAGE_INITS.about = function () {
    var values = [
      { icon: 'microscope', title: 'Lab-verified, not guessed.', text: 'Every project concludes with third-party clearance testing — not a visual inspection.' },
      { icon: 'shield',     title: 'IICRC S520 every time.',     text: 'We follow the industry-standard remediation protocol down to containment pressure.' },
      { icon: 'clock',      title: '24/7 emergency response.',    text: 'Water damage doesn\'t keep business hours. Neither do we.' },
      { icon: 'drop',       title: 'Moisture first, always.',      text: 'Mold is a symptom of water. We locate and correct the source before remediation.' },
      { icon: 'house',      title: 'Kid-and-pet-safe protocols.',  text: 'Containment and EPA-approved products keep everyone else in the home protected.' },
      { icon: 'dollar',     title: 'Insurance handled for you.',   text: 'We document, bill, and coordinate with insurers — so you don\'t have to chase paperwork.' },
    ];
    var valuesGrid = document.getElementById('about-values');
    if (valuesGrid) {
      valuesGrid.innerHTML = values.map(function (v) {
        return ''
          + '<div class="reveal group bg-white rounded-3xl p-8 border border-ink-100 hover:shadow-premium hover:-translate-y-1 transition-all duration-500">'
            + '<div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white mb-5 shadow-glow-primary">' + getIcon(v.icon) + '</div>'
            + '<h3 class="font-display text-lg font-bold text-ink-900 mb-2">' + v.title + '</h3>'
            + '<p class="text-ink-600 text-sm leading-relaxed">' + v.text + '</p>'
          + '</div>';
      }).join('');
    }
  };

  // ---------- SERVICES ----------
  PAGE_INITS.services = function () {
    var container = document.getElementById('services-detail');
    if (container) {
      var imageMap = {
        'mold-inspection':   'service-mold-inspection.jpg',
        'mold-remediation':  'service-remediation.jpg',
        'black-mold-removal':'service-black-mold.jpg',
        'water-damage':      'service-water-damage.jpg',
        'attic-crawlspace':  'service-attic.jpg',
        'hvac-air-quality':  'service-hvac.jpg',
      };

      container.innerHTML = C.services.map(function (s, i) {
        var imageRight = i % 2 === 0;
        var features = s.features.map(function (f) {
          return '<li class="flex items-start gap-3">'
            + '<div class="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 mt-0.5">'
              + '<svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.8" d="M5 13l4 4L19 7"/></svg>'
            + '</div>'
            + '<span class="text-ink-700">' + f + '</span></li>';
        }).join('');

        var imgSrc = '/images/' + (imageMap[s.id] || 'service-mold-inspection.jpg');

        var textOrderLg = imageRight ? 'lg:order-1' : 'lg:order-2';
        var imgOrderLg  = imageRight ? 'lg:order-2' : 'lg:order-1';

        var text = ''
          + '<div class="order-1 ' + textOrderLg + '">'
            + '<div class="inline-flex items-center gap-2 text-primary-700 text-xs font-semibold uppercase tracking-[0.2em] mb-3">'
              + '<span class="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center text-[0.7rem] font-bold">' + (i + 1) + '</span>'
              + s.title
            + '</div>'
            + '<h2 class="font-display text-3xl lg:text-4xl font-bold text-ink-900 mb-4 text-balance">' + s.title + '</h2>'
            + '<p class="text-ink-600 text-lg leading-relaxed mb-6">' + s.description + '</p>'
            + '<ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">' + features + '</ul>'
            + '<div class="flex flex-col sm:flex-row gap-3">'
              + '<a href="/contact" class="btn-primary">Request this service</a>'
              + '<a href="tel:' + C.phoneRaw + '" class="btn-outline">Call ' + C.phone + '</a>'
            + '</div>'
          + '</div>';

        var image = ''
          + '<div class="order-2 ' + imgOrderLg + '">'
            + '<div class="relative rounded-3xl overflow-hidden shadow-premium border border-ink-100">'
              + '<img src="' + imgSrc + '" alt="' + escapeHtml(s.title) + '" class="w-full h-72 sm:h-96 lg:h-[30rem] object-cover transition-transform duration-700 hover:scale-105" loading="lazy">'
              + '<div class="absolute inset-0 bg-gradient-to-t from-ink-950/50 via-transparent to-transparent"></div>'
              + '<div class="absolute bottom-4 left-4 right-4">'
                + '<div class="inline-flex items-center gap-2 glass-light text-primary-800 text-sm font-semibold px-4 py-2 rounded-full">'
                  + getIcon(s.icon).replace('w-7 h-7', 'w-4 h-4') + '<span>' + s.title + '</span>'
                + '</div>'
              + '</div>'
            + '</div>'
          + '</div>';

        return ''
          + '<div id="' + s.id + '" class="scroll-mt-24 py-8 lg:py-12" data-animate>'
            + '<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">'
              + text + image
            + '</div>'
          + '</div>';
      }).join('');
    }

    // Dark process strip
    var process = document.getElementById('process-steps-dark');
    if (process) {
      process.innerHTML = C.processSteps.map(function (p, i) {
        var connector = i < C.processSteps.length - 1
          ? '<div class="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 text-primary-400/70"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></div>'
          : '';
        return ''
          + '<div class="relative glass p-8 text-center group hover:-translate-y-1 transition-transform duration-500">'
            + '<div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center font-display text-xl font-bold mx-auto mb-5 shadow-glow-primary">' + (i + 1) + '</div>'
            + '<h3 class="font-display text-lg font-bold text-white mb-2">' + p.title + '</h3>'
            + '<p class="text-ink-300 text-sm leading-relaxed">' + p.text + '</p>'
            + connector
          + '</div>';
      }).join('');
    }
  };

  // ---------- SERVICE AREAS ----------
  PAGE_INITS['service-areas'] = function () {
    var areasGrid = document.getElementById('areas-grid');
    if (areasGrid) {
      areasGrid.innerHTML = C.serviceAreas.map(function (area) {
        return ''
          + '<div class="reveal bg-white rounded-2xl p-4 text-center hover:bg-primary-50 border border-ink-100 hover:border-primary-300 transition-colors group">'
            + '<div class="flex items-center justify-center gap-2">'
              + '<svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>'
              + '<span class="font-medium text-ink-700 group-hover:text-primary-700">' + area + '</span>'
            + '</div>'
          + '</div>';
      }).join('');
    }

    var mapContainer = document.getElementById('service-areas-map');
    if (mapContainer) {
      mapContainer.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d384828.65!2d-75.85!3d41.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c4d2f9f9fafcf3%3A0x93eb0c3c1e22b4dc!2sNortheastern%20Pennsylvania!5e0!3m2!1sen!2sus!4v1" width="100%" height="440" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="ClearMend service area map"></iframe>';
    }

    var servicesMini = document.getElementById('services-mini');
    if (servicesMini) {
      servicesMini.innerHTML = C.services.map(function (s) {
        return ''
          + '<a href="/services#' + s.id + '" class="reveal bg-white rounded-2xl p-5 text-center hover:bg-primary-50 border border-ink-100 hover:border-primary-300 transition-colors group">'
            + '<div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center">' + getIcon(s.icon) + '</div>'
            + '<span class="text-sm font-medium text-ink-700 group-hover:text-primary-700">' + s.title + '</span>'
          + '</a>';
      }).join('');
    }
  };

  // ---------- CONTACT ----------
  PAGE_INITS.contact = function () {
    var select = document.getElementById('service');
    if (select) {
      C.services.forEach(function (s) {
        var opt = document.createElement('option');
        opt.value = s.title;
        opt.textContent = s.title;
        select.appendChild(opt);
      });
    }

    var mapContainer = document.getElementById('contact-map');
    if (mapContainer) {
      mapContainer.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d384828.65!2d-75.85!3d41.35!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c4d2f9f9fafcf3%3A0x93eb0c3c1e22b4dc!2sNortheastern%20Pennsylvania!5e0!3m2!1sen!2sus!4v1" width="100%" height="220" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="ClearMend service area map"></iframe>';
    }

    initContactForm();
  };

  // ---------- BLOG LISTING ----------
  var blogCurrentPage = 1;
  var POSTS_PER_PAGE = 9;

  PAGE_INITS.blog = function () {
    blogCurrentPage = 1;
    var grid = document.getElementById('blog-grid');
    if (!grid) return;

    fetchPosts().then(function (posts) {
      var loading = document.getElementById('blog-loading');
      var empty = document.getElementById('blog-empty');
      if (loading) loading.classList.add('hidden');
      if (posts.length === 0) { if (empty) empty.classList.remove('hidden'); return; }
      renderBlogPage(1);
    }).catch(function () {
      var loading = document.getElementById('blog-loading');
      var empty = document.getElementById('blog-empty');
      if (loading) loading.classList.add('hidden');
      if (empty) {
        empty.classList.remove('hidden');
        empty.innerHTML = '<p class="text-ink-500 text-lg">Articles coming soon. Check back later.</p>';
      }
    });
  };

  function renderBlogPage(page) {
    blogCurrentPage = page;
    var grid = document.getElementById('blog-grid');
    if (!grid || !postsCache) return;

    var start = (page - 1) * POSTS_PER_PAGE;
    var pagePosts = postsCache.slice(start, start + POSTS_PER_PAGE);

    grid.innerHTML = pagePosts.map(function (post) {
      var date = new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      var postImgSrc = normalizeImageSrc(post.image) || '/images/blog-thumbnail.jpg';
      return ''
        + '<article class="reveal group bg-white rounded-3xl overflow-hidden border border-ink-100 hover:shadow-premium transition-all duration-500">'
          + '<a href="/blog/' + post.slug + '">'
            + '<div class="aspect-[16/10] overflow-hidden bg-ink-100">'
              + '<img src="' + postImgSrc + '" alt="' + escapeHtml(post.title) + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" onerror="this.src=\'/images/blog-thumbnail.jpg\'">'
            + '</div>'
            + '<div class="p-7">'
              + '<time class="text-xs text-primary-700 font-semibold uppercase tracking-[0.18em]">' + date + '</time>'
              + '<h3 class="font-display text-lg font-bold text-ink-900 mt-2 mb-2 group-hover:text-primary-700 transition-colors">' + escapeHtml(post.title) + '</h3>'
              + '<p class="text-ink-600 text-sm line-clamp-3">' + escapeHtml(post.excerpt || '') + '</p>'
              + '<span class="inline-flex items-center gap-1.5 text-primary-700 text-sm font-semibold mt-5 group-hover:gap-2.5 transition-all">Read article ' + getIcon('arrowRight') + '</span>'
            + '</div>'
          + '</a>'
        + '</article>';
    }).join('');

    renderBlogPagination();
    runGsapReveals();
  }

  function renderBlogPagination() {
    var container = document.getElementById('blog-pagination');
    if (!container || !postsCache) return;

    var totalPages = Math.ceil(postsCache.length / POSTS_PER_PAGE);
    if (totalPages <= 1) { container.innerHTML = ''; return; }

    var html = '<div class="flex items-center justify-center gap-2">';
    if (blogCurrentPage > 1) {
      html += '<button class="px-4 py-2 rounded-full border border-ink-200 text-ink-700 hover:bg-ink-50 transition-colors" data-blog-page="' + (blogCurrentPage - 1) + '">&larr; Previous</button>';
    }
    for (var i = 1; i <= totalPages; i++) {
      html += '<button class="w-10 h-10 rounded-full font-medium transition-colors ' +
        (i === blogCurrentPage ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow-primary' : 'border border-ink-200 text-ink-700 hover:bg-ink-50') +
        '" data-blog-page="' + i + '">' + i + '</button>';
    }
    if (blogCurrentPage < totalPages) {
      html += '<button class="px-4 py-2 rounded-full border border-ink-200 text-ink-700 hover:bg-ink-50 transition-colors" data-blog-page="' + (blogCurrentPage + 1) + '">Next &rarr;</button>';
    }
    html += '</div>';
    container.innerHTML = html;
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-blog-page]');
    if (!btn) return;
    var page = parseInt(btn.getAttribute('data-blog-page'), 10);
    renderBlogPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- BLOG POST ----------
  PAGE_INITS['blog-post'] = function (params) {
    var slug = params.slug;
    if (!slug) { showPostNotFound(); return; }

    Promise.all([
      loadMarked(),
      loadPostContent(slug),
      fetchPosts()
    ]).then(function (results) {
      var text = results[1];
      var posts = results[2];
      var parsed = parseFrontMatter(text);

      var postMeta = null;
      for (var i = 0; i < posts.length; i++) {
        if (posts[i].slug === slug) { postMeta = posts[i]; break; }
      }

      if (postMeta && postMeta.image && !parsed.data.image) {
        parsed.data.image = postMeta.image;
      }

      renderBlogPost(parsed.data, parsed.content, slug);
    }).catch(function () {
      showPostNotFound();
    });
  };

  function loadPostContent(slug) {
    if (postContentCache[slug]) return Promise.resolve(postContentCache[slug]);
    return fetch('/content/blog/' + slug + '.md')
      .then(function (res) { if (!res.ok) throw new Error('Post not found'); return res.text(); })
      .then(function (text) { postContentCache[slug] = text; return text; });
  }

  function parseFrontMatter(text) {
    var match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) return { data: {}, content: text };

    var data = {};
    match[1].split('\n').forEach(function (line) {
      if (line.match(/^\s*-\s/)) return;
      var colonIdx = line.indexOf(':');
      if (colonIdx === -1) return;
      var key = line.slice(0, colonIdx).trim();
      if (!key) return;
      var value = line.slice(colonIdx + 1).trim();
      value = value.replace(/^["'](.*)["']$/, '$1');
      if (key === 'image' || key === 'thumbnail') {
        if (!value || value === '""' || value === "''") value = '';
      }
      data[key] = value;
    });
    return { data: data, content: match[2] };
  }

  function renderBlogPost(meta, markdown, slug) {
    var title = meta.title || 'Article';
    var date = meta.date ? new Date(meta.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    var image = normalizeImageSrc(meta.image || meta.thumbnail || '');

    document.title = title + ' | ' + C.companyName;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && meta.description) metaDesc.setAttribute('content', meta.description);

    var heroSrc = image || '/images/blog-thumbnail.jpg';
    var html = marked.parse(markdown);

    var container = document.getElementById('blog-post-content');
    if (container) {
      container.innerHTML = ''
        + '<article class="max-w-3xl mx-auto">'
          + '<a href="/blog" class="inline-flex items-center text-primary-700 hover:text-primary-600 font-semibold mb-8 group">'
            + '<svg class="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>Back to Insights</a>'
          + '<div class="relative rounded-3xl overflow-hidden mb-10 shadow-premium border border-ink-100">'
            + '<img src="' + heroSrc + '" alt="' + escapeHtml(title) + '" class="w-full h-auto" onerror="this.src=\'/images/blog-thumbnail.jpg\'">'
          + '</div>'
          + '<header class="mb-10">'
            + (date ? '<time class="text-primary-700 font-semibold text-sm uppercase tracking-[0.2em]">' + date + '</time>' : '')
            + '<h1 class="heading-xl mt-3 text-balance">' + escapeHtml(title) + '</h1>'
          + '</header>'
          + '<div class="prose-blog">' + html + '</div>'
          + '<hr class="my-12 border-ink-200">'
          + '<div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-7 px-8 rounded-3xl bg-gradient-to-br from-primary-50 via-white to-accent-50 border border-primary-100">'
            + '<div><p class="font-bold text-ink-900">Think you have a mold problem?</p>'
            + '<p class="text-ink-600 text-sm">Book a free ClearMend assessment — onsite, with a written report.</p></div>'
            + '<a href="/contact" class="btn-primary whitespace-nowrap">Request assessment</a>'
          + '</div>'
        + '</article>';
    }

    var loading = document.getElementById('blog-post-loading');
    if (loading) loading.classList.add('hidden');
  }

  function showPostNotFound() {
    var loading = document.getElementById('blog-post-loading');
    if (loading) loading.classList.add('hidden');
    var container = document.getElementById('blog-post-content');
    if (container) {
      container.innerHTML = ''
        + '<div class="text-center py-20">'
          + '<h2 class="heading-lg text-ink-900 mb-4">Article not found</h2>'
          + '<p class="text-ink-600 mb-8">The article you\'re looking for doesn\'t exist or has been moved.</p>'
          + '<a href="/blog" class="btn-primary">Browse all articles</a>'
        + '</div>';
    }
  }

  // =========================================================
  // BLOG DATA FETCHING
  // =========================================================
  function fetchPosts() {
    if (postsCache) return Promise.resolve(postsCache);
    return fetch('/data/posts.json')
      .then(function (r) { if (!r.ok) throw new Error('Failed'); return r.json(); })
      .then(function (posts) {
        postsCache = posts.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
        return postsCache;
      });
  }

  function loadMarked() {
    if (window.marked) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // =========================================================
  // CONTACT FORM
  // =========================================================
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    // Serialize FormData to application/x-www-form-urlencoded.
    // Skips empty/File entries; ensures unicode is preserved via encodeURIComponent.
    function encodeForm(fd) {
      var pairs = [];
      fd.forEach(function (value, key) {
        if (typeof value !== 'string') return;
        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
      });
      return pairs.join('&');
    }

    function showFormError(message) {
      var notice = document.getElementById('form-error-notice');
      if (!notice) return;
      var p = notice.querySelector('p');
      if (p && message) p.textContent = message;
      notice.classList.remove('hidden');
      setTimeout(function () { notice.classList.add('hidden'); }, 8000);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var nameInput = form.querySelector('[name="name"]');
      var emailInput = form.querySelector('[name="email"]');
      var phoneInput = form.querySelector('[name="phone"]');
      var messageInput = form.querySelector('[name="message"]');
      var valid = true;

      clearFormErrors(form);

      if (!nameInput.value.trim()) { showFieldError(nameInput, 'Please enter your name.'); valid = false; }
      if (!emailInput.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        showFieldError(emailInput, 'Please enter a valid email address.'); valid = false;
      }
      if (!phoneInput.value.trim()) { showFieldError(phoneInput, 'Please enter your phone number.'); valid = false; }
      if (!messageInput.value.trim()) { showFieldError(messageInput, 'Please share a short message.'); valid = false; }

      if (!valid) return;

      var submitBtn = form.querySelector('[type="submit"]');
      var originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<svg class="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg> Sending...';
      submitBtn.disabled = true;

      // Build FormData, then explicitly ensure form-name is present (Netlify requirement).
      var fd = new FormData(form);
      if (!fd.get('form-name')) fd.set('form-name', 'contact');
      var body = encodeForm(fd);

      // POST to "/" — Netlify's form handler intercepts this before the SPA
      // rewrite fires. We avoid POSTing to window.location.pathname because
      // some SPA configs return HTML there, which confuses response parsing.
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: body,
      }).then(function (response) {
        if (!response.ok) {
          // Read the body for debugging (Netlify sometimes returns HTML error pages)
          return response.text().then(function (text) {
            throw new Error('HTTP ' + response.status + ' — ' + (text || 'no body').slice(0, 140));
          });
        }
        var container = form.parentElement;
        container.innerHTML = ''
          + '<div class="text-center py-16">'
            + '<div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-glow-primary">'
              + '<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>'
            + '</div>'
            + '<h3 class="heading-md text-ink-900 mb-3">Message received.</h3>'
            + '<p class="text-ink-600 mb-8">A ClearMend specialist will reach out within one business hour.</p>'
            + '<a href="/" class="btn-primary">Back to home</a>'
          + '</div>';
      }).catch(function (err) {
        // Log full error for devs, surface a friendly message for visitors.
        console.error('[contact-form] submission failed:', err);
        var msg = 'Something went wrong. Please call us at ' + (C.phone || '(888) 744-6636')
          + ' or email ' + (C.email || 'hello@clearmend.com') + '.';
        showFormError(msg);
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
    });
  }

  function showFieldError(input, message) {
    input.classList.add('!border-red-500', '!ring-red-500');
    var errorEl = document.createElement('p');
    errorEl.className = 'text-red-500 text-sm mt-1 form-error';
    errorEl.textContent = message;
    input.parentNode.appendChild(errorEl);
  }

  function clearFormErrors(form) {
    form.querySelectorAll('.form-error').forEach(function (el) { el.remove(); });
    form.querySelectorAll('.\\!border-red-500').forEach(function (el) {
      el.classList.remove('!border-red-500', '!ring-red-500');
    });
  }

  // =========================================================
  // Hero cleanup (canvas removed — nothing to tear down other than timers)
  // =========================================================
  function destroyHeroCanvas() {
    if (window.__kineticTimer) { clearInterval(window.__kineticTimer); window.__kineticTimer = null; }
  }

  // =========================================================
  // HERO — count up numbers (respects data-countup-to + optional suffix)
  // =========================================================
  function initHeroCountUps() {
    var targets = document.querySelectorAll('[data-countup]');
    if (!targets.length) return;

    function run(el) {
      var to = parseFloat(el.getAttribute('data-countup-to'));
      if (!isFinite(to)) return;
      var suffix = el.getAttribute('data-countup-suffix') || '';
      var isFloat = to % 1 !== 0;
      var duration = 1600;
      var start = performance.now();
      function tick(now) {
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        var val = to * eased;
        el.textContent = (isFloat ? val.toFixed(2) : Math.round(val).toLocaleString()) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
        });
      }, { threshold: 0.35 });
      targets.forEach(function (el) { io.observe(el); });
    } else {
      targets.forEach(run);
    }
  }

  // =========================================================
  // HERO — circular gauge fill
  // =========================================================
  function initHeroGauge() {
    var ring = document.getElementById('gauge-ring');
    if (!ring) return;
    // score 94 / 100 → dashoffset = 314 * (1 - 0.94) ≈ 18.84
    var target = 18.84;
    requestAnimationFrame(function () {
      ring.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.2,.7,.2,1)';
      ring.style.strokeDashoffset = target;
    });
  }

  // =========================================================
  // HERO — metric bar fills
  // =========================================================
  function initHeroBars() {
    var bars = document.querySelectorAll('[data-bar-to]');
    bars.forEach(function (bar, i) {
      var to = parseFloat(bar.getAttribute('data-bar-to'));
      if (!isFinite(to)) return;
      setTimeout(function () {
        bar.style.transition = 'width 1.2s cubic-bezier(.2,.7,.2,1)';
        bar.style.width = to + '%';
      }, 350 + i * 120);
    });
  }

  // =========================================================
  // HERO — hand-drawn underline stroke reveal
  // =========================================================
  function initHeroUnderline() {
    var path = document.querySelector('[data-underline-path]');
    if (!path) return;
    setTimeout(function () {
      path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(.2,.7,.2,1)';
      path.style.strokeDashoffset = '0';
    }, 900);
  }


  // =========================================================
  // Reveal system — one shared IntersectionObserver (cheap, no scroll listener)
  // =========================================================
  var revealObserver = null;
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('is-in');
          revealObserver.unobserve(entries[i].target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  }

  /** Attach observer to `.reveal` nodes. `scope` is optional (Element or Document). */
  function observeRevealElements(scope) {
    var root = scope || document;
    root.querySelectorAll('.reveal').forEach(function (el) {
      if (el.classList.contains('is-in')) return;
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add('is-in');
    });
  }

  function runGsapReveals() {
    observeRevealElements(document);

    // Hero entrance — single short GSAP timeline, no ScrollTrigger
    if (!window.gsap) return;
    var heroH1 = document.querySelector('[data-hero-h1]');
    if (!heroH1) return;

    var heroEyebrow = document.querySelector('[data-hero-eyebrow]');
    var heroSub  = document.querySelector('[data-hero-sub]');
    var heroCta  = document.querySelector('[data-hero-cta]');
    var heroCard = document.querySelector('[data-hero-card]');
    var heroStats = document.querySelector('[data-hero-stats]');

    var tl = window.gsap.timeline({ defaults: { ease: 'power2.out' } });
    if (heroEyebrow) tl.from(heroEyebrow, { y: 10, opacity: 0, duration: 0.4 });
    tl.from(heroH1,   { y: 20, opacity: 0, duration: 0.6 }, '-=0.2')
      .from(heroSub,  { y: 14, opacity: 0, duration: 0.45 }, '-=0.35')
      .from(heroCta,  { y: 14, opacity: 0, duration: 0.4 }, '-=0.3');
    if (heroStats)  tl.from(heroStats.children, { y: 12, opacity: 0, duration: 0.4, stagger: 0.05 }, '-=0.3');
    if (heroCard)   tl.from(heroCard, { y: 20, opacity: 0, duration: 0.55 }, '-=0.45');
  }

  // =========================================================
  // SHARED BEHAVIORS — mobile menu, scroll styling, animate obs
  // =========================================================
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('#mobile-menu-btn');
    if (!btn) return;
    var menu = document.getElementById('mobile-menu');
    var iconOpen = document.getElementById('menu-icon-open');
    var iconClose = document.getElementById('menu-icon-close');
    if (!menu) return;
    var isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    if (iconOpen) iconOpen.classList.toggle('hidden');
    if (iconClose) iconClose.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!isOpen));
  });

  function refreshAnimations() {
    // `.reveal` elements are handled in runGsapReveals via a single shared
    // IntersectionObserver. `[data-animate]` blocks are left untouched so
    // the section content is visible immediately (no scroll work).
  }

  // =========================================================
  // PREFETCH
  // =========================================================
  function prefetchOnIdle() {
    if (postsCache) return;
    if ('requestIdleCallback' in window) {
      requestIdleCallback(function () { fetchPosts(); });
    } else {
      setTimeout(function () { fetchPosts(); }, 2000);
    }
  }

  // =========================================================
  // BOOTSTRAP
  // =========================================================
  function init() {
    renderFooter();
    navigate(location.pathname + location.hash, false);
    prefetchOnIdle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
