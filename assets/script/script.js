        (function () {
            'use strict';

            /* ─── TRACKING ─── */
            function vnPush(event, data) {
                try {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push(Object.assign({ event: event }, data));
                } catch (e) { /* silencioso */ }
            }

            // Evento de visualização da sessão
            vnPush('vn_view', { page: 'metodo_viva_nomade' });

            /* ─── SCROLL 50% ─── */
            var scroll50Fired = false;
            window.addEventListener('scroll', function () {
                if (scroll50Fired) return;
                var scrolled = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
                if (scrolled >= 0.5) {
                    scroll50Fired = true;
                    vnPush('vn_scroll_50', { percent: 50 });
                }
            }, { passive: true });

            /* ─── CTA CLICK TRACKING ─── */
            document.addEventListener('click', function (e) {
                var btn = e.target.closest('[data-cta]');
                if (!btn) return;
                vnPush('vn_cta_click', { label: btn.getAttribute('data-cta') });
            });

            /* ─── SCROLL REVEAL ─── */
            var revealItems = document.querySelectorAll('.vn-reveal');
            if ('IntersectionObserver' in window) {
                var revealObs = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('vn-visible');
                            revealObs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.12 });

                revealItems.forEach(function (el) { revealObs.observe(el); });
            } else {
                // Fallback sem IO
                revealItems.forEach(function (el) { el.classList.add('vn-visible'); });
            }

            /* ─── CONTADOR ANIMADO ─── */
            function animateCounter(el) {
                var target = parseInt(el.getAttribute('data-counter'), 10) || 0;
                var prefix = el.getAttribute('data-prefix') || '';
                var suffix = el.getAttribute('data-suffix') || '';
                var duration = 1400;
                var start = null;

                function step(ts) {
                    if (!start) start = ts;
                    var progress = Math.min((ts - start) / duration, 1);
                    var ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
                    var current = Math.floor(ease * target);
                    el.textContent = prefix + current + suffix;
                    if (progress < 1) requestAnimationFrame(step);
                    else el.textContent = prefix + target + suffix;
                }
                requestAnimationFrame(step);
            }

            var counterEls = document.querySelectorAll('[data-counter]');
            if ('IntersectionObserver' in window && counterEls.length) {
                var counterObs = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            animateCounter(entry.target);
                            counterObs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.5 });
                counterEls.forEach(function (el) { counterObs.observe(el); });
            }

            /* ─── PULSE NO PREÇO (quando oferta entra na viewport) ─── */
            var priceMain = document.getElementById('vn-price-main');
            if (priceMain && 'IntersectionObserver' in window) {
                var priceObs = new IntersectionObserver(function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            priceMain.classList.add('vn-pulse');
                            priceObs.unobserve(entry.target);
                        }
                    });
                }, { threshold: 0.6 });
                priceObs.observe(priceMain);
            }

            /* ─── STICKY CTA (ocultação inteligente) ─── */
            var stickyEl = document.getElementById('vn-sticky');
            var heroEl = document.getElementById('hero');
            var footerEl = document.getElementById('footer');
            var offerEl = document.getElementById('oferta');

            var SCROLL_THRESHOLD = 0.20; // 20% da página

            function updateSticky() {
                var scrollY = window.scrollY;
                var docH = document.documentElement.scrollHeight;
                var viewH = window.innerHeight;
                var progress = scrollY / (docH - viewH);

                var heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : 0;
                var footerTop = footerEl ? footerEl.getBoundingClientRect().top : viewH;
                var offerTop = offerEl ? offerEl.getBoundingClientRect().top : viewH;
                var offerBottom = offerEl ? offerEl.getBoundingClientRect().bottom : viewH;

                // Ocultar se: usuário está no hero, na seção de oferta visível, ou no rodapé
                var inHero = heroBottom > 0;
                var inOffer = offerTop < viewH && offerBottom > 0;
                var inFooter = footerTop < viewH + 80;
                var tooEarly = progress < SCROLL_THRESHOLD;

                if (tooEarly || inHero || inOffer || inFooter) {
                    stickyEl.classList.remove('vn-sticky-visible');
                    stickyEl.classList.add('vn-sticky-hidden');
                } else {
                    stickyEl.classList.add('vn-sticky-visible');
                    stickyEl.classList.remove('vn-sticky-hidden');
                }
            }

            if (stickyEl) {
                window.addEventListener('scroll', updateSticky, { passive: true });
                updateSticky();
            }

            /* ─── SMOOTH SCROLL PARA ÂNCORAS ─── */
            document.querySelectorAll('a[href^="#"]').forEach(function (link) {
                link.addEventListener('click', function (e) {
                    var target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });

            /* ─── ACORDEÃO FAQ ─── */
            var faqItems = document.querySelectorAll('.vn-faq-item');

            faqItems.forEach(function (item) {
                var trigger = item.querySelector('.vn-faq-trigger');
                var panel = item.querySelector('.vn-faq-panel');
                var inner = item.querySelector('.vn-faq-panel-inner');

                if (!trigger || !panel || !inner) return;

                trigger.addEventListener('click', function () {
                    var isOpen = item.getAttribute('data-open') === 'true';

                    // Fechar todos
                    faqItems.forEach(function (other) {
                        var otherPanel = other.querySelector('.vn-faq-panel');
                        var otherTrig = other.querySelector('.vn-faq-trigger');
                        if (otherPanel && otherTrig) {
                            other.setAttribute('data-open', 'false');
                            otherTrig.setAttribute('aria-expanded', 'false');
                            otherPanel.setAttribute('aria-hidden', 'true');
                            otherPanel.style.maxHeight = '0px';
                        }
                    });

                    // Abrir o clicado (se não estava aberto)
                    if (!isOpen) {
                        item.setAttribute('data-open', 'true');
                        trigger.setAttribute('aria-expanded', 'true');
                        panel.setAttribute('aria-hidden', 'false');
                        panel.style.maxHeight = inner.scrollHeight + 32 + 'px';
                    }
                });

                // Teclado: Enter / Espaço
                trigger.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        trigger.click();
                    }
                });
            });

            /* ─── CARROSSEL PASSAPORTE ─── */
            const VNCarousel = {
                // Constantes
                BREAKPOINTS: { desktop: 1280, tablet: 860 },
                SWIPE_THRESHOLD: 50,

                // Estado
                state: {
                    currentIdx: 0,
                    visibleCount: 1,
                    totalTickets: 0
                },

                // Elementos DOM
                elements: {
                    track: document.getElementById('vn-track'),
                    prevBtn: document.getElementById('vn-prev'),
                    nextBtn: document.getElementById('vn-next'),
                    dotsContainer: document.getElementById('vn-dots'),
                    trackWrap: null
                },

                // Inicialização
                init() {
                    if (!this.isValid()) return;

                    this.elements.trackWrap = this.elements.track.parentElement;
                    this.state.totalTickets = this.elements.track.querySelectorAll('.vn-ticket').length;

                    this.setup();
                    this.bindEvents();
                    this.render();
                },

                // Validação
                isValid() {
                    return this.elements.track && this.elements.prevBtn && this.elements.nextBtn;
                },

                // Calcular quantidade visível
                getVisibleCount() {
                    if (window.innerWidth >= this.BREAKPOINTS.desktop) return 3;
                    if (window.innerWidth >= this.BREAKPOINTS.tablet) return 2;
                    return 1;
                },

                // Atualizar visibleCount e clampar índice
                updateVisibleCount() {
                    const prevVisible = this.state.visibleCount;
                    this.state.visibleCount = this.getVisibleCount();

                    // Reajustar índice se necessário
                    if (this.state.currentIdx > this.getMaxIndex()) {
                        this.state.currentIdx = Math.max(0, this.getMaxIndex());
                    }

                    return prevVisible !== this.state.visibleCount;
                },

                getMaxIndex() {
                    return Math.max(0, this.state.totalTickets - this.state.visibleCount);
                },

                // Criar indicadores
                buildDots() {
                    this.elements.dotsContainer.innerHTML = '';
                    const pages = Math.ceil(this.state.totalTickets / this.state.visibleCount);

                    for (let i = 0; i < pages; i++) {
                        const dot = document.createElement('button');
                        dot.className = `vn-passport__dot${i === 0 ? ' vn-active' : ''}`;
                        dot.setAttribute('aria-label', `Ir para trilha ${i * this.state.visibleCount + 1}`);
                        dot.setAttribute('role', 'tab');
                        dot.setAttribute('aria-selected', i === 0);
                        dot.addEventListener('click', () => this.goTo(i * this.state.visibleCount));
                        this.elements.dotsContainer.appendChild(dot);
                    }
                },

                // Atualizar posição e ui
                updateCarousel() {
                    const cardWidth = this.elements.trackWrap.offsetWidth / this.state.visibleCount;
                    const translateX = this.state.currentIdx * cardWidth;

                    this.elements.track.style.transform = `translateX(-${translateX}px)`;
                    this.updateButtons();
                    this.updateDots();
                },

                updateButtons() {
                    this.elements.prevBtn.disabled = this.state.currentIdx === 0;
                    this.elements.nextBtn.disabled = this.state.currentIdx >= this.getMaxIndex();
                },

                updateDots() {
                    const dots = this.elements.dotsContainer.querySelectorAll('.vn-passport__dot');
                    const activePage = Math.floor(this.state.currentIdx / this.state.visibleCount);

                    dots.forEach((dot, i) => {
                        const isActive = i === activePage;
                        dot.classList.toggle('vn-active', isActive);
                        dot.setAttribute('aria-selected', isActive);
                    });
                },

                // Navegar para índice
                goTo(idx) {
                    this.state.currentIdx = Math.max(0, Math.min(idx, this.getMaxIndex()));
                    this.updateCarousel();
                },

                // Handlers
                handlePrev() {
                    this.goTo(this.state.currentIdx - this.state.visibleCount);
                },

                handleNext() {
                    this.goTo(this.state.currentIdx + this.state.visibleCount);
                },

                handleSwipe(startX, endX) {
                    const diff = startX - endX;
                    if (Math.abs(diff) > this.SWIPE_THRESHOLD) {
                        diff > 0 ? this.handleNext() : this.handlePrev();
                    }
                },

                handleKeyboard(key) {
                    if (key === 'ArrowRight') this.handleNext();
                    if (key === 'ArrowLeft') this.handlePrev();
                },

                // Configurar listeners
                bindEvents() {
                    // Botões
                    this.elements.prevBtn.addEventListener('click', () => this.handlePrev());
                    this.elements.nextBtn.addEventListener('click', () => this.handleNext());

                    // Touch
                    let touchStartX = 0;
                    this.elements.trackWrap.addEventListener('touchstart', (e) => {
                        touchStartX = e.touches[0].clientX;
                    }, { passive: true });

                    this.elements.trackWrap.addEventListener('touchend', (e) => {
                        this.handleSwipe(touchStartX, e.changedTouches[0].clientX);
                    }, { passive: true });

                    // Teclado
                    this.elements.trackWrap.addEventListener('keydown', (e) => {
                        this.handleKeyboard(e.key);
                    });

                    // Resize
                    window.addEventListener('resize', () => {
                        if (this.updateVisibleCount()) {
                            this.buildDots();
                        }
                        this.updateCarousel();
                    });
                },

                // Setup
                setup() {
                    this.state.visibleCount = this.getVisibleCount();
                },

                // Renderizar
                render() {
                    this.buildDots();
                    this.updateCarousel();
                }
            };

            VNCarousel.init();

            /* ─── GALERIA COM PERSPECTIVA 3D ─── */
            const VNGallery = {
                state: {
                    currentIdx: 0,
                    totalSlides: 0
                },

                elements: {
                    track: document.getElementById('vn-gallery-track'),
                    slides: [],
                    dotsContainer: document.getElementById('vn-gallery-dots'),
                    prevBtn: document.getElementById('vn-gallery-prev'),
                    nextBtn: document.getElementById('vn-gallery-next')
                },

                init() {
                    if (!this.isValid()) return;

                    this.elements.slides = this.elements.track.querySelectorAll('.vn-gallery__slide');
                    this.state.totalSlides = this.elements.slides.length;

                    this.buildDots();
                    this.bindEvents();
                },

                isValid() {
                    return this.elements.track && this.elements.dotsContainer && this.elements.prevBtn && this.elements.nextBtn;
                },

                buildDots() {
                    this.elements.dotsContainer.innerHTML = '';
                    for (let i = 0; i < this.state.totalSlides; i++) {
                        const dot = document.createElement('button');
                        dot.className = `vn-gallery__dot${i === 0 ? ' vn-active' : ''}`;
                        dot.setAttribute('aria-label', `Imagem ${i + 1}`);
                        dot.addEventListener('click', () => this.goTo(i));
                        this.elements.dotsContainer.appendChild(dot);
                    }
                },

                goTo(idx) {
                    this.state.currentIdx = Math.max(0, Math.min(idx, this.state.totalSlides - 1));
                    this.update();
                },

                next() {
                    this.goTo((this.state.currentIdx + 1) % this.state.totalSlides);
                },

                prev() {
                    this.goTo((this.state.currentIdx - 1 + this.state.totalSlides) % this.state.totalSlides);
                },

                update() {
                    // Atualizar classes dos slides
                    this.elements.slides.forEach((slide, i) => {
                        slide.classList.remove('vn-active', 'vn-prev');
                        
                        if (i === this.state.currentIdx) {
                            slide.classList.add('vn-active');
                        } else if (i === (this.state.currentIdx - 1 + this.state.totalSlides) % this.state.totalSlides) {
                            slide.classList.add('vn-prev');
                        }
                    });

                    // Atualizar dots
                    const dots = this.elements.dotsContainer.querySelectorAll('.vn-gallery__dot');
                    dots.forEach((dot, i) => {
                        dot.classList.toggle('vn-active', i === this.state.currentIdx);
                    });

                    // Atualizar estado dos botões
                    this.elements.prevBtn.disabled = false;
                    this.elements.nextBtn.disabled = false;
                },

                bindEvents() {
                    this.elements.prevBtn.addEventListener('click', () => this.prev());
                    this.elements.nextBtn.addEventListener('click', () => this.next());

                    // Teclado
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'ArrowLeft') this.prev();
                        if (e.key === 'ArrowRight') this.next();
                    });
                }
            };

            VNGallery.init();

            /* ─── CARROSSEL RESPONSIVO ─── */
            class Carousel {
                constructor(container) {
                    this.container = container;
                    this.track = container.querySelector('.vn-carousel-track');
                    this.slides = container.querySelectorAll('.vn-carousel-slide');
                    this.prevBtn = container.querySelector('.vn-carousel-prev');
                    this.nextBtn = container.querySelector('.vn-carousel-next');
                    this.dotsContainer = container.querySelector('.vn-carousel-dots');
                    this.currentDisplay = container.querySelector('.vn-carousel-current');
                    this.progressBar = container.querySelector('.vn-carousel-progress');
                    
                    this.currentIndex = 0;
                    this.slideCount = this.slides.length;
                    
                    if (this.track && this.slides.length > 0) {
                        this.init();
                    }
                }
                
                init() {
                    // Criar dots
                    for (let i = 0; i < this.slideCount; i++) {
                        const dot = document.createElement('div');
                        dot.className = 'vn-carousel-dot' + (i === 0 ? ' active' : '');
                        dot.addEventListener('click', () => this.goToSlide(i));
                        this.dotsContainer.appendChild(dot);
                    }
                    
                    this.dots = this.dotsContainer.querySelectorAll('.vn-carousel-dot');
                    
                    // Event listeners
                    this.prevBtn.addEventListener('click', () => this.prev());
                    this.nextBtn.addEventListener('click', () => this.next());
                    
                    // Teclado
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'ArrowLeft') this.prev();
                        if (e.key === 'ArrowRight') this.next();
                    });
                    
                    // Touch/Swipe support
                    let startX = 0;
                    this.track.addEventListener('touchstart', (e) => {
                        startX = e.touches[0].clientX;
                    });
                    
                    this.track.addEventListener('touchend', (e) => {
                        const endX = e.changedTouches[0].clientX;
                        if (startX > endX + 50) {
                            this.next();
                        } else if (startX < endX - 50) {
                            this.prev();
                        }
                    });
                    
                    // Auto-play
                    this.autoPlay();
                }
                
                updateSlide() {
                    const offset = this.currentIndex * -100;
                    this.track.style.transform = `translateX(${offset}%)`;
                    
                    this.dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === this.currentIndex);
                    });

                    // Atualizar indicador e barra de progresso
                    if (this.currentDisplay) {
                        this.currentDisplay.textContent = this.currentIndex + 1;
                    }
                    
                    const progress = ((this.currentIndex + 1) / this.slideCount) * 100;
                    if (this.progressBar) {
                        this.progressBar.style.width = progress + '%';
                    }
                }
                
                next() {
                    this.currentIndex = (this.currentIndex + 1) % this.slideCount;
                    this.updateSlide();
                }
                
                prev() {
                    this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
                    this.updateSlide();
                }
                
                goToSlide(index) {
                    this.currentIndex = index;
                    this.updateSlide();
                }
                
                autoPlay() {
                    setInterval(() => {
                        this.next();
                    }, 5000);
                }
            }
            
            const carouselContainer = document.querySelector('.vn-carousel-container');
            if (carouselContainer) {
                new Carousel(carouselContainer);
            }


        })();