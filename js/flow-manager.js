/**
 * CHYSTER - Gestionnaire de flux de jeu
 * Gère la navigation dynamique dans les règles selon l'état du jeu
 */

class FlowManager {
    constructor() {
        this.gameState = {
            cardsCount: 0,
            selectedCard: null,
            situation: null,
            powerUsed: false,
            playersCount: 4,
            chysterTarget: 9
        };
        this.init();
    }

    init() {
        this.initGameStateTracker();
        this.initCardInput();
        this.initFlowNavigation();
        this.initPlayerCountSync();
        this.updateFlowDisplay();
    }

    // === SYNCHRONISATION AVEC LE NOMBRE DE JOUEURS ===
    initPlayerCountSync() {
        const playerCountElement = document.getElementById('player-count');
        if (playerCountElement) {
            // Initial sync
            this.gameState.playersCount = parseInt(playerCountElement.value) || 4;
            this.updateChysterTarget();
            
            // Listen for changes
            playerCountElement.addEventListener('input', () => {
                this.gameState.playersCount = parseInt(playerCountElement.value) || 4;
                this.updateChysterTarget();
                this.updateFlowDisplay();
            });
        }
    }

    updateChysterTarget() {
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
        this.gameState.chysterTarget = cardMapping[this.gameState.playersCount] || 5;
    }

    // === GESTION DE L'ÉTAT DU JEU ===
    initGameStateTracker() {
        // Note: The actual counter logic is handled in index.html
        // This method now only handles synchronization with the main game state
        this.syncWithMainGameState();
    }

    syncWithMainGameState() {
        // Sync with the global gameState from index.html
        if (window.gameState) {
            this.gameState.cardsCount = window.gameState.cardsCount || 0;
            this.gameState.chysterTarget = window.gameState.chysterTarget || 9;
        }
        
        // Set up interval to periodically sync
        setInterval(() => {
            if (window.gameState) {
                this.gameState.cardsCount = window.gameState.cardsCount || 0;
                this.gameState.chysterTarget = window.gameState.chysterTarget || 9;
            }
        }, 100);
    }

