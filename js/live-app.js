/* ===================================
   CHYSTER LIVE APP - MAIN APPLICATION
   Entry point and app coordination
   =================================== */

/**
 * Main Chyster Live App
 */
const ChysterApp = {
    
    /**
     * App version
     */
    version: '1.0.0',
    
    /**
     * Current game state
     * @type {GameState|null}
     */
    currentGame: null,
    
    /**
     * App initialization state
     */
    initialized: false,
    
    /**
     * Initialize the application
     */
    async init() {
        if (this.initialized) {
            console.log('🎮 ChysterApp: Already initialized, skipping...');
            return;
        }
        
        try {
            console.log(`🎮 Chyster Live App v${this.version} - Initializing...`);
            
            // Check dependencies
            console.log('🔍 ChysterApp: Checking dependencies...');
            this.checkDependencies();
            console.log('✅ ChysterApp: Dependencies check passed');
            
            // Initialize UI system
            console.log('🖥️ ChysterApp: Initializing UI system...');
            if (window.ChysterUI) {
                await window.ChysterUI.init();
                console.log('✅ ChysterApp: UI system initialized');
            } else {
                console.error('❌ ChysterApp: ChysterUI not available');
                throw new Error('ChysterUI module not loaded');
            }
            
            // Setup error handling
            console.log('🛡️ ChysterApp: Setting up error handling...');
            this.setupErrorHandling();
            console.log('✅ ChysterApp: Error handling setup complete');
            
            // Initialize core game logic
            console.log('🎯 ChysterApp: Initializing core game logic...');
            if (window.ChysterCore) {
                window.ChysterCore.init();
                console.log('✅ ChysterApp: Core game logic initialized');
            } else {
                console.error('❌ ChysterApp: ChysterCore not available');
                throw new Error('ChysterCore module not loaded');
            }
            
            // PWA capabilities
            console.log('📱 ChysterApp: Setting up PWA features...');
            this.initPWA();
            console.log('✅ ChysterApp: PWA features setup complete');
            
            this.initialized = true;
            console.log('🎉 Chyster Live App initialized successfully!');
            
            // Show welcome toast
            if (window.ChysterUI) {
                setTimeout(() => {
                    window.ChysterUI.showToast('Bienvenue dans Chyster Live App ! 🎮', 'success');
                }, 1000);
            }
            
        } catch (error) {
            console.error('❌ Failed to initialize Chyster Live App:', error);
            this.handleCriticalError(error);
            throw error;
        }
    },
    
    /**
     * Check if all required dependencies are available
     */
    checkDependencies() {
        const required = ['ChysterTypes', 'ChysterUI'];
        const missing = required.filter(dep => !window[dep]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required dependencies: ${missing.join(', ')}`);
        }
    },
    
    /**
     * Setup global error handling
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError('Une erreur inattendue s\'est produite', event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError('Erreur de traitement', event.reason);
        });
    },
    
    /**
     * Initialize PWA capabilities
     */
    initPWA() {
        // Service Worker registration (future enhancement)
        if ('serviceWorker' in navigator) {
            // Will be implemented for offline capabilities
            console.log('🔧 Service Worker support detected (future feature)');
        }
        
        // Install prompt handling
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            console.log('📱 PWA install prompt available');
            // Could show custom install button
        });
        
        // Track if app is running as PWA
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('📱 Running as PWA');
            document.body.classList.add('pwa-mode');
        }
    },
    
    /**
     * Start a new game
     * @param {Object} config - Game configuration from setup screen
     */
    startNewGame(config) {
        try {
            console.log('🎮 Starting new game with config:', config);
            
            if (window.ChysterUI) {
                window.ChysterUI.showLoading(true);
            }
            
            // Validate configuration
            if (!this.validateGameConfig(config)) {
                throw new Error('Configuration de jeu invalide');
            }
            
            // Create new game state
            this.currentGame = this.createGameState(config);
            
            // Navigate to table screen
            setTimeout(() => {
                if (window.ChysterUI) {
                    window.ChysterUI.showLoading(false);
                    window.ChysterUI.renderScreen('table', { game: this.currentGame });
                    window.ChysterUI.showToast('Partie créée ! Que le jeu commence ! 🎉', 'success');
                }
            }, 1000); // Simulated loading time
            
        } catch (error) {
            console.error('❌ Failed to start game:', error);
            this.handleError('Impossible de démarrer la partie', error);
            
            if (window.ChysterUI) {
                window.ChysterUI.showLoading(false);
            }
        }
    },
    
    /**
     * Validate game configuration
     * @param {Object} config
     * @returns {boolean}
     */
    validateGameConfig(config) {
        if (!config) return false;
        if (!Number.isInteger(config.playersCount) || config.playersCount < 2 || config.playersCount > 10) return false;
        if (!Number.isInteger(config.targetRowLength) || config.targetRowLength < 5 || config.targetRowLength > 11) return false;
        if (!Array.isArray(config.playerNames) || config.playerNames.length !== config.playersCount) return false;
        
        return true;
    },
    
    /**
     * Create initial game state
     * @param {Object} config
     * @returns {GameState}
     */
    createGameState(config) {
        if (!window.ChysterTypes) {
            throw new Error('ChysterTypes not available');
        }
        
        const { generateId, STANDARD_DECK } = window.ChysterTypes;
        
        // Create players
        const players = config.playerNames.map((name, index) => ({
            id: generateId(),
            name: name || `Joueur ${index + 1}`,
            row: [],
            jokers: []
        }));
        
        // Create and shuffle deck
        const deck = this.createShuffledDeck();
        
        // Create game state
        const gameState = {
            id: generateId(),
            config: {
                playersCount: config.playersCount,
                targetRowLength: config.targetRowLength
            },
            deck: deck,
            discard: [],
            players: players,
            turn: {
                currentPlayerId: players[0].id,
                attempt: {
                    active: false,
                    max: 3,
                    remaining: 3,
                    announcedColor: null
                },
                lastRevealedCard: null
            },
            history: [`Partie créée avec ${config.playersCount} joueurs`]
        };
        
        return gameState;
    },
    
    /**
     * Create a shuffled deck
     * @returns {Card[]}
     */
    createShuffledDeck() {
        if (!window.ChysterTypes) {
            throw new Error('ChysterTypes not available');
        }
        
        const { STANDARD_DECK, generateId } = window.ChysterTypes;
        
        // Create deck with unique IDs
        const deck = STANDARD_DECK.map(template => ({
            id: generateId(),
            rank: template.rank,
            color: template.color,
            special: template.special
        }));
        
        // Fisher-Yates shuffle
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        
        return deck;
    },
    
    /**
     * Handle application errors
     * @param {string} message - User-friendly error message
     * @param {Error} [error] - Original error object
     */
    handleError(message, error = null) {
        console.error('App Error:', message, error);
        
        if (window.ChysterUI) {
            window.ChysterUI.showToast(message, 'error');
        }
        
        // Track error for debugging (future: send to analytics)
        this.logError(message, error);
    },
    
    /**
     * Handle critical errors that prevent app from functioning
     * @param {Error} error
     */
    handleCriticalError(error) {
        console.error('Critical Error:', error);
        
        // Show fallback UI
        const appContainer = document.getElementById('app');
        if (appContainer) {
            appContainer.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #fff;">
                    <h2 style="color: #E53935;">❌ Erreur critique</h2>
                    <p>L'application a rencontré une erreur critique et ne peut pas continuer.</p>
                    <p>Veuillez recharger la page pour recommencer.</p>
                    <button onclick="window.location.reload()" style="
                        background: #E53935; 
                        color: white; 
                        border: none; 
                        padding: 10px 20px; 
                        border-radius: 5px; 
                        cursor: pointer;
                        margin-top: 20px;
                    ">
                        🔄 Recharger la page
                    </button>
                </div>
            `;
        }
    },
    
    /**
     * Log error for debugging
     * @param {string} message
     * @param {Error} error
     */
    logError(message, error) {
        // Store error in localStorage for debugging
        try {
            const errorLog = {
                timestamp: new Date().toISOString(),
                message,
                error: error ? {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                } : null,
                userAgent: navigator.userAgent,
                url: window.location.href
            };
            
            const existingLogs = JSON.parse(localStorage.getItem('chyster_error_logs') || '[]');
            existingLogs.push(errorLog);
            
            // Keep only last 10 errors
            if (existingLogs.length > 10) {
                existingLogs.splice(0, existingLogs.length - 10);
            }
            
            localStorage.setItem('chyster_error_logs', JSON.stringify(existingLogs));
        } catch (e) {
            console.warn('Could not log error to localStorage:', e);
        }
    },
    
    /**
     * Make a guess (higher/lower)
     * @param {string} guessType - 'higher' or 'lower'
     */
    makeGuess(guessType) {
        if (!this.currentGame || !this.currentGame.waitingForGuess) {
            console.warn('Game not in guessing state');
            return;
        }
        
        try {
            console.log(`Making guess: ${guessType}`);
            
            // Use core game logic to process guess
            if (window.ChysterCore && window.ChysterCore.processGuess) {
                const result = window.ChysterCore.processGuess(this.currentGame, guessType);
                this.handleGuessResult(result);
            }
        } catch (error) {
            console.error('Error making guess:', error);
            this.handleError('Erreur lors du paris', error);
        }
    },
    
    /**
     * Show color guess modal
     */
    showColorGuessModal() {
        if (!this.currentGame || !this.currentGame.waitingForGuess) {
            console.warn('Game not in guessing state');
            return;
        }
        
        if (window.ChysterUI && window.ChysterUI.showColorGuessModal) {
            window.ChysterUI.showColorGuessModal();
        }
    },
    
    /**
     * Draw a card
     */
    drawCard() {
        if (!this.currentGame || !this.currentGame.waitingForAction) {
            console.warn('Game not ready for card draw');
            return;
        }
        
        try {
            console.log('Drawing card...');
            
            if (window.ChysterCore && window.ChysterCore.drawCard) {
                const result = window.ChysterCore.drawCard(this.currentGame);
                this.handleCardDraw(result);
            }
        } catch (error) {
            console.error('Error drawing card:', error);
            this.handleError('Erreur lors du tirage', error);
        }
    },
    
    /**
     * Use a joker
     */
    useJoker() {
        if (!this.currentGame) {
            console.warn('No active game');
            return;
        }
        
        const currentPlayer = this.currentGame.players[this.currentGame.currentPlayerIndex];
        if (currentPlayer.jokers <= 0) {
            window.ChysterUI.showToast('Aucun joker disponible', 'warn');
            return;
        }
        
        try {
            console.log('Using joker...');
            
            if (window.ChysterCore && window.ChysterCore.useJoker) {
                const result = window.ChysterCore.useJoker(this.currentGame);
                this.handleJokerUse(result);
            }
        } catch (error) {
            console.error('Error using joker:', error);
            this.handleError('Erreur lors de l\'utilisation du joker', error);
        }
    },
    
    /**
     * Claim Chyster
     */
    claimChyster() {
        if (!this.currentGame || !this.currentGame.chysterAvailable) {
            console.warn('Chyster not available');
            return;
        }
        
        try {
            console.log('Claiming Chyster...');
            
            if (window.ChysterCore && window.ChysterCore.claimChyster) {
                const result = window.ChysterCore.claimChyster(this.currentGame);
                this.handleChysterClaim(result);
            }
        } catch (error) {
            console.error('Error claiming Chyster:', error);
            this.handleError('Erreur lors de la réclamation Chyster', error);
        }
    },
    
    /**
     * Continue playing after Chyster is available
     */
    continuePlaying() {
        if (!this.currentGame || !this.currentGame.chysterAvailable) {
            console.warn('Continue not available');
            return;
        }
        
        try {
            console.log('Continuing to play...');
            
            // Reset chyster availability and continue
            this.currentGame.chysterAvailable = false;
            this.currentGame.waitingForAction = true;
            
            this.updateGameDisplay();
            window.ChysterUI.showToast('Continuons !', 'info');
        } catch (error) {
            console.error('Error continuing game:', error);
            this.handleError('Erreur lors de la continuation', error);
        }
    },
    
    /**
     * Show game menu
     */
    showGameMenu() {
        // TODO: Implement game menu modal
        console.log('Game menu - to be implemented');
        window.ChysterUI.showToast('Menu jeu à implémenter', 'info');
    },
    
    /**
     * Handle guess result
     * @param {Object} result
     */
    handleGuessResult(result) {
        // Show result modal
        if (window.ChysterUI && window.ChysterUI.showResultModal) {
            window.ChysterUI.showResultModal(result);
        }
        
        this.updateGameDisplay();
    },
    
    /**
     * Handle card draw result
     * @param {Object} result
     */
    handleCardDraw(result) {
        if (result.card) {
            window.ChysterUI.showToast(`Carte tirée : ${result.card.rank} ${this.getSuitSymbol(result.card.suit)}`, 'info');
        }
        
        this.updateGameDisplay();
    },
    
    /**
     * Handle joker use result
     * @param {Object} result
     */
    handleJokerUse(result) {
        window.ChysterUI.showToast(result.message || 'Joker utilisé !', 'success');
        this.updateGameDisplay();
    },
    
    /**
     * Handle Chyster claim result
     * @param {Object} result
     */
    handleChysterClaim(result) {
        const currentPlayer = this.currentGame.players[this.currentGame.currentPlayerIndex];
        const otherPlayers = this.currentGame.players.filter((_, index) => index !== this.currentGame.currentPlayerIndex);
        
        // Show Chyster distribution modal
        if (window.ChysterUI && window.ChysterUI.showChysterModal) {
            window.ChysterUI.showChysterModal({
                isRoyale: result.isRoyale || false,
                players: otherPlayers,
                currentPlayer: currentPlayer.name,
                cards: currentPlayer.cards
            });
        }
    },
    
    /**
     * Distribute Chyster cards
     * @param {string} targetPlayerName
     * @param {boolean} isRoyale
     */
    distributeChyster(targetPlayerName, isRoyale) {
        try {
            console.log(`Distributing Chyster to ${targetPlayerName}, Royale: ${isRoyale}`);
            
            if (window.ChysterCore && window.ChysterCore.distributeChyster) {
                const result = window.ChysterCore.distributeChyster(this.currentGame, targetPlayerName, isRoyale);
                
                const multiplier = isRoyale ? 'x2' : '';
                window.ChysterUI.showToast(
                    `${targetPlayerName} boit ${result.cardsCount} cartes ${multiplier}! 🍻`, 
                    'success'
                );
                
                this.updateGameDisplay();
            }
        } catch (error) {
            console.error('Error distributing Chyster:', error);
            this.handleError('Erreur lors de la distribution', error);
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
     * Update game display
     */
    updateGameDisplay() {
        if (this.currentGame && window.ChysterUI) {
            window.ChysterUI.renderTableScreen(this.currentGame);
        }
    },

    /**
     * Get app debug information
     * @returns {Object}
     */
    getDebugInfo() {
        const debugInfo = {
            version: this.version,
            initialized: this.initialized,
            currentGame: this.currentGame ? {
                id: this.currentGame.id,
                playersCount: this.currentGame.players.length,
                currentPlayer: this.currentGame.players[this.currentGame.currentPlayerIndex].name,
                deckSize: this.currentGame.deck.length
            } : null,
            userAgent: navigator.userAgent,
            screen: window.ChysterUI ? window.ChysterUI.currentScreen : 'unknown',
            timestamp: new Date().toISOString()
        };
        
        // Add game stats if available
        if (this.currentGame && window.ChysterCore && window.ChysterCore.getGameStats) {
            debugInfo.gameStats = window.ChysterCore.getGameStats(this.currentGame);
        }
        
        // Add validation if available
        if (this.currentGame && window.ChysterCore && window.ChysterCore.validateGameState) {
            debugInfo.validation = window.ChysterCore.validateGameState(this.currentGame);
        }
        
        return debugInfo;
    },
    
    /**
     * Run basic tests
     * @returns {Object} Test results
     */
    runTests() {
        const tests = [];
        
        // Test 1: App initialization
        tests.push({
            name: 'App Initialization',
            passed: this.initialized && window.ChysterUI && window.ChysterCore,
            details: 'Check if all components are initialized'
        });
        
        // Test 2: Game creation
        try {
            const testConfig = {
                playersCount: 3,
                targetRowLength: 4,
                playerNames: ['Alice', 'Bob', 'Charlie']
            };
            
            const testGame = this.createGameState(testConfig);
            const isValid = window.ChysterCore ? window.ChysterCore.validateGameState(testGame) : { valid: false };
            
            tests.push({
                name: 'Game Creation',
                passed: isValid.valid,
                details: isValid.errors || []
            });
        } catch (error) {
            tests.push({
                name: 'Game Creation',
                passed: false,
                details: error.message
            });
        }
        
        // Test 3: UI Components
        const uiTests = [
            { name: 'App Container', element: 'app-container' },
            { name: 'Toast Container', element: 'toast-container' },
            { name: 'Loading Overlay', element: 'loading-overlay' }
        ];
        
        uiTests.forEach(test => {
            const element = document.getElementById(test.element);
            tests.push({
                name: `UI: ${test.name}`,
                passed: !!element,
                details: element ? 'Element found' : 'Element missing'
            });
        });
        
        // Test 4: Accessibility
        const accessibilityTests = [
            { name: 'Focus Management', check: () => document.activeElement !== null },
            { name: 'ARIA Labels', check: () => document.querySelectorAll('[aria-label]').length > 0 },
            { name: 'Semantic HTML', check: () => document.querySelectorAll('main, section, nav, header, footer').length > 0 }
        ];
        
        accessibilityTests.forEach(test => {
            try {
                tests.push({
                    name: `Accessibility: ${test.name}`,
                    passed: test.check(),
                    details: 'Check passed'
                });
            } catch (error) {
                tests.push({
                    name: `Accessibility: ${test.name}`,
                    passed: false,
                    details: error.message
                });
            }
        });
        
        const passedTests = tests.filter(t => t.passed).length;
        const totalTests = tests.length;
        
        return {
            summary: `${passedTests}/${totalTests} tests passed`,
            passRate: (passedTests / totalTests * 100).toFixed(1) + '%',
            tests: tests,
            timestamp: new Date().toISOString()
        };
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    console.log('📄 DOM loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('📄 DOM loaded, initializing ChysterApp...');
        // Add a small delay to ensure all elements are rendered
        setTimeout(async () => {
            try {
                await ChysterApp.init();
            } catch (error) {
                console.error('❌ Failed to initialize after DOM loaded:', error);
            }
        }, 100);
    });
} else {
    console.log('📄 DOM already loaded, initializing ChysterApp immediately...');
    // Add a small delay even if DOM is ready to ensure everything is stable
    setTimeout(async () => {
        try {
            await ChysterApp.init();
        } catch (error) {
            console.error('❌ Failed to initialize immediately:', error);
        }
    }, 50);
}

// Make app available globally
if (typeof window !== 'undefined') {
    window.ChysterApp = ChysterApp;
    
    // Debug helpers
    window.chysterDebug = () => {
        console.log('🔍 Chyster Debug Info:', ChysterApp.getDebugInfo());
    };
    
    window.chysterTest = () => {
        const results = ChysterApp.runTests();
        console.log('🧪 Chyster Test Results:', results);
        return results;
    };
    
    window.chysterStats = () => {
        if (ChysterApp.currentGame && window.ChysterCore) {
            const stats = window.ChysterCore.getGameStats(ChysterApp.currentGame);
            console.log('📊 Game Stats:', stats);
            return stats;
        } else {
            console.log('ℹ️ No active game');
            return null;
        }
    };
    
    window.chysterValidate = () => {
        if (ChysterApp.currentGame && window.ChysterCore) {
            const validation = window.ChysterCore.validateGameState(ChysterApp.currentGame);
            console.log('✅ Game Validation:', validation);
            return validation;
        } else {
            console.log('ℹ️ No active game');
            return null;
        }
    };
    
    // Quick start helper for testing
    window.chysterQuickStart = () => {
        ChysterApp.startNewGame({
            playersCount: 3,
            targetRowLength: 4,
            playerNames: ['Alice', 'Bob', 'Charlie']
        });
    };
}