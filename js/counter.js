document.addEventListener('DOMContentLoaded', () => {
    const decreaseBtn = document.getElementById('decreasePlayers');
    const increaseBtn = document.getElementById('increasePlayers');
    const playerCount = document.getElementById('playerCount');
    const cardTarget = document.getElementById('cardTarget');
    const playerWarning = document.getElementById('playerWarning');

    // Calculer le nombre de cartes cible en fonction du nombre de joueurs
    const calculateTargetCards = (players) => {
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
    };

    // Mettre à jour l'affichage
    const updateDisplay = (players) => {
        playerCount.textContent = players;
        cardTarget.textContent = calculateTargetCards(players);
        
        // Gérer l'avertissement
        if (players >= 8) {
            playerWarning.textContent = "À autant, ça risque d'être le bordel (on t'aura prévenu)";
            playerWarning.classList.add('visible');
        } else {
            playerWarning.textContent = '';
            playerWarning.classList.remove('visible');
        }
    };

    // Gestionnaires d'événements pour les boutons
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(playerCount.textContent);
        if (currentValue > 2) {
            updateDisplay(currentValue - 1);
        }
    });

    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(playerCount.textContent);
        if (currentValue < 10) {
            updateDisplay(currentValue + 1);
        }
    });

    // Animation des boutons
    [decreaseBtn, increaseBtn].forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'scale(1)';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
        });
    });

    // Initialisation
    updateDisplay(2);
});