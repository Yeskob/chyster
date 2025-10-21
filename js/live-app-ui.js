/* ===================================
   CHYSTER LIVE APP - UI COMPONENTS
   Screen components and UI rendering
   =================================== */

/**
 * UI namespace for screen components and rendering
 */
const ChysterUI = {
    
    /**
     * Current screen state
     */
    currentScreen: 'home',
    
    /**
     * App container element
     */
    appContainer: null,
    
    /**
     * Current player count for setup screen
     */
    currentPlayerCount: 4,
    
    /**
     * Initialize UI system
     */
    init() {
        console.log('🖥️ ChysterUI: Starting initialization...');
        
        try {
            // Wait for DOM to be fully loaded
            if (document.readyState === 'loading') {
                console.log('🖥️ ChysterUI: DOM still loading, waiting...');
                return new Promise((resolve, reject) => {
                    document.addEventListener('DOMContentLoaded', () => {
                        console.log('🖥️ ChysterUI: DOM loaded, proceeding with init...');
                        this.initInternal().then(resolve).catch(reject);
                    });
                });
            } else {
                console.log('🖥️ ChysterUI: DOM ready, proceeding with init...');
                return this.initInternal();
            }
            
        } catch (error) {
            console.error('❌ ChysterUI: Initialization failed:', error);
            // Fallback: show basic error in the body
            this.showFallbackError(error);
            throw error;
        }
    },
    
    /**
     * Internal initialization logic
     */
    initInternal() {
        console.log('🖥️ ChysterUI: Looking for app container...');
        
        // Try to find the container
        this.appContainer = document.getElementById('app');
        
        if (!this.appContainer) {
            console.warn('🖥️ ChysterUI: App container not found, creating one...');
            
            // Create the container if it doesn't exist
            this.appContainer = document.createElement('div');
            this.appContainer.id = 'app';
            this.appContainer.className = 'app-container';
            this.appContainer.style.cssText = 'min-height: 100vh; width: 100%; padding: 0; margin: 0;';
            
            // Insert it in the body
            if (document.body) {
                // Clear body and add our container
                document.body.innerHTML = '';
                document.body.appendChild(this.appContainer);
                console.log('✅ ChysterUI: App container created and added to body');
            } else {
                console.error('❌ ChysterUI: No body element found');
                throw new Error('No body element found');
            }
        } else {
            console.log('✅ ChysterUI: App container found');
        }
        
        // Render initial screen
        console.log('🖥️ ChysterUI: Rendering initial home screen...');
        this.renderScreen('home');
        
        // Ensure other required containers exist
        this.ensureRequiredContainers();
        
        console.log('✅ ChysterUI: Initialization completed successfully');
    },
    
    /**
     * Ensure all required containers exist
     */
    ensureRequiredContainers() {
        // Toast container
        if (!document.getElementById('toast-container')) {
            const toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            toastContainer.setAttribute('aria-live', 'polite');
            toastContainer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(toastContainer);
            console.log('✅ ChysterUI: Toast container created');
        }
        
        // Loading overlay
        if (!document.getElementById('loading-overlay')) {
            const loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.style.display = 'none';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Chargement...</p>
            `;
            document.body.appendChild(loadingOverlay);
            console.log('✅ ChysterUI: Loading overlay created');
        }
    },
    
    /**
     * Show fallback error when initialization fails
     */
    showFallbackError(error) {
        const errorHTML = `
            <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; border: 1px solid #f44336; border-radius: 8px; background: #ffebee;">
                <h1 style="color: #d32f2f; margin-bottom: 20px;">❌ Erreur d'initialisation</h1>
                <p style="color: #666; margin-bottom: 20px;">L'application Chyster Live App n'a pas pu démarrer correctement.</p>
                <p style="color: #333; font-weight: bold; margin-bottom: 20px;">Détails: ${error.message}</p>
                <div style="margin: 20px 0;">
                    <button onclick="location.reload()" style="padding: 10px 20px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 0 10px;">
                        🔄 Recharger
                    </button>
                    <button onclick="console.log('Debug info:', {readyState: document.readyState, elements: Array.from(document.querySelectorAll('[id]')).map(el => el.id)})" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 0 10px;">
                        🔍 Debug (Console)
                    </button>
                </div>
                <details style="margin-top: 20px; text-align: left;">
                    <summary style="cursor: pointer; color: #1976d2;">Informations techniques</summary>
                    <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">
Document ready state: ${document.readyState}
User agent: ${navigator.userAgent}
Available elements: ${Array.from(document.querySelectorAll('[id]')).map(el => el.id).join(', ') || 'None'}
                    </pre>
                </details>
            </div>
        `;
        
        // Try to insert error in body, or replace entire body if needed
        try {
            if (document.body) {
                document.body.innerHTML = errorHTML;
            } else {
                // Body doesn't exist yet, wait and try again
                setTimeout(() => {
                    if (document.body) {
                        document.body.innerHTML = errorHTML;
                    }
                }, 100);
            }
        } catch (e) {
            console.error('Failed to show fallback error:', e);
        }
    },
    
    /**
     * Render a specific screen
     * @param {string} screenName - Name of screen to render
     * @param {Object} [data] - Optional data to pass to screen
     */
    renderScreen(screenName, data = {}) {
        if (!this.appContainer) return;
        
        this.currentScreen = screenName;
        
        // Clear container and render new screen
        this.appContainer.innerHTML = '';
        
        switch (screenName) {
            case 'home':
                this.renderHomeScreen();
                break;
            case 'setup':
                this.renderSetupScreen(data);
                break;
            case 'table':
                this.renderTableScreen(data);
                break;
            case 'rules':
                this.renderRulesScreen();
                break;
            default:
                console.error(`Unknown screen: ${screenName}`);
                this.renderHomeScreen();
        }
        
        // Trigger screen change event
        this.onScreenChange(screenName);
    },
    
    /**
     * Home screen (Écran A)
     */
    renderHomeScreen() {
        const homeHTML = `
            <div class="screen home-screen">
                <!-- Header -->
                <header class="home-header">
                    <div class="container">
                        <div class="logo-container text-center">
                            <h1 class="logo-text">CHYSTER</h1>
                            <p class="logo-subtitle">Live App</p>
                        </div>
                    </div>
                </header>
                
                <!-- Hero Section -->
                <main class="home-main">
                    <div class="container">
                        <section class="hero text-center">
                            <h2 class="hero-title">
                                Le jeu qui met l'amitié 
                                <span class="highlight">à l'épreuve</span>
                            </h2>
                            <p class="hero-subtitle text-muted mb-6">
                                Jouez en temps réel avec l'app officielle Chyster. 
                                Cartes, règles, et compétition... tout est géré automatiquement !
                            </p>
                            
                            <!-- CTA Buttons -->
                            <div class="cta-group">
                                <button id="btn-start-game" class="btn btn--primary btn--large btn--full mb-3">
                                    🎮 Jouer
                                </button>
                                <button id="btn-view-rules" class="btn btn--secondary btn--full">
                                    📖 Voir les règles
                                </button>
                            </div>
                        </section>
                        
                        <!-- Features Preview -->
                        <section class="features mt-6">
                            <div class="feature-grid">
                                <div class="feature-item card">
                                    <div class="feature-icon">⚡</div>
                                    <h3 class="feature-title">Temps réel</h3>
                                    <p class="feature-desc">Jeu automatisé, cartes virtuelles, plus besoin de deck physique</p>
                                </div>
                                <div class="feature-item card">
                                    <div class="feature-icon">🎯</div>
                                    <h3 class="feature-title">Règles intégrées</h3>
                                    <p class="feature-desc">L'app gère toutes les règles, cartes spéciales et calculs Chyster</p>
                                </div>
                                <div class="feature-item card">
                                    <div class="feature-icon">👥</div>
                                    <h3 class="feature-title">2-8+ joueurs</h3>
                                    <p class="feature-desc">Parfait pour les petits groupes comme les grandes soirées</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
                
                <!-- Footer -->
                <footer class="home-footer">
                    <div class="container text-center">
                        <p class="footer-text text-muted">
                            <strong>⚠️ Jouez responsable</strong><br>
                            <small>Ce jeu implique de la consommation d'alcool. Respectez vos limites et les lois locales.</small>
                        </p>
                    </div>
                </footer>
            </div>
        `;
        
        this.appContainer.innerHTML = homeHTML;
        
        // Bind event listeners
        this.bindHomeEvents();
    },
    
    /**
     * Bind events for home screen
     */
    bindHomeEvents() {
        const startBtn = document.getElementById('btn-start-game');
        const rulesBtn = document.getElementById('btn-view-rules');
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.renderScreen('setup');
            });
        }
        
        if (rulesBtn) {
            rulesBtn.addEventListener('click', () => {
                this.renderScreen('rules');
            });
        }
    },
    
    /**
     * Setup screen (Écran B)
     * @param {Object} data - Setup data
     */
    renderSetupScreen(data = {}) {
        const setupHTML = `
            <div class="screen setup-screen">
                <!-- Header with back button -->
                <header class="screen-header">
                    <div class="container">
                        <div class="flex items-center justify-between">
                            <button id="btn-back" class="btn btn--secondary btn--small">
                                ← Retour
                            </button>
                            <h1 class="screen-title">Configuration</h1>
                            <div></div> <!-- Spacer for centering -->
                        </div>
                    </div>
                </header>
                
                <!-- Setup Form -->
                <main class="setup-main">
                    <div class="container">
                        <div class="setup-form card">
                            <h2 class="form-title text-center mb-5">
                                Préparez votre partie
                            </h2>
                            
                            <!-- Player Count Selector -->
                            <div class="form-group mb-5">
                                <label class="form-label" for="player-count">
                                    Nombre de joueurs
                                </label>
                                <div class="player-selector">
                                    <button id="btn-decrease" class="btn btn--secondary" aria-label="Diminuer le nombre de joueurs">-</button>
                                    <div class="player-display">
                                        <span id="player-count" class="player-number">4</span>
                                        <span class="player-label">joueurs</span>
                                    </div>
                                    <button id="btn-increase" class="btn btn--secondary" aria-label="Augmenter le nombre de joueurs">+</button>
                                </div>
                            </div>
                            
                            <!-- Chyster Target Info -->
                            <div class="chyster-info mb-6">
                                <div class="info-card">
                                    <div class="info-icon">🎯</div>
                                    <div class="info-content">
                                        <h3 class="info-title">Objectif Chyster</h3>
                                        <p id="chyster-target" class="info-value">9 cartes</p>
                                        <p class="info-desc text-muted">
                                            Nombre de cartes à atteindre pour déclencher la Chyster
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Player Names (Future Enhancement) -->
                            <div class="player-names-section mb-6">
                                <h3 class="section-title mb-3">Noms des joueurs (optionnel)</h3>
                                <div id="player-names-container">
                                    <!-- Player name inputs will be generated here -->
                                </div>
                                <p class="text-muted text-center">
                                    Laissez vide pour utiliser "Joueur 1", "Joueur 2", etc.
                                </p>
                            </div>
                            
                            <!-- Start Game Button -->
                            <button id="btn-start-game" class="btn btn--primary btn--large btn--full">
                                🚀 Démarrer la partie
                            </button>
                        </div>
                    </div>
                </main>
                
                <!-- Footer -->
                <footer class="screen-footer">
                    <div class="container text-center">
                        <p class="footer-text text-muted">
                            <small>⚠️ Rappel : Jouez responsable et respectez vos limites</small>
                        </p>
                    </div>
                </footer>
            </div>
        `;
        
        this.appContainer.innerHTML = setupHTML;
        
        // Bind events and initialize setup logic
        this.bindSetupEvents();
        this.initSetupLogic();
    },
    
    /**
     * Rules screen (static display)
     */
    renderRulesScreen() {
        const rulesHTML = `
            <div class="screen rules-screen">
                <!-- Header -->
                <header class="screen-header">
                    <div class="container">
                        <div class="flex items-center justify-between">
                            <button id="btn-back" class="btn btn--secondary btn--small">
                                ← Retour
                            </button>
                            <h1 class="screen-title">Règles</h1>
                            <div></div>
                        </div>
                    </div>
                </header>
                
                <!-- Rules Content -->
                <main class="rules-main">
                    <div class="container">
                        <div class="rules-content">
                            <div class="card mb-4">
                                <h2>📖 Règles officielles Chyster</h2>
                                <p class="text-muted">
                                    Voici l'essentiel des règles du jeu. L'app se charge de tout gérer automatiquement !
                                </p>
                            </div>
                            
                            <!-- Quick Rules Overview -->
                            <div class="rules-section card mb-4">
                                <h3>🎯 Objectif</h3>
                                <p>Atteindre <strong>la Chyster</strong> en posant le bon nombre de cartes selon le nombre de joueurs :</p>
                                <ul class="rules-list">
                                    <li><strong>2 joueurs</strong> → 11 cartes</li>
                                    <li><strong>3 joueurs</strong> → 10 cartes</li>
                                    <li><strong>4 joueurs</strong> → 9 cartes</li>
                                    <li><strong>5 joueurs</strong> → 8 cartes</li>
                                    <li><strong>6 joueurs</strong> → 7 cartes</li>
                                    <li><strong>7 joueurs</strong> → 6 cartes</li>
                                    <li><strong>8+ joueurs</strong> → 5 cartes</li>
                                </ul>
                            </div>
                            
                            <div class="rules-section card mb-4">
                                <h3>🎮 Comment jouer</h3>
                                <ol class="rules-list">
                                    <li><strong>Devine la couleur</strong> (Rouge ou Noir) de la prochaine carte</li>
                                    <li><strong>Si correct</strong> → Place la carte dans ta rangée</li>
                                    <li><strong>Si incorrect</strong> → Conséquences selon les règles</li>
                                    <li><strong>Répète</strong> jusqu'à atteindre la Chyster</li>
                                </ol>
                            </div>
                            
                            <div class="rules-section card mb-4">
                                <h3>🃏 Cartes spéciales</h3>
                                <div class="special-cards-grid">
                                    <div class="special-card-item">
                                        <strong>Valet (V)</strong><br>
                                        <small>Shifu-bois entre 2 joueurs</small>
                                    </div>
                                    <div class="special-card-item">
                                        <strong>Dame (D)</strong><br>
                                        <small>Dernier à dire le mot boit</small>
                                    </div>
                                    <div class="special-card-item">
                                        <strong>Roi (R)</strong><br>
                                        <small>Joker de protection</small>
                                    </div>
                                    <div class="special-card-item">
                                        <strong>As (A)</strong><br>
                                        <small>1 pour toi ou 10 pour un autre</small>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="rules-section card">
                                <h3>🏆 La Chyster</h3>
                                <p>Quand tu atteins le nombre de cartes requis :</p>
                                <ul class="rules-list">
                                    <li><strong>Chyster standard</strong> → Choisis 1 joueur qui boit toutes tes cartes</li>
                                    <li><strong>Chyster Royale</strong> → Si toutes tes cartes sont de la même couleur, double distribution !</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        `;
        
        this.appContainer.innerHTML = rulesHTML;
        this.bindRulesEvents();
    },
    
    /**
     * Bind events for setup screen
     */
    bindSetupEvents() {
        const backBtn = document.getElementById('btn-back');
        const decreaseBtn = document.getElementById('btn-decrease');
        const increaseBtn = document.getElementById('btn-increase');
        const startBtn = document.getElementById('btn-start-game');
        
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.renderScreen('home');
            });
        }
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                this.updatePlayerCount(-1);
            });
        }
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                this.updatePlayerCount(1);
            });
        }
        
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startGame();
            });
        }
    },
    
    /**
     * Bind events for rules screen
     */
    bindRulesEvents() {
        const backBtn = document.getElementById('btn-back');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.renderScreen('home');
            });
        }
    },
    
    /**
     * Initialize setup screen logic
     */
    initSetupLogic() {
        this.currentPlayerCount = 4;
        this.updateChysterTarget();
        this.generatePlayerNameInputs();
    },
    
    /**
     * Update player count
     * @param {number} delta - Change in player count
     */
    updatePlayerCount(delta) {
        const newCount = Math.max(2, Math.min(10, this.currentPlayerCount + delta));
        
        if (newCount !== this.currentPlayerCount) {
            this.currentPlayerCount = newCount;
            
            // Update display
            const countElement = document.getElementById('player-count');
            if (countElement) {
                countElement.textContent = newCount;
            }
            
            // Update buttons state
            const decreaseBtn = document.getElementById('btn-decrease');
            const increaseBtn = document.getElementById('btn-increase');
            
            if (decreaseBtn) {
                decreaseBtn.disabled = newCount <= 2;
            }
            if (increaseBtn) {
                increaseBtn.disabled = newCount >= 10;
            }
            
            this.updateChysterTarget();
            this.generatePlayerNameInputs();
        }
    },
    
    /**
     * Update Chyster target display
     */
    updateChysterTarget() {
        const targetElement = document.getElementById('chyster-target');
        if (targetElement && window.ChysterTypes) {
            const target = window.ChysterTypes.CHYSTER_TARGET_MAP[this.currentPlayerCount] || 5;
            targetElement.textContent = `${target} cartes`;
        }
    },
    
    /**
     * Generate player name inputs
     */
    generatePlayerNameInputs() {
        const container = document.getElementById('player-names-container');
        if (!container) return;
        
        container.innerHTML = '';
        
        for (let i = 1; i <= this.currentPlayerCount; i++) {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group mb-2';
            inputGroup.innerHTML = `
                <input 
                    type="text" 
                    class="form-input" 
                    id="player-name-${i}" 
                    placeholder="Joueur ${i}"
                    maxlength="20"
                >
            `;
            container.appendChild(inputGroup);
        }
    },
    
    /**
     * Start the game
     */
    startGame() {
        // Collect player names
        const playerNames = [];
        for (let i = 1; i <= this.currentPlayerCount; i++) {
            const input = document.getElementById(`player-name-${i}`);
            const name = input ? input.value.trim() : '';
            playerNames.push(name || `Joueur ${i}`);
        }
        
        // Create game configuration
        const gameConfig = {
            playersCount: this.currentPlayerCount,
            targetRowLength: window.ChysterTypes.CHYSTER_TARGET_MAP[this.currentPlayerCount] || 5,
            playerNames: playerNames
        };
        
        // Start game through core app
        if (window.ChysterApp && window.ChysterApp.startNewGame) {
            window.ChysterApp.startNewGame(gameConfig);
        }
    },
    
    /**
     * Handle screen change
     * @param {string} screenName
     */
    onScreenChange(screenName) {
        // Update document title
        const titles = {
            'home': 'Chyster Live App',
            'setup': 'Configuration - Chyster Live',
            'table': 'Partie en cours - Chyster Live',
            'rules': 'Règles - Chyster Live'
        };
        
        document.title = titles[screenName] || 'Chyster Live App';
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Announce screen change to screen readers
        this.announceToScreenReader(`Écran ${screenName} chargé`);
    },
    
    /**
     * Announce message to screen readers
     * @param {string} message
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    },
    
    /**
     * Render table screen
     * @param {Object} data - Data containing game state
     */
    renderTableScreen(data = {}) {
        const gameState = data.game || data;
        
        if (!gameState || !gameState.players || !gameState.players.length) {
            console.error('Invalid game state for table screen');
            this.renderHomeScreen();
            return;
        }
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        const totalCards = currentPlayer.cards.length;
        const totalJokers = currentPlayer.jokers;
        const chysterTarget = gameState.targetRowLength;
        const attemptsLeft = gameState.maxAttempts - gameState.currentAttempts;
        
        // Determine current card display
        let currentCardDisplay = '';
        if (gameState.currentCard) {
            const card = gameState.currentCard;
            currentCardDisplay = `
                <div class="current-card">
                    <div class="card-visual ${card.suit.toLowerCase()}">
                        <span class="card-rank">${card.rank}</span>
                        <span class="card-suit">${this.getSuitSymbol(card.suit)}</span>
                    </div>
                </div>
            `;
        } else {
            currentCardDisplay = `
                <div class="deck-placeholder">
                    <div class="card-back"></div>
                    <span class="deck-label">Paquet</span>
                </div>
            `;
        }
        
        // Build player cards display
        let playerCardsHTML = '';
        if (currentPlayer.cards.length > 0) {
            playerCardsHTML = currentPlayer.cards.map(card => `
                <div class="player-card ${card.suit.toLowerCase()}">
                    <span class="card-rank">${card.rank}</span>
                    <span class="card-suit">${this.getSuitSymbol(card.suit)}</span>
                </div>
            `).join('');
        } else {
            playerCardsHTML = '<div class="no-cards">Aucune carte</div>';
        }
        
        // Build jokers display
        let jokersHTML = '';
        if (totalJokers > 0) {
            jokersHTML = `
                <div class="jokers-section">
                    <span class="jokers-label">Jokers :</span>
                    <div class="jokers-count">${totalJokers}</div>
                </div>
            `;
        }
        
        // Determine available actions based on game state
        let actionsHTML = '';
        if (gameState.waitingForGuess) {
            actionsHTML = `
                <div class="action-buttons">
                    <button class="btn btn-guess btn-higher" id="btn-guess-higher" aria-label="Deviner plus haut">
                        <span class="btn-icon">⬆️</span>
                        <span class="btn-text">Plus haut</span>
                    </button>
                    <button class="btn btn-guess btn-lower" id="btn-guess-lower" aria-label="Deviner plus bas">
                        <span class="btn-icon">⬇️</span>
                        <span class="btn-text">Plus bas</span>
                    </button>
                    <button class="btn btn-guess btn-color" id="btn-guess-color" aria-label="Deviner la couleur">
                        <span class="btn-icon">🎨</span>
                        <span class="btn-text">Couleur</span>
                    </button>
                </div>
            `;
        } else if (gameState.waitingForAction) {
            actionsHTML = `
                <div class="action-buttons">
                    <button class="btn btn-primary" id="btn-draw-card" aria-label="Tirer une carte">
                        <span class="btn-icon">🃏</span>
                        <span class="btn-text">Tirer carte</span>
                    </button>
                    ${totalJokers > 0 ? `
                        <button class="btn btn-secondary" id="btn-use-joker" aria-label="Utiliser un joker">
                            <span class="btn-icon">🃏</span>
                            <span class="btn-text">Utiliser joker</span>
                        </button>
                    ` : ''}
                </div>
            `;
        } else if (gameState.chysterAvailable) {
            actionsHTML = `
                <div class="action-buttons">
                    <button class="btn btn-success" id="btn-claim-chyster" aria-label="Réclamer la Chyster">
                        <span class="btn-icon">🏆</span>
                        <span class="btn-text">Chyster!</span>
                    </button>
                    <button class="btn btn-secondary" id="btn-continue-playing" aria-label="Continuer à jouer">
                        <span class="btn-icon">➡️</span>
                        <span class="btn-text">Continuer</span>
                    </button>
                </div>
            `;
        }
        
        const tableHTML = `
            <div class="screen table-screen" role="main" aria-labelledby="table-title">
                <!-- Top Bar -->
                <header class="table-header">
                    <div class="header-info">
                        <h1 id="table-title" class="player-name">${currentPlayer.name}</h1>
                        <div class="game-stats">
                            <span class="stat-item">
                                <span class="stat-label">Objectif:</span>
                                <span class="stat-value">${chysterTarget}</span>
                            </span>
                            <span class="stat-item">
                                <span class="stat-label">Essais:</span>
                                <span class="stat-value">${attemptsLeft}</span>
                            </span>
                        </div>
                    </div>
                    <button class="btn btn-icon" id="btn-menu" aria-label="Menu du jeu">
                        <span>⋮</span>
                    </button>
                </header>
                
                <!-- Main Game Area -->
                <main class="table-main">
                    <!-- Player Zone -->
                    <section class="player-zone" aria-labelledby="player-cards-title">
                        <h2 id="player-cards-title" class="sr-only">Cartes du joueur</h2>
                        <div class="player-cards-container">
                            <div class="player-cards-row">
                                ${playerCardsHTML}
                            </div>
                            ${jokersHTML}
                        </div>
                        <div class="cards-summary">
                            <span class="cards-count">${totalCards}/${chysterTarget} cartes</span>
                        </div>
                    </section>
                    
                    <!-- Central Deck Area -->
                    <section class="central-zone" aria-labelledby="deck-title">
                        <h2 id="deck-title" class="sr-only">Zone de jeu centrale</h2>
                        <div class="deck-area">
                            ${currentCardDisplay}
                            <div class="deck-info">
                                <span class="cards-remaining">${gameState.deck.length} cartes restantes</span>
                            </div>
                        </div>
                    </section>
                </main>
                
                <!-- Bottom Action Sheet -->
                <footer class="action-sheet" role="region" aria-labelledby="actions-title">
                    <h2 id="actions-title" class="sr-only">Actions disponibles</h2>
                    ${actionsHTML}
                </footer>
            </div>
        `;
        
        this.appContainer.innerHTML = tableHTML;
        this.bindTableEvents();
    },
    
    /**
     * Bind events for table screen
     */
    bindTableEvents() {
        // Guess buttons
        const higherBtn = document.getElementById('btn-guess-higher');
        const lowerBtn = document.getElementById('btn-guess-lower');
        const colorBtn = document.getElementById('btn-guess-color');
        
        // Action buttons
        const drawBtn = document.getElementById('btn-draw-card');
        const jokerBtn = document.getElementById('btn-use-joker');
        const chysterBtn = document.getElementById('btn-claim-chyster');
        const continueBtn = document.getElementById('btn-continue-playing');
        const menuBtn = document.getElementById('btn-menu');
        
        if (higherBtn) {
            higherBtn.addEventListener('click', () => {
                if (window.ChysterApp && window.ChysterApp.makeGuess) {
                    window.ChysterApp.makeGuess('higher');
                }
            });
        }
        
        if (lowerBtn) {
            lowerBtn.addEventListener('click', () => {
                if (window.ChysterApp && window.ChysterApp.makeGuess) {
                    window.ChysterApp.makeGuess('lower');
                }
            });
        }
        
        if (colorBtn) {
            colorBtn.addEventListener('click', () => {
                if (window.ChysterApp && window.ChysterApp.showColorGuessModal) {
                    window.ChysterApp.showColorGuessModal();
                }
            });
        }
        
        if (drawBtn) {
            drawBtn.addEventListener('click', () => {
                if (window.ChysterApp && window.ChysterApp.drawCard) {
                    window.ChysterApp.drawCard();
                }
            });
        }
        
        if (jokerBtn) {
            jokerBtn.addEventListener('click', () => {
                if (window.ChysterApp && window.ChysterApp.useJoker) {
                    window.ChysterApp.useJoker();
                }
            });
        }
        
        if (chysterBtn) {
            chysterBtn.addEventListener('click', () => {
                if (window.ChysterApp && window.ChysterApp.claimChyster) {
                    window.ChysterApp.claimChyster();
                }
            });
        }
        
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                if (window.ChysterApp && window.ChysterApp.continuePlaying) {
                    window.ChysterApp.continuePlaying();
                }
            });
        }
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                if (window.ChysterApp && window.ChysterApp.showGameMenu) {
                    window.ChysterApp.showGameMenu();
                }
            });
        }
    },
    
    /**
     * Get suit symbol for display
     * @param {string} suit
     * @returns {string}
     */
    getSuitSymbol(suit) {
        const symbols = {
            'HEARTS': '♥',
            'DIAMONDS': '♦',
            'CLUBS': '♣',
            'SPADES': '♠'
        };
        return symbols[suit] || suit;
    },
    
    /**
     * Show color guess modal
     */
    showColorGuessModal() {
        const modalHTML = `
            <div class="modal-overlay" id="color-modal">
                <div class="modal" role="dialog" aria-labelledby="color-modal-title" aria-describedby="color-modal-desc">
                    <div class="modal-header">
                        <h2 id="color-modal-title" class="modal-title">Deviner la couleur</h2>
                        <p id="color-modal-desc" class="modal-subtitle">Choisis la couleur de la prochaine carte</p>
                    </div>
                    <div class="modal-body">
                        <div class="color-options">
                            <div class="color-option" data-color="red" tabindex="0" role="button" aria-label="Rouge - Cœur ou Carreau">
                                <div class="color-icon red">♥♦</div>
                                <div class="color-label">Rouge</div>
                                <div class="color-description">Cœur ou Carreau</div>
                            </div>
                            <div class="color-option" data-color="black" tabindex="0" role="button" aria-label="Noir - Trèfle ou Pique">
                                <div class="color-icon black">♣♠</div>
                                <div class="color-label">Noir</div>
                                <div class="color-description">Trèfle ou Pique</div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="btn-cancel-color">Annuler</button>
                        <button class="btn btn-primary" id="btn-confirm-color" disabled>Confirmer</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = document.getElementById('color-modal');
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Bind events
        this.bindColorModalEvents();
        
        // Focus first option
        const firstOption = modal.querySelector('.color-option');
        if (firstOption) firstOption.focus();
    },
    
    /**
     * Bind color modal events
     */
    bindColorModalEvents() {
        const modal = document.getElementById('color-modal');
        const options = modal.querySelectorAll('.color-option');
        const cancelBtn = document.getElementById('btn-cancel-color');
        const confirmBtn = document.getElementById('btn-confirm-color');
        let selectedColor = null;
        
        // Color option selection
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove previous selection
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Select current option
                option.classList.add('selected');
                selectedColor = option.dataset.color;
                
                // Enable confirm button
                confirmBtn.disabled = false;
            });
            
            // Keyboard support
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.click();
                }
            });
        });
        
        // Cancel button
        cancelBtn.addEventListener('click', () => {
            this.hideModal('color-modal');
        });
        
        // Confirm button
        confirmBtn.addEventListener('click', () => {
            if (selectedColor && window.ChysterApp && window.ChysterApp.makeGuess) {
                window.ChysterApp.makeGuess(selectedColor);
                this.hideModal('color-modal');
            }
        });
        
        // ESC key to close
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal('color-modal');
            }
        });
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal('color-modal');
            }
        });
    },
    
    /**
     * Show result modal
     * @param {Object} result
     */
    showResultModal(result) {
        const isSuccess = result.success;
        const card = result.card;
        const message = result.message || (isSuccess ? 'Bravo !' : 'Dommage !');
        
        const modalHTML = `
            <div class="modal-overlay" id="result-modal">
                <div class="modal" role="dialog" aria-labelledby="result-modal-title">
                    <div class="modal-header">
                        <h2 id="result-modal-title" class="modal-title">
                            ${isSuccess ? '🎉 Bon paris !' : '❌ Mauvais paris !'}
                        </h2>
                    </div>
                    <div class="modal-body">
                        ${card ? `
                            <div class="result-card">
                                <div class="card-visual ${card.suit.toLowerCase()}">
                                    <span class="card-rank">${card.rank}</span>
                                    <span class="card-suit">${this.getSuitSymbol(card.suit)}</span>
                                </div>
                            </div>
                        ` : ''}
                        <div class="result-message">
                            <p class="${isSuccess ? 'result-success' : 'result-failure'}">${message}</p>
                        </div>
                        ${result.details ? `
                            <div class="result-details">
                                <div class="result-stat">
                                    <span class="result-stat-label">Cartes gagnées :</span>
                                    <span class="result-stat-value">${result.details.cardsWon || 0}</span>
                                </div>
                                <div class="result-stat">
                                    <span class="result-stat-label">Jokers gagnés :</span>
                                    <span class="result-stat-value">${result.details.jokersWon || 0}</span>
                                </div>
                                <div class="result-stat">
                                    <span class="result-stat-label">Essais restants :</span>
                                    <span class="result-stat-value">${result.details.attemptsLeft || 0}</span>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" id="btn-continue-result">Continuer</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = document.getElementById('result-modal');
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Bind events
        this.bindResultModalEvents();
    },
    
    /**
     * Bind result modal events
     */
    bindResultModalEvents() {
        const modal = document.getElementById('result-modal');
        const continueBtn = document.getElementById('btn-continue-result');
        
        continueBtn.addEventListener('click', () => {
            this.hideModal('result-modal');
        });
        
        // ESC key to close
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal('result-modal');
            }
        });
        
        // Auto-focus continue button
        continueBtn.focus();
    },
    
    /**
     * Show Chyster selection modal
     * @param {Object} chysterData
     */
    showChysterModal(chysterData) {
        const isRoyale = chysterData.isRoyale;
        const players = chysterData.players || [];
        const currentPlayer = chysterData.currentPlayer;
        
        const modalHTML = `
            <div class="modal-overlay" id="chyster-modal">
                <div class="modal" role="dialog" aria-labelledby="chyster-modal-title">
                    <div class="modal-header">
                        <h2 id="chyster-modal-title" class="modal-title">
                            ${isRoyale ? '👑 Chyster Royale !' : '🏆 Chyster !'}
                        </h2>
                        <p class="modal-subtitle">
                            ${isRoyale ? 'Toutes tes cartes sont de la même couleur !' : 'Tu as atteint l\'objectif !'}
                        </p>
                    </div>
                    <div class="modal-body">
                        <div class="chyster-celebration">
                            <span class="chyster-emoji">${isRoyale ? '👑' : '🏆'}</span>
                            <div class="chyster-message">
                                Félicitations ${currentPlayer} !
                            </div>
                            <div class="chyster-type">
                                ${isRoyale ? 'Distribution doublée !' : 'Choisis qui boit tes cartes'}
                            </div>
                        </div>
                        
                        <div class="player-selection">
                            <h3>Qui va boire les cartes ?</h3>
                            <div class="player-options">
                                ${players.map(player => `
                                    <label class="player-option" tabindex="0">
                                        <input type="radio" name="target-player" value="${player.name}" />
                                        <span class="player-option-label">${player.name}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="btn-cancel-chyster">Annuler</button>
                        <button class="btn btn-primary" id="btn-confirm-chyster" disabled>
                            ${isRoyale ? 'Distribuer (x2)' : 'Distribuer'}
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = document.getElementById('chyster-modal');
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Bind events
        this.bindChysterModalEvents(isRoyale);
    },
    
    /**
     * Bind Chyster modal events
     * @param {boolean} isRoyale
     */
    bindChysterModalEvents(isRoyale) {
        const modal = document.getElementById('chyster-modal');
        const options = modal.querySelectorAll('.player-option');
        const radioButtons = modal.querySelectorAll('input[type="radio"]');
        const cancelBtn = document.getElementById('btn-cancel-chyster');
        const confirmBtn = document.getElementById('btn-confirm-chyster');
        let selectedPlayer = null;
        
        // Player option selection
        options.forEach((option, index) => {
            option.addEventListener('click', () => {
                const radio = option.querySelector('input[type="radio"]');
                radio.checked = true;
                selectedPlayer = radio.value;
                
                // Update visual selection
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                // Enable confirm button
                confirmBtn.disabled = false;
            });
            
            // Keyboard support
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.click();
                }
            });
        });
        
        // Radio button changes
        radioButtons.forEach(radio => {
            radio.addEventListener('change', () => {
                selectedPlayer = radio.value;
                confirmBtn.disabled = false;
            });
        });
        
        // Cancel button
        cancelBtn.addEventListener('click', () => {
            this.hideModal('chyster-modal');
        });
        
        // Confirm button
        confirmBtn.addEventListener('click', () => {
            if (selectedPlayer && window.ChysterApp && window.ChysterApp.distributeChyster) {
                window.ChysterApp.distributeChyster(selectedPlayer, isRoyale);
                this.hideModal('chyster-modal');
            }
        });
        
        // ESC key to close
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal('chyster-modal');
            }
        });
    },
    
    /**
     * Hide modal
     * @param {string} modalId
     */
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.remove('show');
        
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    },

    /**
     * Show toast notification
     * @param {string} message
     * @param {string} type - success, warn, error
     */
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    },
    
    /**
     * Show/hide loading overlay
     * @param {boolean} show
     */
    showLoading(show) {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }
};

// Make UI available globally
if (typeof window !== 'undefined') {
    window.ChysterUI = ChysterUI;
}