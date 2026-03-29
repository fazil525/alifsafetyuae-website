document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        
        // Toggle icon between menu and x
        const iconElement = menuBtn.querySelector('i');
        if (mobileMenu.classList.contains('active')) {
            iconElement.setAttribute('data-lucide', 'x');
        } else {
            iconElement.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons(); // re-initialize to show new icon
    });

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const iconElement = menuBtn.querySelector('i');
            iconElement.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    // 3. Navbar Sticky Effect on Scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.padding = '16px 0';
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
    });

    // 4. Smooth Scrolling for anchor links (fallback/enhancement)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Account for fixed header height
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 5. Contact Form Submission handling (Prevent default for demo)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simple visual feedback
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.8';
            
            setTimeout(() => {
                btn.textContent = 'Sent Successfully!';
                btn.classList.remove('btn-primary');
                btn.style.backgroundColor = 'var(--primary)';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.opacity = '1';
                }, 3000);
            }, 1000);
        });
    }

    // 6. Gallery Lightbox Logic
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

        const closeLightbox = () => {
            lightbox.classList.remove('active');
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        // Close when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // 7. Metrics Counter Animation
    const metricNumbers = document.querySelectorAll('.metric-number');
    let hasCounted = false;

    const startCounting = () => {
        if (hasCounted) return;
        hasCounted = true;
        
        metricNumbers.forEach(metric => {
            const target = +metric.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // ~60fps
            
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

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            startCounting();
            // Disconnect once counted
            observer.disconnect();
        }
    }, { threshold: 0.5 });

    const metricsSection = document.querySelector('.metrics-banner');
    if (metricsSection) {
        observer.observe(metricsSection);
    }

    // 8. Scroll Reveal Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observerStyle) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observerStyle.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
});
