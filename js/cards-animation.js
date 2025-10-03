class FallingCard {
    constructor() {
        this.card = document.createElement('div');
        this.card.className = 'falling-card';
        this.reset();
    }

    reset() {
        // Position aléatoire sur l'axe X
        this.x = Math.random() * window.innerWidth;
        // Débute au-dessus de l'écran
        this.y = -100;
        // Vitesse et rotation aléatoires
        this.speed = 1 + Math.random() * 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 2;

        this.card.style.left = `${this.x}px`;
        this.card.style.top = `${this.y}px`;
        this.card.style.transform = `rotate(${this.rotation}deg)`;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        
        this.card.style.top = `${this.y}px`;
        this.card.style.transform = `rotate(${this.rotation}deg)`;

        // Si la carte sort de l'écran, la réinitialiser
        if (this.y > window.innerHeight + 100) {
            this.reset();
        }
    }
}

class CardsAnimation {
    constructor() {
        this.container = document.querySelector('.hero__cards-animation');
        this.cards = [];
        this.numberOfCards = 20;
        this.init();
        this.animate();
    }

    init() {
        // Créer les cartes
        for (let i = 0; i < this.numberOfCards; i++) {
            const card = new FallingCard();
            this.container.appendChild(card.card);
            this.cards.push(card);
        }
    }

    animate() {
        // Mettre à jour la position de chaque carte
        this.cards.forEach(card => card.update());
        requestAnimationFrame(() => this.animate());
    }
}

// Initialiser l'animation quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    new CardsAnimation();
});