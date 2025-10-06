class ParallaxScroll {
    constructor() {
        this.elements = [];
        this.isScrolling = false;
        this.init();
    }

    init() {
        // Éléments à animer au scroll
        this.elements = [
            {
                element: document.querySelector('.hero__neon-logo'),
                speed: 0.5,
                type: 'translateY'
            },
            {
                element: document.querySelector('.hero__cards-animation'),
                speed: 0.3,
                type: 'translateY'
            }
        ];

        // Ajouter les sections pour l'effet de fade-in (seulement concept, pas rules)
        const sections = document.querySelectorAll('.concept');
        sections.forEach(section => {
            this.elements.push({
                element: section,
                speed: 0.1,
                type: 'fadeIn'
            });
        });

        // Optimisation avec Intersection Observer pour mobile
        this.setupIntersectionObserver();
        
        // Event listener pour le scroll (throttled)
        this.bindScrollEvents();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: [0, 0.1, 0.25, 0.5],
            rootMargin: '100px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
                    entry.target.classList.add('in-view');
                } else if (!entry.isIntersecting) {
                    // Optionnel: retirer la classe si on sort de la vue
                    // entry.target.classList.remove('in-view');
                }
            });
        }, options);

        // Observer les sections avec un déclenchement plus précoce (seulement concept)
        document.querySelectorAll('.concept').forEach(section => {
            this.observer.observe(section);
        });
    }

    bindScrollEvents() {
        // Throttle pour optimiser les performances sur mobile
        let ticking = false;

        const updateParallax = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateElements();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', updateParallax, { passive: true });
    }

    updateElements() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;

        this.elements.forEach(item => {
            if (!item.element) return;

            const elementTop = item.element.offsetTop;
            const elementHeight = item.element.offsetHeight;
            const elementBottom = elementTop + elementHeight;

            // Vérifier si l'élément est visible avec une marge plus large
            if (elementBottom >= scrollTop - 200 && elementTop <= scrollTop + windowHeight + 200) {
                const progress = (scrollTop - elementTop + windowHeight) / (windowHeight + elementHeight);
                
                if (item.type === 'translateY') {
                    // Parallax plus fluide avec easing
                    const translateY = scrollTop * item.speed;
                    item.element.style.transform = `translate3d(0, ${translateY}px, 0)`;
                } else if (item.type === 'fadeIn') {
                    // Déclenchement plus précoce et transition plus douce
                    const opacity = Math.max(0, Math.min(1, (progress + 0.2) * 1.5));
                    const translateY = Math.max(0, (1 - (progress + 0.2)) * 20);
                    item.element.style.opacity = opacity;
                    item.element.style.transform = `translate3d(0, ${translateY}px, 0)`;
                }
            }
        });
    }
}

// Initialiser le parallax quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si on est sur mobile pour optimiser
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile || window.DeviceMotionEvent) {
        new ParallaxScroll();
    }
});