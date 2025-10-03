document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-3d');
    
    // Ajouter un effet sonore subtil au hover des cartes
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            playCardSound('hover');
        });
        
        card.addEventListener('click', () => {
            playCardSound('flip');
        });
    });
    
    // Sons des cartes
    const sounds = {
        hover: new Audio('sounds/card-hover.mp3'),
        flip: new Audio('sounds/card-flip.mp3')
    };
    
    function playCardSound(type) {
        // Vérifier si le son existe avant de le jouer
        if (sounds[type]) {
            sounds[type].currentTime = 0;
            sounds[type].volume = 0.2;
            sounds[type].play().catch(() => {
                // Gérer silencieusement les erreurs de lecture audio
            });
        }
    }

    // Ajouter un effet parallax subtil aux cartes
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.card-3d');
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
        
        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2;
            const cardCenterY = cardRect.top + cardRect.height / 2;
            
            const distanceX = (e.pageX - cardCenterX) / 20;
            const distanceY = (e.pageY - cardCenterY) / 20;
            
            if (isElementInViewport(card)) {
                card.style.transform = `rotateY(${distanceX}deg) rotateX(${-distanceY}deg)`;
            }
        });
    });
    
    // Vérifier si un élément est visible dans le viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
});