/* ===================================
   CHYSTER - Mobile-First JavaScript
   Progressive Enhancement for mobile
   =================================== */

(function() {
    'use strict';

    // State management
    const state = {
        playerCount: 4,
        mobileNavOpen: false,
        isTouch: false
    };

    // DOM elements cache
    const elements = {
        navToggle: null,
        navMenu: null,
        hamburger: null,
        playerCountDisplay: null,
        playerDecrement: null,
        playerIncrement: null,
        cardTarget: null,
        warningMessage: null,
        ruleHeaders: null
    };

    // Touch detection
    function detectTouch() {
        state.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (state.isTouch) {
            document.body.classList.add('touch-device');
        }
    }

    // Cache DOM elements
    function cacheElements() {
        elements.navToggle = document.querySelector('.nav__toggle');
        elements.navMenu = document.querySelector('.nav__menu');
        elements.hamburger = document.querySelector('.hamburger');
        elements.playerCountDisplay = document.querySelector('#player-count');
        elements.playerDecrement = document.querySelector('#decrease-players');
        elements.playerIncrement = document.querySelector('#increase-players');
        elements.cardTarget = document.querySelector('#cards-needed');
        elements.warningMessage = document.querySelector('#warning-message');
        elements.ruleHeaders = document.querySelectorAll('.rule-header');
    }

    // Mobile navigation toggle
    function toggleMobileNav() {
        state.mobileNavOpen = !state.mobileNavOpen;
        
        if (elements.navMenu) {
            elements.navMenu.classList.toggle('active', state.mobileNavOpen);
        }
        
        if (elements.navToggle) {
            elements.navToggle.setAttribute('aria-expanded', state.mobileNavOpen);
        }
        
        // Animate hamburger
        if (elements.hamburger) {
            elements.hamburger.style.transform = state.mobileNavOpen 
                ? 'rotate(45deg)' 
                : 'rotate(0deg)';
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = state.mobileNavOpen ? 'hidden' : '';
    }

    // Close mobile nav when clicking on links
    function closeMobileNav() {
        if (state.mobileNavOpen) {
            toggleMobileNav();
        }
    }

    // Player counter functionality
    function updatePlayerCount(action) {
        const oldCount = state.playerCount;
        
        if (action === 'increment' && state.playerCount < 10) {
            state.playerCount++;
        } else if (action === 'decrement' && state.playerCount > 2) {
            state.playerCount--;
        }
        
        // Only update DOM if value changed
        if (oldCount !== state.playerCount) {
            updatePlayerDisplay();
            
            // Add subtle animation feedback
            if (elements.playerCountDisplay) {
                elements.playerCountDisplay.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    elements.playerCountDisplay.style.transform = 'scale(1)';
                }, 150);
            }
        }
    }

    // Update player count display and card calculation
    function updatePlayerDisplay() {
        if (elements.playerCountDisplay) {
            elements.playerCountDisplay.value = state.playerCount;
        }
        
        if (elements.cardTarget) {
            elements.cardTarget.textContent = calculateCardsForChyster(state.playerCount);
        }
        
        // Gérer l'avertissement
        if (elements.warningMessage) {
            if (state.playerCount >= 8) {
                elements.warningMessage.textContent = "À autant, ça risque d'être le bordel (on t'aura prévenu)";
                elements.warningMessage.style.display = 'block';
                elements.warningMessage.classList.add('visible');
            } else {
                elements.warningMessage.textContent = '';
                elements.warningMessage.style.display = 'none';
                elements.warningMessage.classList.remove('visible');
            }
        }
    }

    // Calculate cards needed to reach Chyster based on players
    function calculateCardsForChyster(players) {
        const cardMapping = {
            2: 11,
            3: 10,
            4: 9,
            5: 8,
            6: 7,
            7: 6,
            8: 5,
            9: 5,
            10: 5
        };
        return cardMapping[players] || 5;
    }

    // Accordion functionality for rules
    function toggleRuleAccordion(header) {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        const content = header.nextElementSibling;
        const toggle = header.querySelector('.rule-toggle');
        
        // Close all other accordions on mobile for better UX
        if (window.innerWidth < 768) {
            elements.ruleHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    closeAccordion(otherHeader);
                }
            });
        }
        
        // Toggle current accordion
        if (isExpanded) {
            closeAccordion(header);
        } else {
            openAccordion(header);
        }
    }

    function openAccordion(header) {
        const content = header.nextElementSibling;
        const toggle = header.querySelector('.rule-toggle');
        
        header.setAttribute('aria-expanded', 'true');
        if (content) {
            content.classList.add('active');
        }
        if (toggle) {
            toggle.style.transform = 'rotate(45deg)';
        }
    }

    function closeAccordion(header) {
        const content = header.nextElementSibling;
        const toggle = header.querySelector('.rule-toggle');
        
        header.setAttribute('aria-expanded', 'false');
        if (content) {
            content.classList.remove('active');
        }
        if (toggle) {
            toggle.style.transform = 'rotate(0deg)';
        }
    }

    // Smooth scroll for anchor links and rule navigation
    function smoothScrollToAnchor(e) {
        const target = e.target.closest('a')?.getAttribute('href');
        
        if (target && target.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(target);
            
            if (element) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const elementPosition = element.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile nav if open
                closeMobileNav();
            }
        }
    }

    // Keyboard navigation support
    function handleKeyboard(e) {
        // Escape key closes mobile nav
        if (e.key === 'Escape' && state.mobileNavOpen) {
            toggleMobileNav();
        }
        
        // Enter/Space for interactive elements
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('rule-header')) {
            e.preventDefault();
            toggleRuleAccordion(e.target);
        }
    }

    // Intersection Observer for animations (progressive enhancement)
    function initIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe sections for fade-in animations
            document.querySelectorAll('section').forEach(section => {
                observer.observe(section);
            });
        }
    }

    // Handle resize events (debounced)
    let resizeTimeout;
    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile nav on desktop
            if (window.innerWidth >= 768 && state.mobileNavOpen) {
                toggleMobileNav();
            }
        }, 250);
    }

    // Event listeners setup
    function bindEvents() {
        // Mobile navigation
        if (elements.navToggle) {
            elements.navToggle.addEventListener('click', toggleMobileNav);
        }

        // Player counter
        if (elements.playerDecrement) {
            elements.playerDecrement.addEventListener('click', () => updatePlayerCount('decrement'));
        }
        if (elements.playerIncrement) {
            elements.playerIncrement.addEventListener('click', () => updatePlayerCount('increment'));
        }

        // Navigation links (main nav and rule nav)
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav__link') || e.target.closest('.rule-nav__link')) {
                smoothScrollToAnchor(e);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Window events
        window.addEventListener('resize', handleResize);
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (state.mobileNavOpen && 
                !elements.navMenu?.contains(e.target) && 
                !elements.navToggle?.contains(e.target)) {
                toggleMobileNav();
            }
        });
    }

    // Performance optimization: Use passive listeners where possible
    function addPassiveListeners() {
        // Touch events for better mobile performance
        if (state.isTouch) {
            document.addEventListener('touchstart', () => {}, { passive: true });
        }
    }

    // Initialize accessibility features
    function initAccessibility() {
        // Set initial ARIA states
        if (elements.navToggle) {
            elements.navToggle.setAttribute('aria-expanded', 'false');
            elements.navToggle.setAttribute('aria-controls', 'nav-menu');
        }
        
        if (elements.navMenu) {
            elements.navMenu.setAttribute('id', 'nav-menu');
        }

        // Set up rule accordion ARIA
        elements.ruleHeaders.forEach((header, index) => {
            const content = header.nextElementSibling;
            const headerId = `rule-header-${index}`;
            const contentId = `rule-content-${index}`;
            
            header.setAttribute('id', headerId);
            header.setAttribute('aria-expanded', 'false');
            header.setAttribute('aria-controls', contentId);
            
            if (content) {
                content.setAttribute('id', contentId);
                content.setAttribute('aria-labelledby', headerId);
            }
        });
    }

    // Error handling wrapper
    function safeExecute(fn, context = 'unknown') {
        try {
            return fn();
        } catch (error) {
            console.warn(`Chyster App Error in ${context}:`, error);
        }
    }

    // Main initialization
    function init() {
        safeExecute(() => {
            detectTouch();
            cacheElements();
            updatePlayerDisplay();
            bindEvents();
            addPassiveListeners();
            initAccessibility();
            initIntersectionObserver();
            initSubSections();
        }, 'initialization');
    }

    // Initialize sub-sections functionality
    function initSubSections() {
        // Make toggleSubSection globally available
        window.toggleSubSection = function(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                const isVisible = section.style.display !== 'none';
                
                // Remove active state from all sub-situation cards
                document.querySelectorAll('.sub-situation-card').forEach(card => {
                    card.classList.remove('active');
                });
                
                // Hide all other sub-sections
                document.querySelectorAll('.sub-section').forEach(s => {
                    s.style.display = 'none';
                });
                
                // Toggle current section
                if (!isVisible) {
                    section.style.display = 'block';
                    
                    // Add active state to the corresponding card
                    const activeCard = document.querySelector(`[onclick="toggleSubSection('${sectionId}')"]`);
                    if (activeCard) {
                        activeCard.classList.add('active');
                    }
                    
                    // Smooth scroll to section
                    setTimeout(() => {
                        section.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'nearest' 
                        });
                    }, 100);
                }
            }
        };
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose limited API for debugging (development only)
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        window.ChysterApp = {
            state,
            updatePlayerCount,
            toggleMobileNav
        };
    }

})();