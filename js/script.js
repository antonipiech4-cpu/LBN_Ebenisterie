/* LBN Ébénisterie — interactions du site.
   Chaque module vérifie la présence de ses éléments : le script fonctionne
   sur toutes les pages, même si certaines sections sont absentes. */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(selector, scope) { return (scope || doc).querySelector(selector); }
  function $$(selector, scope) { return Array.prototype.slice.call((scope || doc).querySelectorAll(selector)); }

  function safe(name, fn) {
    try { fn(); } catch (error) {
      if (window.console) console.error('[LBN] ' + name, error);
    }
  }

  /* Année du pied de page ------------------------------------------------ */
  function initYear() {
    $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  /* En-tête : bordure après défilement ----------------------------------- */
  function initHeaderState() {
    var header = $('[data-header]');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* Menu mobile ---------------------------------------------------------- */
  function initMobileNav() {
    var header = $('[data-header]');
    var toggle = $('[data-nav-toggle]');
    var nav = $('[data-nav]');
    if (!header || !toggle || !nav) return;

    var label = $('[data-nav-label]', toggle);
    var outside = $$('main, footer, [data-mobile-cta]');
    var desktop = window.matchMedia('(min-width: 1024px)');

    function setOpen(open, restoreFocus) {
      header.classList.toggle('is-open', open);
      doc.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Fermer le menu' : 'Ouvrir le menu';
      outside.forEach(function (el) { el.inert = open; });
      if (open) {
        var first = $('a', nav);
        if (first) first.focus();
      } else if (restoreFocus) {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true', true);
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false, false);
    });

    doc.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && header.classList.contains('is-open')) setOpen(false, true);
    });

    var onChange = function (event) { if (event.matches) setOpen(false, false); };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* Lien actif dans la navigation ---------------------------------------- */
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    var links = $$('.nav-list a[href^="#"]');
    if (!links.length) return;

    // Toutes les sections de la page sont observées : l'accueil, sans lien, efface la sélection.
    var sections = $$('main > section');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + (entry.target.id || '');
        links.forEach(function (link) {
          if (link.getAttribute('href') === id) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* Apparition progressive des blocs ------------------------------------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { observer.observe(el); });
  }

  /* Barre d'action mobile : visible après l'accueil, masquée sur le formulaire */
  function initMobileCta() {
    var bar = $('[data-mobile-cta]');
    var hero = $('[data-hero]');
    var contact = doc.getElementById('contact');
    if (!bar) return;
    if (!hero || !('IntersectionObserver' in window)) {
      bar.classList.add('is-visible');
      return;
    }
    var heroVisible = true;
    var contactVisible = false;
    function update() { bar.classList.toggle('is-visible', !heroVisible && !contactVisible); }

    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      update();
    }, { rootMargin: '0px 0px -40% 0px' }).observe(hero);

    if (contact) {
      new IntersectionObserver(function (entries) {
        contactVisible = entries[0].isIntersecting;
        update();
      }, { threshold: 0.15 }).observe(contact);
    }
  }

  /* Horaires : jour en cours et statut ouvert / fermé (heure de Zurich) --- */
  function initOpeningHours() {
    var table = $('[data-hours]');
    if (!table) return;
    var status = $('[data-hours-status]');
    var rows = $$('tr[data-day]', table);

    function toMinutes(value) {
      var parts = value.split(':');
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }

    var schedule = {};
    rows.forEach(function (row) {
      var raw = (row.getAttribute('data-hours') || '').trim();
      schedule[row.getAttribute('data-day')] = {
        row: row,
        name: row.querySelector('th').textContent.trim().toLowerCase(),
        ranges: raw ? raw.split(',').map(function (range) {
          var bounds = range.split('-');
          return { open: toMinutes(bounds[0]), close: toMinutes(bounds[1]), openLabel: bounds[0].trim(), closeLabel: bounds[1].trim() };
        }) : []
      };
    });

    function zurichNow() {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Zurich', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var map = {};
      parts.forEach(function (p) { map[p.type] = p.value; });
      var days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      return { day: days[map.weekday], minutes: (parseInt(map.hour, 10) % 24) * 60 + parseInt(map.minute, 10) };
    }

    function update() {
      var now = zurichNow();
      rows.forEach(function (row) { row.classList.remove('is-today'); });
      var today = schedule[String(now.day)];
      if (!today) return;
      today.row.classList.add('is-today');
      if (!status) return;

      var message = '';
      var isOpen = false;
      today.ranges.some(function (range) {
        if (now.minutes >= range.open && now.minutes < range.close) {
          isOpen = true;
          message = 'Ouvert actuellement · jusqu’à ' + range.closeLabel;
          return true;
        }
        return false;
      });

      if (!isOpen) {
        var later = today.ranges.filter(function (range) { return range.open > now.minutes; })[0];
        if (later) {
          message = 'Fermé actuellement · réouverture à ' + later.openLabel;
        } else {
          for (var offset = 1; offset <= 7; offset++) {
            var next = schedule[String((now.day + offset) % 7)];
            if (next && next.ranges.length) {
              message = 'Fermé actuellement · réouverture ' + (offset === 1 ? 'demain' : next.name) + ' à ' + next.ranges[0].openLabel;
              break;
            }
          }
        }
      }

      status.textContent = message;
      status.classList.toggle('is-open', isOpen);
      status.hidden = !message;
    }

    if (!window.Intl || !Intl.DateTimeFormat.prototype.formatToParts) return;
    update();
    window.setInterval(update, 60 * 1000);
  }

  /* Galerie : filtres ---------------------------------------------------- */
  function initGalleryFilters() {
    var bar = $('[data-filters]');
    var gallery = $('[data-gallery]');
    if (!bar || !gallery) return;
    var buttons = $$('[data-filter]', bar);
    var items = $$('[data-category]', gallery);

    var live = doc.createElement('p');
    live.className = 'visually-hidden';
    live.setAttribute('role', 'status');
    gallery.parentNode.insertBefore(live, gallery);

    bar.hidden = false;
    bar.addEventListener('click', function (event) {
      var button = event.target.closest('[data-filter]');
      if (!button) return;
      var filter = button.getAttribute('data-filter');
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); });
      var count = 0;
      items.forEach(function (item) {
        var show = filter === 'all' || item.getAttribute('data-category') === filter;
        item.hidden = !show;
        if (show) count++;
      });
      live.textContent = count + ' réalisation' + (count > 1 ? 's' : '') + ' affichée' + (count > 1 ? 's' : '');
    });
  }

  /* Galerie : visionneuse ------------------------------------------------ */
  function initLightbox() {
    var dialog = $('[data-lightbox]');
    var gallery = $('[data-gallery]');
    if (!dialog || !gallery || typeof dialog.showModal !== 'function') return;

    var img = $('[data-lightbox-img]', dialog);
    var source = $('[data-lightbox-source]', dialog);
    var caption = $('[data-lightbox-caption]', dialog);
    var counter = $('[data-lightbox-count]', dialog);
    var closeBtn = $('[data-lightbox-close]', dialog);
    var current = [];
    var index = 0;
    var opener = null;

    function visibleLinks() {
      return $$('.gallery__item:not([hidden]) .gallery__link', gallery);
    }

    function show(i) {
      index = (i + current.length) % current.length;
      var link = current[index];
      var thumb = $('img', link);
      var label = $('.gallery__caption', link);
      if (source) source.srcset = link.getAttribute('data-avif') || '';
      img.removeAttribute('src');
      img.width = parseInt(link.getAttribute('data-width'), 10) || 1600;
      img.height = parseInt(link.getAttribute('data-height'), 10) || 1067;
      img.src = link.getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
      caption.textContent = label ? label.textContent : '';
      counter.textContent = (index + 1) + ' / ' + current.length;
    }

    function open(link) {
      current = visibleLinks();
      opener = link;
      show(current.indexOf(link));
      dialog.showModal();
      doc.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function close() { if (dialog.open) dialog.close(); }

    gallery.addEventListener('click', function (event) {
      var link = event.target.closest('.gallery__link');
      if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      open(link);
    });

    dialog.addEventListener('close', function () {
      doc.body.style.overflow = '';
      if (opener) opener.focus();
    });

    $('[data-lightbox-prev]', dialog).addEventListener('click', function () { show(index - 1); });
    $('[data-lightbox-next]', dialog).addEventListener('click', function () { show(index + 1); });
    closeBtn.addEventListener('click', close);

    dialog.addEventListener('click', function (event) {
      if (event.target === dialog || event.target.classList.contains('lightbox__inner')) close();
    });

    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
    });

    var startX = null;
    dialog.addEventListener('touchstart', function (event) { startX = event.touches[0].clientX; }, { passive: true });
    dialog.addEventListener('touchend', function (event) {
      if (startX === null) return;
      var delta = event.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 50) show(delta < 0 ? index + 1 : index - 1);
      startX = null;
    });
  }

  /* Liens « Demander un devis » des prestations : présélection du projet - */
  function initServicePreselect() {
    var select = $('[data-service-select]');
    if (!select) return;
    doc.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-service]');
      if (!trigger) return;
      var wanted = trigger.getAttribute('data-service');
      $$('option', select).some(function (option) {
        if (option.value === wanted || option.textContent.trim() === wanted) {
          select.value = option.value;
          return true;
        }
        return false;
      });
    });
  }

  /* Formulaire de demande de devis -------------------------------------- */
  function initQuoteForm() {
    var form = $('[data-quote-form]');
    if (!form) return;

    var endpoint = (form.getAttribute('data-endpoint') || '').trim();
    var recipient = form.getAttribute('data-recipient') || '';
    var statusEl = $('[data-form-status]', form);
    var submitBtn = $('button[type="submit"]', form);
    var noteMailto = $('[data-note-mailto]', form);
    var noteEndpoint = $('[data-note-endpoint]', form);
    var attempted = false;

    if (endpoint) {
      if (noteMailto) noteMailto.hidden = true;
      if (noteEndpoint) noteEndpoint.hidden = false;
    }

    var rules = {
      'f-name': function (v) { return v.length >= 2 ? '' : 'Indiquez votre nom et prénom.'; },
      'f-email': function (v) {
        if (!v) return 'Indiquez votre adresse e-mail pour recevoir une réponse.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Cette adresse e-mail semble incomplète (ex. nom@exemple.ch).';
      },
      'f-phone': function (v) {
        if (!v) return '';
        var digits = v.replace(/\D/g, '');
        return /^[+\d\s().\/-]+$/.test(v) && digits.length >= 9 ? '' : 'Ce numéro de téléphone semble incomplet (ex. 079 123 45 67).';
      },
      'f-message': function (v) { return v.length >= 10 ? '' : 'Décrivez votre projet en quelques mots (10 caractères minimum).'; }
    };

    function validateField(id) {
      var field = doc.getElementById(id);
      if (!field) return true;
      var message = rules[id](field.value.trim());
      var error = $('[data-error-for="' + id + '"]', form);
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
      if (error) error.textContent = message;
      return !message;
    }

    function validateAll() {
      var firstInvalid = null;
      Object.keys(rules).forEach(function (id) {
        if (!validateField(id) && !firstInvalid) firstInvalid = doc.getElementById(id);
      });
      return firstInvalid;
    }

    Object.keys(rules).forEach(function (id) {
      var field = doc.getElementById(id);
      if (!field) return;
      field.addEventListener('blur', function () { if (attempted || field.value.trim()) validateField(id); });
      field.addEventListener('input', function () { if (field.getAttribute('aria-invalid') === 'true') validateField(id); });
    });

    function setStatus(message, type) {
      statusEl.textContent = message;
      statusEl.classList.toggle('is-success', type === 'success');
      statusEl.classList.toggle('is-error', type === 'error');
    }

    function value(name) {
      var field = form.elements[name];
      return field ? field.value.trim() : '';
    }

    function sendByMail() {
      var project = value('projet');
      var subject = 'Demande de devis' + (project ? ' – ' + project : '') + ' – ' + value('nom');
      var lines = [
        'Bonjour,',
        '',
        value('message'),
        '',
        '—',
        'Nom : ' + value('nom'),
        'E-mail : ' + value('email')
      ];
      if (value('telephone')) lines.push('Téléphone : ' + value('telephone'));
      if (value('localite')) lines.push('Localité du projet : ' + value('localite'));
      if (project) lines.push('Type de projet : ' + project);
      lines.push('', 'Envoyé depuis le formulaire du site LBN Ébénisterie');

      window.location.href = 'mailto:' + recipient +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      setStatus('Votre messagerie s’ouvre avec la demande pré-remplie : il ne reste qu’à l’envoyer. ' +
        'Si rien ne s’ouvre, écrivez directement à ' + recipient + ' ou appelez le 076 522 11 59.', 'success');
    }

    function sendToEndpoint() {
      var label = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours…';
      setStatus('', null);

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        form.reset();
        attempted = false;
        setStatus('Merci ! Votre demande a bien été envoyée. LBN Ébénisterie vous recontactera.', 'success');
      }).catch(function () {
        setStatus('L’envoi n’a pas abouti. Merci de réessayer, ou de contacter l’atelier au 076 522 11 59 ou à ' + recipient + '.', 'error');
      }).then(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = label;
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      attempted = true;
      var firstInvalid = validateAll();
      if (firstInvalid) {
        setStatus('Merci de compléter les champs signalés.', 'error');
        firstInvalid.focus();
        return;
      }
      if (endpoint && window.fetch && window.FormData) sendToEndpoint();
      else sendByMail();
    });
  }

  safe('year', initYear);
  safe('header', initHeaderState);
  safe('nav', initMobileNav);
  safe('scrollspy', initScrollSpy);
  safe('reveal', initReveal);
  safe('mobile-cta', initMobileCta);
  safe('hours', initOpeningHours);
  safe('filters', initGalleryFilters);
  safe('lightbox', initLightbox);
  safe('service', initServicePreselect);
  safe('form', initQuoteForm);

  root.classList.add('js-ready');
})();