    updateProgress() {
        // Always sync with current player count first
        const playerCountElement = document.getElementById('player-count');
        if (playerCountElement) {
            this.gameState.playersCount = parseInt(playerCountElement.value) || 4;
            this.updateChysterTarget();
        }
        
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        
        if (progressBar && progressText) {
            const target = this.gameState.chysterTarget;
            const progress = Math.min(this.gameState.cardsCount / target * 100, 100);
            
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${this.gameState.cardsCount}/${target} cartes`;
            
            // Update chyster target display
            const chysterTargetEl = document.querySelector('#chyster-target');
            if (chysterTargetEl) {
                chysterTargetEl.textContent = `${target} cartes`;
            }
        }
    }

    // === INTERFACE DE SAISIE DES CARTES ===
    initCardInput() {
        this.setupCardInputEventListeners();
    }

    // Setup or re-setup card input event listeners
    setupCardInputEventListeners() {
        // Remove existing listeners to avoid duplicates
        this.removeCardInputEventListeners();

        // Boutons de valeur
        const valueButtons = document.querySelectorAll('.value-btn');
        console.log(`Setting up ${valueButtons.length} value buttons`);
        
        valueButtons.forEach(btn => {
            const handleValueClick = (e) => {
                e.preventDefault();
                console.log(`Value button clicked: ${btn.textContent}`);
                
                // Désélectionner les autres
                valueButtons.forEach(b => b.classList.remove('selected'));
                // Sélectionner celui-ci
                btn.classList.add('selected');
                
                this.gameState.selectedCard = this.gameState.selectedCard || {};
                this.gameState.selectedCard.value = btn.textContent;
                this.updateCardPreview();
                this.updateValidateButton();
            };
            
            btn.addEventListener('click', handleValueClick);
            // Store reference for cleanup
            btn._handleValueClick = handleValueClick;
        });

        // Boutons de couleur
        const suitButtons = document.querySelectorAll('.suit-btn');
        console.log(`Setting up ${suitButtons.length} suit buttons`);
        
        suitButtons.forEach(btn => {
            const handleSuitClick = (e) => {
                e.preventDefault();
                console.log(`Suit button clicked: ${btn.textContent}`);
                
                // Désélectionner les autres
                suitButtons.forEach(b => b.classList.remove('selected'));
                // Sélectionner celui-ci
                btn.classList.add('selected');
                
                this.gameState.selectedCard = this.gameState.selectedCard || {};
                this.gameState.selectedCard.suit = btn.textContent;
                this.gameState.selectedCard.color = btn.dataset.color;
                this.updateCardPreview();
                this.updateValidateButton();
            };
            
            btn.addEventListener('click', handleSuitClick);
            // Store reference for cleanup
            btn._handleSuitClick = handleSuitClick;
        });
        
        console.log('Card input event listeners setup completed');
    }

    // Remove existing event listeners to prevent duplicates
    removeCardInputEventListeners() {
        const valueButtons = document.querySelectorAll('.value-btn');
        valueButtons.forEach(btn => {
            if (btn._handleValueClick) {
                btn.removeEventListener('click', btn._handleValueClick);
                delete btn._handleValueClick;
            }
        });

        const suitButtons = document.querySelectorAll('.suit-btn');
        suitButtons.forEach(btn => {
            if (btn._handleSuitClick) {
                btn.removeEventListener('click', btn._handleSuitClick);
                delete btn._handleSuitClick;
            }
        });
    }

    // Update validate button state
    updateValidateButton() {
        const validateButton = document.getElementById('validate-card');
        if (validateButton) {
            const hasValue = this.gameState.selectedCard?.value;
            const hasSuit = this.gameState.selectedCard?.suit;
            const isComplete = hasValue && hasSuit;
            
            validateButton.disabled = !isComplete;
            
            // Update button text to reflect state
            if (isComplete) {
                validateButton.textContent = 'Valider ma carte →';
                validateButton.classList.add('btn--primary');
            } else {
                validateButton.textContent = 'Sélectionnez valeur + couleur';
                validateButton.classList.remove('btn--primary');
            }
        }
    }

    updateCardPreview() {
        const previewCard = document.querySelector('.preview-card');
        const previewText = document.querySelector('.preview-text');
        
        if (previewCard && this.gameState.selectedCard) {
            const { value, suit, color } = this.gameState.selectedCard;
            
            if (value && suit) {
                // Clear existing content
                previewCard.innerHTML = '';
                
                // Add card content
                const valueDiv = document.createElement('div');
                valueDiv.style.fontSize = '14px';
                valueDiv.textContent = value;
                
                const suitDiv = document.createElement('div');
                suitDiv.style.fontSize = '20px';
                suitDiv.textContent = suit;
                
                previewCard.appendChild(valueDiv);
                previewCard.appendChild(suitDiv);
                
                // Update class
                previewCard.className = `preview-card ${color}`;
                
                // Update preview text
                if (previewText) {
                    previewText.textContent = `Votre carte: ${value} de ${this.getSuitName(suit)}`;
                }
                
                // Déclencher l'analyse de la situation
                this.analyzeSituation();
            } else {
                // Partial selection - show what's selected so far
                previewCard.innerHTML = '<span class="preview-text">Sélectionnez une carte</span>';
                previewCard.className = 'preview-card';
                
                if (value && !suit) {
                    previewCard.innerHTML = `<div style="font-size: 16px;">${value}<br><small>Choisissez une couleur</small></div>`;
                } else if (!value && suit) {
                    previewCard.innerHTML = `<div style="font-size: 20px; color: ${color === 'rouge' ? '#EF4444' : '#6B7280'};">${suit}<br><small>Choisissez une valeur</small></div>`;
                }
            }
        }
    }

    getSuitName(suit) {
        const suitNames = {
            '♠': 'Pique',
            '♥': 'Cœur', 
            '♦': 'Carreau',
            '♣': 'Trèfle'
        };
        return suitNames[suit] || suit;
    }

    // === ANALYSE DE SITUATION ===
    analyzeSituation() {
        if (!this.gameState.selectedCard?.value) return;
        
        const value = this.gameState.selectedCard.value;
        
        // Déterminer la situation
        if (value === 'A') {
            this.gameState.situation = 'as-choice';
        } else if (['J', 'Q', 'K'].includes(value)) {
            this.gameState.situation = 'figure';
        } else if (this.gameState.cardsCount >= this.gameState.chysterTarget) {
            this.gameState.situation = 'chyster-eligible';
        } else {
            this.gameState.situation = 'normal';
        }
        
        this.updateSituationDisplay();
    }

    updateSituationDisplay() {
        const situationText = document.querySelector('.situation-text');
        const situationHelp = document.querySelector('.situation-help');
        
        if (situationText && situationHelp) {
            switch (this.gameState.situation) {
                case 'as-choice':
                    situationText.textContent = 'As tiré - Choix stratégique';
                    situationHelp.textContent = 'Vous pouvez choisir la couleur ou continuer normalement';
                    break;
                case 'figure':
                    situationText.textContent = 'Figure tirée - Vérification directe';
                    situationHelp.textContent = 'Passez directement à la vérification';
                    break;
                case 'chyster-eligible':
                    situationText.textContent = 'Éligible au Chyster';
                    situationHelp.textContent = 'Vous pouvez utiliser le pouvoir Chyster';
                    break;
                case 'normal':
                    situationText.textContent = 'Situation normale';
                    situationHelp.textContent = 'Continuez avec le flux standard';
                    break;
            }
        }
    }

    // === NAVIGATION DE FLUX ===
    initFlowNavigation() {
        // Boutons de choix de couleur pour As
        const colorChoiceButtons = document.querySelectorAll('.color-choice-btn');
        colorChoiceButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                colorChoiceButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                
                const color = btn.dataset.color;
                this.showSelectedColor(color);
            });
        });

        // Options stratégiques pour As
        const choiceOptions = document.querySelectorAll('.choice-option');
        choiceOptions.forEach(option => {
            option.addEventListener('click', () => {
                const choice = option.dataset.choice;
                this.handleAsChoice(choice);
            });
        });

        // Sélecteur de cible pour Chyster
        const targetSelector = document.querySelector('.target-selector');
        if (targetSelector) {
            targetSelector.addEventListener('change', (e) => {
                this.handleChysterTarget(e.target.value);
            });
        }
    }

    showSelectedColor(color) {
        const selectedColorDiv = document.querySelector('.selected-color');
        if (selectedColorDiv) {
            const colorNames = {
                'rouge': 'Rouge (♥ ♦)',
                'noir': 'Noir (♠ ♣)'
            };
            selectedColorDiv.innerHTML = `
                <strong>Couleur choisie:</strong> ${colorNames[color]}
            `;
            selectedColorDiv.style.display = 'block';
        }
    }

    handleAsChoice(choice) {
        if (choice === 'color') {
            // Montrer l'interface de choix de couleur
            this.showColorChoice();
        } else {
            // Continuer normalement
            this.continueNormalFlow();
        }
    }

    handleChysterTarget(target) {
        console.log('Cible Chyster sélectionnée:', target);
        // Logique pour appliquer le pouvoir Chyster
    }

    // === MISE À JOUR DE L'AFFICHAGE ===
    updateFlowDisplay() {
        // Always sync with current player count first
        const playerCountElement = document.getElementById('player-count');
        if (playerCountElement) {
            this.gameState.playersCount = parseInt(playerCountElement.value) || 4;
            this.updateChysterTarget();
        }
        
        // Mettre à jour l'affichage selon l'état actuel
        const cardsCount = this.gameState.cardsCount;
        const chysterTarget = this.gameState.chysterTarget;
        
        // Afficher/masquer les sections selon le nombre de cartes et le target
        this.toggleSectionVisibility('chyster-section', cardsCount >= chysterTarget);
        this.toggleSectionVisibility('essais-section', cardsCount < chysterTarget);
        
        // Mettre à jour les indicateurs
        this.updateStateIndicators();
    }

    toggleSectionVisibility(sectionId, show) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = show ? 'block' : 'none';
        }
    }

    updateStateIndicators() {
        // Mettre à jour tous les indicateurs visuels
        const indicators = document.querySelectorAll('[data-state-indicator]');
        indicators.forEach(indicator => {
            const type = indicator.dataset.stateIndicator;
            const value = this.gameState[type];
            if (value !== undefined) {
                indicator.textContent = value;
            }
        });
    }

    // === MÉTHODES UTILITAIRES ===
    triggerChysterAchievement() {
        // Call the global achievement function if it exists
        if (typeof showChysterAchievement === 'function') {
            showChysterAchievement();
            setTimeout(() => {
                if (typeof redirectToChysterSection === 'function') {
                    redirectToChysterSection();
                }
            }, 1500);
        }
    }

    showColorChoice() {
        const colorChoiceSection = document.querySelector('.color-choice-section');
        if (colorChoiceSection) {
            colorChoiceSection.style.display = 'block';
        }
    }

    continueNormalFlow() {
        // Rediriger vers la section appropriée
        console.log('Continuation du flux normal');
    }

    resetGameState() {
        this.gameState = {
            cardsCount: 0,
            selectedCard: null,
            situation: null,
            powerUsed: false,
            playersCount: parseInt(document.getElementById('player-count')?.value) || 4,
            chysterTarget: this.gameState.chysterTarget
        };
        this.updateChysterTarget();
        this.updateProgress();
        this.updateFlowDisplay();
        
        // Reset card selection interface
        this.resetCardSelection();
    }

    // Reset card selection interface
    resetCardSelection() {
        // Clear selected state from all buttons
        document.querySelectorAll('.value-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        document.querySelectorAll('.suit-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Reset preview
        const previewCard = document.querySelector('.preview-card');
        if (previewCard) {
            previewCard.innerHTML = '<span class="preview-text">Sélectionnez une carte</span>';
            previewCard.className = 'preview-card';
        }
        
        // Reset validate button
        const validateButton = document.getElementById('validate-card');
        if (validateButton) {
            validateButton.disabled = true;
        }
        
        // Clear selected card
        this.gameState.selectedCard = null;
        
        // Re-setup event listeners to ensure they work
        this.setupCardInputEventListeners();
    }

    // Public method to reinitialize card input (can be called from external code)
    reinitializeCardInput() {
        this.setupCardInputEventListeners();
        this.resetCardSelection();
    }

    // Get current selected card
    getSelectedCard() {
        return this.gameState.selectedCard;
    }

    // Set selected card (for external synchronization)
    setSelectedCard(card) {
        this.gameState.selectedCard = card;
        this.updateCardPreview();
        this.updateValidateButton();
    }
}

// Initialiser le gestionnaire de flux quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    window.flowManager = new FlowManager();
});