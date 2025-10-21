/* ===================================
   CHYSTER LIVE APP - CORE GAME LOGIC
   Game rules, card logic, and game state management
   =================================== */

/**
 * Core game logic and rules implementation
 */
const ChysterCore = {
    
    /**
     * Initialize core game systems
     */
    init() {
        console.log('🎯 ChysterCore initialized');
        // Core game logic initialization will be implemented here
    },
    
    /**
     * Get rank value for card comparisons
     * @param {Rank} rank
     * @returns {number}
     */
    getRankValue(rank) {
        if (!window.ChysterTypes) return 0;
        return window.ChysterTypes.RANK_VALUES[rank] || 0;
    },
    
    /**
     * Check if drawn card is above last card in row
     * @param {Card} drawnCard
     * @param {Card} lastRowCard
     * @returns {boolean}
     */
    isAbove(drawnCard, lastRowCard) {
        return this.getRankValue(drawnCard.rank) > this.getRankValue(lastRowCard.rank);
    },
    
    /**
     * Check if drawn card is below last card in row
     * @param {Card} drawnCard
     * @param {Card} lastRowCard
     * @returns {boolean}
     */
    isBelow(drawnCard, lastRowCard) {
        return this.getRankValue(drawnCard.rank) < this.getRankValue(lastRowCard.rank);
    },
    
    /**
     * Draw a card from deck
     * @param {GameState} gameState
     * @returns {Card|null}
     */
    drawCard(gameState) {
        if (!gameState.deck || gameState.deck.length === 0) {
            // Reshuffle discard pile if deck is empty
            if (gameState.discard.length > 0) {
                gameState.deck = [...gameState.discard];
                gameState.discard = [];
                // Shuffle deck
                for (let i = gameState.deck.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
                }
            } else {
                return null; // No cards left
            }
        }
        
        return gameState.deck.pop();
    },
    
    /**
     * Get current player
     * @param {GameState} gameState
     * @returns {Player|null}
     */
    getCurrentPlayer(gameState) {
        return gameState.players.find(p => p.id === gameState.turn.currentPlayerId) || null;
    },
    
    /**
     * Get next player in turn order
     * @param {GameState} gameState
     * @returns {Player|null}
     */
    getNextPlayer(gameState) {
        const currentIndex = gameState.players.findIndex(p => p.id === gameState.turn.currentPlayerId);
        const nextIndex = (currentIndex + 1) % gameState.players.length;
        return gameState.players[nextIndex] || null;
    },
    
    /**
     * Check if player has reached Chyster
     * @param {Player} player
     * @param {number} targetLength
     * @returns {boolean}
     */
    hasReachedChyster(player, targetLength) {
        return player.row.length >= targetLength;
    },
    
    /**
     * Check if player has Chyster Royale (all same color)
     * @param {Player} player
     * @param {number} targetLength
     * @returns {boolean}
     */
    hasChysterRoyale(player, targetLength) {
        if (!this.hasReachedChyster(player, targetLength)) return false;
        if (player.row.length === 0) return false;
        
        const firstColor = player.row[0].color;
        return player.row.every(card => card.color === firstColor);
    },
    
    /**
     * Process action: guess color
     * @param {GameState} gameState
     * @param {SuitColor} announcedColor
     * @returns {Object} - Action result
     */
    processGuessColor(gameState, announcedColor) {
        const player = this.getCurrentPlayer(gameState);
        if (!player) return { success: false, error: 'Joueur introuvable' };
        
        // Start attempt sequence
        gameState.turn.attempt = {
            active: true,
            max: 3,
            remaining: 3,
            announcedColor: announcedColor
        };
        
        return this.revealAndResolve(gameState);
    },
    
    /**
     * Process action: give sips
     * @param {GameState} gameState
     * @param {string} targetPlayerId
     * @returns {Object} - Action result
     */
    processGiveSips(gameState, targetPlayerId) {
        const currentPlayer = this.getCurrentPlayer(gameState);
        const targetPlayer = gameState.players.find(p => p.id === targetPlayerId);
        
        if (!currentPlayer || !targetPlayer) {
            return { success: false, error: 'Joueur introuvable' };
        }
        
        const sipsCount = currentPlayer.row.length;
        
        // Give sips to target player
        const message = `${currentPlayer.name} donne ${sipsCount} gorgée${sipsCount > 1 ? 's' : ''} à ${targetPlayer.name}`;
        
        // Discard current player's row (jokers excluded)
        gameState.discard.push(...currentPlayer.row);
        currentPlayer.row = [];
        
        // Add to history
        gameState.history.push(message);
        
        // Move to next player
        this.nextTurn(gameState);
        
        return {
            success: true,
            message: message,
            sipsCount: sipsCount,
            targetPlayer: targetPlayer.name
        };
    },
    
    /**
     * Reveal card and resolve according to rules
     * @param {GameState} gameState
     * @returns {Object} - Reveal result
     */
    revealAndResolve(gameState) {
        const card = this.drawCard(gameState);
        if (!card) {
            return { success: false, error: 'Plus de cartes disponibles' };
        }
        
        gameState.turn.lastRevealedCard = card;
        const player = this.getCurrentPlayer(gameState);
        
        // Handle special cards first
        if (card.special === 'V') return this.resolveJack(gameState, card);
        if (card.special === 'D') return this.resolveQueen(gameState, card);
        if (card.special === 'R') return this.resolveKing(gameState, card);
        if (card.special === 'A') return this.resolveAce(gameState, card);
        
        // Check color match
        const correctColor = card.color === gameState.turn.attempt.announcedColor;
        
        if (correctColor) {
            // Success: place card on row
            player.row.push(card);
            this.endAttempt(gameState);
            
            // Check for Chyster
            const chysterResult = this.checkForChyster(gameState, player);
            if (chysterResult.hasChyster) {
                return {
                    success: true,
                    correctColor: true,
                    card: card,
                    chyster: chysterResult
                };
            }
            
            this.nextTurn(gameState);
            return {
                success: true,
                correctColor: true,
                card: card
            };
        } else {
            // Wrong color: check above/below logic
            return this.resolveWrongColor(gameState, card);
        }
    },
    
    /**
     * Resolve wrong color according to rules
     * @param {GameState} gameState
     * @param {Card} card
     * @returns {Object}
     */
    resolveWrongColor(gameState, card) {
        const player = this.getCurrentPlayer(gameState);
        
        if (player.row.length === 0) {
            // No cards: drink 1 sip (handled in UI)
            gameState.discard.push(card);
            this.endAttempt(gameState);
            this.nextTurn(gameState);
            return {
                success: true,
                correctColor: false,
                card: card,
                noCards: true
            };
        }
        
        const lastCard = player.row[player.row.length - 1];
        
        if (this.isBelow(card, lastCard)) {
            // Below: drink N sips and discard all (including jokers)
            const sipsCount = player.row.length;
            gameState.discard.push(card);
            gameState.discard.push(...player.row);
            gameState.discard.push(...player.jokers);
            
            player.row = [];
            player.jokers = [];
            
            this.endAttempt(gameState);
            this.nextTurn(gameState);
            
            return {
                success: true,
                correctColor: false,
                card: card,
                below: true,
                sipsCount: sipsCount,
                discardAll: true
            };
        } else {
            // Above: use attempt system
            gameState.turn.attempt.remaining--;
            gameState.discard.push(card);
            
            if (gameState.turn.attempt.remaining <= 0) {
                // No attempts left: drink N sips and discard all
                const sipsCount = player.row.length;
                gameState.discard.push(...player.row);
                gameState.discard.push(...player.jokers);
                
                player.row = [];
                player.jokers = [];
                
                this.endAttempt(gameState);
                this.nextTurn(gameState);
                
                return {
                    success: true,
                    correctColor: false,
                    card: card,
                    above: true,
                    attemptsExhausted: true,
                    sipsCount: sipsCount,
                    discardAll: true
                };
            } else {
                // Continue attempts
                return {
                    success: true,
                    correctColor: false,
                    card: card,
                    above: true,
                    attemptsRemaining: gameState.turn.attempt.remaining,
                    continueAttempts: true
                };
            }
        }
    },
    
    /**
     * Resolve Jack (Valet) special card
     * @param {GameState} gameState
     * @param {Card} card
     * @returns {Object}
     */
    resolveJack(gameState, card) {
        gameState.discard.push(card);
        
        return {
            success: true,
            special: 'jack',
            card: card,
            message: 'Valet : Désigne 2 joueurs pour un shifu-bois !',
            needsPlayerSelection: true,
            selectionCount: 2,
            continueAttempts: true
        };
    },
    
    /**
     * Resolve Queen (Dame) special card
     * @param {GameState} gameState
     * @param {Card} card
     * @returns {Object}
     */
    resolveQueen(gameState, card) {
        gameState.discard.push(card);
        
        return {
            success: true,
            special: 'queen',
            card: card,
            message: 'Dame : Le dernier à dire le mot boit !',
            continueAttempts: true
        };
    },
    
    /**
     * Resolve King (Roi) special card
     * @param {GameState} gameState
     * @param {Card} card
     * @returns {Object}
     */
    resolveKing(gameState, card) {
        const player = this.getCurrentPlayer(gameState);
        
        // Place King above row (as joker)
        player.jokers.push(card);
        
        this.endAttempt(gameState);
        this.nextTurn(gameState);
        
        return {
            success: true,
            special: 'king',
            card: card,
            message: 'Roi : Joker placé ! Victoire automatique.',
            autoSuccess: true
        };
    },
    
    /**
     * Resolve Ace (As) special card
     * @param {GameState} gameState
     * @param {Card} card
     * @returns {Object}
     */
    resolveAce(gameState, card) {
        return {
            success: true,
            special: 'ace',
            card: card,
            message: 'As : Choisis 1 pour toi ou 10 pour un autre !',
            needsAceChoice: true,
            autoSuccess: true
        };
    },
    
    /**
     * Check if player has achieved Chyster
     * @param {GameState} gameState
     * @param {Player} player
     * @returns {Object}
     */
    checkForChyster(gameState, player) {
        const target = gameState.config.targetRowLength;
        const hasChyster = this.hasReachedChyster(player, target);
        const hasRoyale = this.hasChysterRoyale(player, target);
        
        return {
            hasChyster: hasChyster,
            hasRoyale: hasRoyale,
            targetLength: target,
            currentLength: player.row.length
        };
    },
    
    /**
     * End current attempt sequence
     * @param {GameState} gameState
     */
    endAttempt(gameState) {
        gameState.turn.attempt = {
            active: false,
            max: 3,
            remaining: 3,
            announcedColor: null
        };
    },
    
    /**
     * Process a guess (higher/lower/color)
     * @param {GameState} gameState
     * @param {string} guessType - 'higher', 'lower', 'red', 'black'
     * @returns {Object} Result object
     */
    processGuess(gameState, guessType) {
        if (!gameState.waitingForGuess || !gameState.currentCard) {
            throw new Error('Game not in guessing state');
        }
        
        // Draw next card
        const nextCard = gameState.deck.pop();
        if (!nextCard) {
            throw new Error('No more cards in deck');
        }
        
        let isCorrect = false;
        let message = '';
        
        const currentCard = gameState.currentCard;
        const currentValue = window.ChysterTypes.RANK_VALUES[currentCard.rank];
        const nextValue = window.ChysterTypes.RANK_VALUES[nextCard.rank];
        
        // Check guess based on type
        switch (guessType) {
            case 'higher':
                isCorrect = nextValue > currentValue;
                message = isCorrect ? 
                    `${nextCard.rank} est plus haut que ${currentCard.rank} !` :
                    `${nextCard.rank} n'est pas plus haut que ${currentCard.rank}`;
                break;
                
            case 'lower':
                isCorrect = nextValue < currentValue;
                message = isCorrect ? 
                    `${nextCard.rank} est plus bas que ${currentCard.rank} !` :
                    `${nextCard.rank} n'est pas plus bas que ${currentCard.rank}`;
                break;
                
            case 'red':
                isCorrect = nextCard.suit === 'HEARTS' || nextCard.suit === 'DIAMONDS';
                message = isCorrect ? 
                    `${nextCard.rank} de ${nextCard.suit} est rouge !` :
                    `${nextCard.rank} de ${nextCard.suit} est noir`;
                break;
                
            case 'black':
                isCorrect = nextCard.suit === 'CLUBS' || nextCard.suit === 'SPADES';
                message = isCorrect ? 
                    `${nextCard.rank} de ${nextCard.suit} est noir !` :
                    `${nextCard.rank} de ${nextCard.suit} est rouge`;
                break;
                
            default:
                throw new Error(`Unknown guess type: ${guessType}`);
        }
        
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        
        if (isCorrect) {
            // Good guess - add card to player's collection
            currentPlayer.cards.push(nextCard);
            
            // Check for special cards
            this.checkSpecialCard(gameState, nextCard);
            
            // Check if Chyster is available
            if (currentPlayer.cards.length >= gameState.targetRowLength) {
                gameState.chysterAvailable = true;
                gameState.waitingForGuess = false;
                gameState.waitingForAction = false;
            } else {
                // Continue guessing
                gameState.currentCard = nextCard;
            }
        } else {
            // Bad guess - increment attempts
            gameState.currentAttempts++;
            
            if (gameState.currentAttempts >= gameState.maxAttempts) {
                // Max attempts reached - pass turn
                this.passTurn(gameState);
            } else {
                // Try again
                gameState.currentCard = nextCard;
            }
        }
        
        return {
            success: isCorrect,
            card: nextCard,
            message: message,
            details: {
                cardsWon: isCorrect ? 1 : 0,
                jokersWon: 0, // Handled separately by special cards
                attemptsLeft: gameState.maxAttempts - gameState.currentAttempts
            }
        };
    },
    
    /**
     * Draw a card to start guessing
     * @param {GameState} gameState
     * @returns {Object} Result object
     */
    drawCard(gameState) {
        if (!gameState.waitingForAction) {
            throw new Error('Game not waiting for action');
        }
        
        if (gameState.deck.length === 0) {
            throw new Error('No more cards in deck');
        }
        
        // Draw card
        const card = gameState.deck.pop();
        gameState.currentCard = card;
        
        // Switch to guessing mode
        gameState.waitingForAction = false;
        gameState.waitingForGuess = true;
        
        return {
            card: card,
            message: `Carte tirée : ${card.rank} de ${card.suit}`
        };
    },
    
    /**
     * Use a joker
     * @param {GameState} gameState
     * @returns {Object} Result object
     */
    useJoker(gameState) {
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        
        if (currentPlayer.jokers <= 0) {
            throw new Error('No jokers available');
        }
        
        // Use joker
        currentPlayer.jokers--;
        
        // Skip the guess and get a card directly
        if (gameState.deck.length === 0) {
            throw new Error('No more cards in deck');
        }
        
        const card = gameState.deck.pop();
        currentPlayer.cards.push(card);
        
        // Check for special cards
        this.checkSpecialCard(gameState, card);
        
        // Check if Chyster is available
        if (currentPlayer.cards.length >= gameState.targetRowLength) {
            gameState.chysterAvailable = true;
            gameState.waitingForGuess = false;
            gameState.waitingForAction = false;
        } else {
            // Continue playing
            gameState.waitingForAction = true;
            gameState.waitingForGuess = false;
            gameState.currentCard = null;
        }
        
        return {
            card: card,
            message: `Joker utilisé ! Carte gagnée : ${card.rank} de ${card.suit}`
        };
    },
    
    /**
     * Claim Chyster
     * @param {GameState} gameState
     * @returns {Object} Result object
     */
    claimChyster(gameState) {
        if (!gameState.chysterAvailable) {
            throw new Error('Chyster not available');
        }
        
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        
        // Check if it's a Chyster Royale (all same color)
        const isRoyale = this.isChysterRoyale(currentPlayer.cards);
        
        return {
            isRoyale: isRoyale,
            cards: currentPlayer.cards,
            message: isRoyale ? 'Chyster Royale !' : 'Chyster !'
        };
    },
    
    /**
     * Distribute Chyster cards to target player
     * @param {GameState} gameState
     * @param {string} targetPlayerName
     * @param {boolean} isRoyale
     * @returns {Object} Result object
     */
    distributeChyster(gameState, targetPlayerName, isRoyale) {
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        const targetPlayer = gameState.players.find(p => p.name === targetPlayerName);
        
        if (!targetPlayer) {
            throw new Error('Target player not found');
        }
        
        const cardsCount = currentPlayer.cards.length;
        const multiplier = isRoyale ? 2 : 1;
        const totalCards = cardsCount * multiplier;
        
        // Clear current player's cards
        currentPlayer.cards = [];
        
        // Reset game state
        gameState.chysterAvailable = false;
        gameState.waitingForAction = true;
        gameState.waitingForGuess = false;
        gameState.currentCard = null;
        gameState.currentAttempts = 0;
        
        return {
            cardsCount: totalCards,
            targetPlayer: targetPlayerName,
            message: `${targetPlayerName} boit ${totalCards} cartes !`
        };
    },
    
    /**
     * Check if cards form a Chyster Royale (all same color)
     * @param {Card[]} cards
     * @returns {boolean}
     */
    isChysterRoyale(cards) {
        if (cards.length === 0) return false;
        
        const firstCardColor = this.getCardColor(cards[0]);
        return cards.every(card => this.getCardColor(card) === firstCardColor);
    },
    
    /**
     * Get card color (red or black)
     * @param {Card} card
     * @returns {string}
     */
    getCardColor(card) {
        return (card.suit === 'HEARTS' || card.suit === 'DIAMONDS') ? 'red' : 'black';
    },
    
    /**
     * Pass turn to next player
     * @param {GameState} gameState
     */
    passTurn(gameState) {
        // Reset current player state
        gameState.currentAttempts = 0;
        gameState.waitingForGuess = false;
        gameState.waitingForAction = true;
        gameState.currentCard = null;
        
        // Move to next player
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    },
    
    /**
     * Validate game state integrity
     * @param {GameState} gameState
     * @returns {Object} Validation result
     */
    validateGameState(gameState) {
        const errors = [];
        
        // Check basic structure
        if (!gameState) {
            errors.push('Game state is null or undefined');
            return { valid: false, errors };
        }
        
        // Check players
        if (!Array.isArray(gameState.players) || gameState.players.length === 0) {
            errors.push('Invalid players array');
        }
        
        // Check current player index
        if (gameState.currentPlayerIndex < 0 || gameState.currentPlayerIndex >= gameState.players.length) {
            errors.push('Invalid current player index');
        }
        
        // Check deck
        if (!Array.isArray(gameState.deck)) {
            errors.push('Invalid deck');
        }
        
        // Check game configuration
        if (!gameState.targetRowLength || gameState.targetRowLength < 1) {
            errors.push('Invalid target row length');
        }
        
        if (!gameState.maxAttempts || gameState.maxAttempts < 1) {
            errors.push('Invalid max attempts');
        }
        
        // Check state consistency
        if (gameState.currentAttempts > gameState.maxAttempts) {
            errors.push('Current attempts exceed maximum');
        }
        
        // Check players data
        gameState.players.forEach((player, index) => {
            if (!player.name || typeof player.name !== 'string') {
                errors.push(`Player ${index} has invalid name`);
            }
            
            if (!Array.isArray(player.cards)) {
                errors.push(`Player ${index} has invalid cards array`);
            }
            
            if (typeof player.jokers !== 'number' || player.jokers < 0) {
                errors.push(`Player ${index} has invalid jokers count`);
            }
        });
        
        return {
            valid: errors.length === 0,
            errors: errors,
            warnings: []
        };
    },
    
    /**
     * Get game statistics
     * @param {GameState} gameState
     * @returns {Object} Game statistics
     */
    getGameStats(gameState) {
        if (!gameState) return null;
        
        const currentPlayer = gameState.players[gameState.currentPlayerIndex];
        const totalCards = gameState.players.reduce((sum, player) => sum + player.cards.length, 0);
        const totalJokers = gameState.players.reduce((sum, player) => sum + player.jokers, 0);
        
        return {
            currentPlayer: currentPlayer.name,
            currentPlayerCards: currentPlayer.cards.length,
            currentPlayerJokers: currentPlayer.jokers,
            targetRowLength: gameState.targetRowLength,
            attemptsLeft: gameState.maxAttempts - gameState.currentAttempts,
            cardsInDeck: gameState.deck.length,
            totalCardsInPlay: totalCards,
            totalJokersInPlay: totalJokers,
            chysterAvailable: gameState.chysterAvailable,
            waitingForGuess: gameState.waitingForGuess,
            waitingForAction: gameState.waitingForAction
        };
    },

    /**
     * Move to next player's turn
     * @param {GameState} gameState
     */
    nextTurn(gameState) {
        const nextPlayer = this.getNextPlayer(gameState);
        if (nextPlayer) {
            gameState.turn.currentPlayerId = nextPlayer.id;
        }
    }
};

// Make core available globally
if (typeof window !== 'undefined') {
    window.ChysterCore = ChysterCore;
}