// Main JavaScript file for Chyster Website
// Gestion des interactions principales et initialisation

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Chyster Website - Loaded and Ready!');
    
    // Initialisation des effets visuels
    initializeVisualEffects();
    
    // Gestion du smooth scroll pour les liens de navigation
    initializeSmoothScroll();
});

function initializeVisualEffects() {
    // Ajouter des classes d'animation aux cartes après chargement
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('card-loaded');
        }, index * 100);
    });
}

function initializeSmoothScroll() {
    // Smooth scroll pour tous les liens internes
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Fonction utilitaire pour détecter si on est sur mobile
function isMobileDevice() {
    return window.innerWidth <= 768;
}

// Export pour utilisation dans d'autres scripts
window.ChysterUtils = {
    isMobileDevice
};