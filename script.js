document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const iconElement = menuBtn.querySelector('i');
            if (mobileMenu.classList.contains('active')) {
                iconElement.setAttribute('data-lucide', 'x');
            } else {
                iconElement.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const iconElement = menuBtn.querySelector('i');
            iconElement.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // 3. Navbar Sticky & Scroll Progress & Back-to-top
    const navbar = document.querySelector('.navbar');
    const progressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.padding = '16px 0';
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + "%";

        if (backToTopBtn) {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#contact') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    // 4. Contact Form Submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            const isArabic = document.body.classList.contains('rtl');
            btn.textContent = isArabic ? 'جاري الإرسال...' : 'Sending...';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            const scriptURL = 'https://script.google.com/macros/s/AKfycbzJTxC-S9F75iooOTsgAF73ZWAZHaby0-O4sGUXp6ET165671WAEUekAZ5GD5VDoos3/exec';

            fetch(scriptURL, { method: 'POST', body: new FormData(contactForm) })
                .then(response => {
                    btn.textContent = isArabic ? 'تم الإرسال بنجاح!' : 'Sent Successfully!';
                    btn.classList.remove('btn-primary');
                    btn.style.backgroundColor = 'var(--primary)';
                    contactForm.reset();

                    const toast = document.getElementById('toast');
                    toast.classList.add('show');
                    setTimeout(() => toast.classList.remove('show'), 5000);

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.opacity = '1';
                        btn.style.backgroundColor = '';
                        btn.classList.add('btn-primary');
                        btn.disabled = false;
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    btn.textContent = isArabic ? 'خطأ في الإرسال' : 'Error Sending';
                    btn.style.backgroundColor = '#ef4444';

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.opacity = '1';
                        btn.style.backgroundColor = '';
                        btn.disabled = false;
                    }, 3000);
                });
        });
    }

    const toastClose = document.querySelector('.toast-close');
    if (toastClose) {
        toastClose.addEventListener('click', () => {
            document.getElementById('toast').classList.remove('show');
        });
    }

    // 5. Lightbox
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    if (lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('.gallery-img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                }
            });
        });

        const closeLightbox = () => lightbox.classList.remove('active');
        if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeLightbox();
                const infoModal = document.getElementById('info-modal');
                if(infoModal) infoModal.classList.remove('active');
            }
        });
    }

    // 6. Metrics Counter
    const metricNumbers = document.querySelectorAll('.metric-number');
    let hasCounted = false;

    const startCounting = () => {
        if (hasCounted) return;
        hasCounted = true;

        metricNumbers.forEach(metric => {
            const target = +metric.getAttribute('data-target');
            const increment = target / (2000 / 16);
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    metric.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    metric.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const metricsSection = document.querySelector('.metrics-banner');
    if (metricsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                startCounting();
                observer.disconnect();
            }
        }, { threshold: 0.5 });
        observer.observe(metricsSection);
    }

    // 7. Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observerStyle) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observerStyle.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    revealElements.forEach(el => revealObserver.observe(el));

    // 8. Language Toggle
    const langToggleBtn = document.getElementById('lang-toggle');
    const langTextDisplay = document.getElementById('lang-text');
    const i18nElements = document.querySelectorAll('.i18n-text');
    let currentLang = 'en';

    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'ar' : 'en';
            
            if (currentLang === 'ar') {
                document.body.classList.add('rtl');
                document.documentElement.setAttribute('dir', 'rtl');
                document.documentElement.setAttribute('lang', 'ar');
                langTextDisplay.textContent = 'English';
            } else {
                document.body.classList.remove('rtl');
                document.documentElement.setAttribute('dir', 'ltr');
                document.documentElement.setAttribute('lang', 'en');
                langTextDisplay.textContent = 'عربى';
            }

            i18nElements.forEach(el => {
                const text = el.getAttribute(`data-${currentLang}`);
                if (text) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                        el.setAttribute('placeholder', text);
                    } else if (el.tagName === 'OPTION') {
                        el.textContent = text;
                    } else {
                        el.textContent = text;
                    }
                }
            });
        });
    }

    // 9. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(faq => faq.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // 10. Testimonials Slider
    const track = document.getElementById('testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const nextBtn = document.getElementById('next-slide');
    const prevBtn = document.getElementById('prev-slide');
    const dotsContainer = document.getElementById('slider-dots');
    
    if (track && slides.length > 0) {
        let currentIndex = 0;
        
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        const dots = document.querySelectorAll('.slider-dot');

        const updateSlider = () => {
            const isRtl = document.body.classList.contains('rtl');
            const directionMultiplier = isRtl ? 1 : -1;
            track.style.transform = `translateX(${currentIndex * 100 * directionMultiplier}%)`;
            
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        };

        const goToSlide = (index) => {
            currentIndex = index;
            updateSlider();
        };

        const nextSlide = () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider();
        };

        const prevSlide = () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider();
        };

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        setInterval(nextSlide, 6000);
    }

    // 11. Modal Logic
    const serviceCards = document.querySelectorAll('.interactive-card');
    const infoModal = document.getElementById('info-modal');
    
    const modalData = {
        'third-party': {
            icon: 'clipboard-check',
            en: { title: "Third-Party Inspections", text: "We conduct exhaustive third-party inspections on lifting equipment, heavy machinery, and construction sites to ensure they comply with local municipality and continuous international standards. Our detailed reports help you avoid downtime and prevent accidents before they occur." },
            ar: { title: "فحوصات الطرف الثالث", text: "نجري عمليات تفتيش شاملة من طرف ثالث على معدات الرفع والآلات الثقيلة ومواقع البناء للتأكد من امتثالها لمعايير البلدية المحلية والمعايير الدولية. تساعدك تقاريرنا المفصلة على تجنب التوقف عن العمل." }
        },
        'audits': {
            icon: 'file-search',
            en: { title: "Health & Safety Audits", text: "Our certified auditors will review your existing HSE policies and evaluate them directly against your active workplace environment. We identify potential hazards, non-compliance issues, and procedural gaps, offering actionable roadmaps to elevate your safety culture." },
            ar: { title: "تدقيق الصحة والسلامة", text: "سيقوم مدققونا بمراجعة سياسات الصحة والسلامة والبيئة وتقييمها مقابل بيئة عملك. نحدد المخاطر المحتملة ونقدم خرائط طريق قابلة للتنفيذ لرفع مستوى ثقافة السلامة لديك." }
        },
        'qa': {
            icon: 'star',
            en: { title: "Quality Assurance", text: "Achieve excellence in your operations. We provide comprehensive ISO consultancy and quality management system implementation, ensuring your products, services, and construction projects meet the rigorous standards expected by top-tier clients." },
            ar: { title: "ضمان الجودة", text: "حقق التميز في عملياتك. نقدم استشارات شاملة لنظام الأيزو وتنفيذ نظام إدارة الجودة، مما يضمن تلبية منتجاتك وخدماتك للمعايير الصارمة." }
        },
        'env': {
            icon: 'leaf',
            en: { title: "Environmental Management", text: "Navigate complex environmental legislation seamlessly. We help you design effective waste management systems, monitor ecological impact, and implement sustainable practices that not only protect the environment but also reduce operational costs." },
            ar: { title: "الإدارة البيئية", text: "تعامل مع التشريعات البيئية المعقدة بسلاسة. نساعدك في تصميم أنظمة فعالة لإدارة النفايات، ومراقبة التأثير البيئي، وتنفيذ ممارسات مستدامة." }
        },
        'calibration': {
            icon: 'sliders',
            en: { title: "Machine Calibration", text: "Precision is non-negotiable. Our calibration services cover a wide spectrum of industrial tools, testing equipment, and safety gauges, providing you with certification that your instruments execute accurate measurements." },
            ar: { title: "معايرة الآلات", text: "تغطي خدمات المعايرة لدينا مجموعة واسعة من الأدوات الصناعية ومعدات الاختبار ومقاييس السلامة، مما يزودك بشهادة تفيد بأن أجهزتك تنفذ قياسات دقيقة." }
        }
    };

    if (infoModal) {
        const titleEl = document.getElementById('modal-title');
        const bodyEl = document.getElementById('modal-body');
        const ctaEl = document.getElementById('modal-cta');
        const iconEl = document.getElementById('modal-dynamic-icon');
        const closeBtn = infoModal.querySelector('.modal-close');

        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                const modalId = card.getAttribute('data-modal');
                const data = modalData[modalId];
                
                if (data) {
                    const lang = document.body.classList.contains('rtl') ? 'ar' : 'en';
                    titleEl.textContent = data[lang].title;
                    bodyEl.innerHTML = `<p>${data[lang].text}</p>`;
                    ctaEl.textContent = lang === 'ar' ? 'احصل على عرض سعر' : 'Get a Quote';
                    
                    iconEl.setAttribute('data-lucide', data.icon);
                    lucide.createIcons();
                    infoModal.classList.add('active');
                }
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', () => infoModal.classList.remove('active'));
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) infoModal.classList.remove('active');
        });
        
        if (ctaEl) {
            ctaEl.addEventListener('click', () => {
                infoModal.classList.remove('active');
                const select = document.getElementById('service');
                if (select) select.value = select.options[1].value;
            });
        }
    }

    // ---- PHASE 2 LOGIC ---- //

    // 12. Dark Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const htmlEl = document.documentElement;
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlEl.setAttribute('data-theme', newTheme);
            
            // Switch Icon
            const icon = themeToggleBtn.querySelector('i');
            icon.setAttribute('data-lucide', newTheme === 'dark' ? 'sun' : 'moon');
            lucide.createIcons();
        });
    }

    // 13. Training Filtering Grid
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.filter-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetFilter = btn.getAttribute('data-filter');

            filterItems.forEach(item => {
                item.classList.remove('fade-in');
                item.classList.add('hidden');

                if (targetFilter === 'all' || item.getAttribute('data-category') === targetFilter) {
                    // Slight delay to allow CSS reflow
                    setTimeout(() => {
                        item.classList.remove('hidden');
                        item.classList.add('fade-in');
                    }, 50);
                }
            });
        });
    });

    // 14. Typewriter Effect
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const phrases = {
            en: ["Safety Standards", "Corporate Audits", "HSE Training"],
            ar: ["معايير السلامة", "التدقيق المؤسسي", "تدريب الصحة والسلامة"]
        };
        
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;

        function type() {
            const currentLang = document.body.classList.contains('rtl') ? 'ar' : 'en';
            const currentPhrases = phrases[currentLang];
            const currentString = currentPhrases[phraseIndex];

            if (isDeleting) {
                typewriterEl.textContent = currentString.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = 50;
            } else {
                typewriterEl.textContent = currentString.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 100;
            }

            if (!isDeleting && charIndex === currentString.length) {
                typingDelay = 2000; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % currentPhrases.length;
                typingDelay = 500; // Pause before typing new word
            }

            setTimeout(type, typingDelay);
        }

        // Start typing effect slightly after load
        setTimeout(type, 1000);
    }
});

// 15. Window OnLoad Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500); // Give it a slight delay so user sees it successfully loaded
    }
});
