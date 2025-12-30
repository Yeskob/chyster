/**
 * Game Logic Module - Testable functions for Chyster game
 */

// Check if a card is special (A, V, D, R)
function isSpecialCard(cardValue) {
    return ['A', 'V', 'D', 'R'].includes(cardValue);
}

// Initialize game state
function initializeGameState() {
    return {
        cardsCount: 0,
        jokersCount: 0,
        chysterTarget: 9,
        triesRemaining: 3,
        hasStartedGuessing: false,
        drinkConfirmed: false,
        predictedColor: null,
        isRoyale: false
    };
}

// Increment card count
function incrementCardCount(gameState) {
    return {
        ...gameState,
        cardsCount: gameState.cardsCount + 1
    };
}

// Decrement tries remaining
function decrementTries(gameState) {
    return {
        ...gameState,
        triesRemaining: Math.max(0, gameState.triesRemaining - 1)
    };
}

// Check if Chyster achievement is reached
function checkChysterAchievement(gameState) {
    return gameState.cardsCount >= gameState.chysterTarget;
}

// Calculate Chyster sips (with Royale multiplier)
function calculateChysterSips(cardsCount, isRoyale) {
    const multiplier = isRoyale ? 2 : 1;
    return cardsCount * multiplier;
}

// Calculate number of game destructions allowed
function calculateDestructions(isRoyale) {
    return isRoyale ? 2 : 1;
}

// Reset game state for new game
function resetGameState(gameState) {
    return {
        ...gameState,
        cardsCount: 0,
        jokersCount: 0,
        triesRemaining: 3,
        hasStartedGuessing: false,
        drinkConfirmed: false,
        predictedColor: null,
        isRoyale: false
    };
}

// Mark that guessing has started (hides "distribute drinks" option)
function startGuessing(gameState) {
    return {
        ...gameState,
        hasStartedGuessing: true,
        triesRemaining: 3
    };
}

// Check if card comparison should happen (has cards and wrong color)
function shouldCompareCardValues(gameState, predictedColor, actualColor) {
    return gameState.cardsCount > 0 && predictedColor !== actualColor;
}

/**
 * Handle special card in "with cards" context
 * Returns the new state and the action to take
 * 
 * @param {Object} gameState - Current game state
 * @param {string} cardValue - The special card value (A, V, D, R)
 * @returns {Object} { newState, action } - Updated state and action to perform
 */
function handleSpecialCardWithCards(gameState, cardValue) {
    switch (cardValue) {
        case 'A':
            // As: choice between self or other, may increment cards
            return {
                newState: gameState,
                action: 'as-choice' // UI will handle the choice
            };
        
        case 'V':
            // Valet: Shifu-bois then retry color guess
            // IMPORTANT: Does NOT decrement tries!
            return {
                newState: gameState, // State unchanged
                action: 'retry-color' // Return to color choice
            };
        
        case 'D':
            // Dame: Play game then retry color guess
            // IMPORTANT: Does NOT decrement tries!
            return {
                newState: gameState, // State unchanged
                action: 'retry-color' // Return to color choice
            };
        
        case 'R':
            // Roi: Joker, increment jokers but NOT cards
            return {
                newState: {
                    ...gameState,
                    jokersCount: gameState.jokersCount + 1
                },
                action: 'success' // Turn ends successfully
            };
        
        default:
            return {
                newState: gameState,
                action: 'unknown'
            };
    }
}

// Export for testing (CommonJS for Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isSpecialCard,
        initializeGameState,
        incrementCardCount,
        decrementTries,
        checkChysterAchievement,
        calculateChysterSips,
        calculateDestructions,
        resetGameState,
        startGuessing,
        shouldCompareCardValues,
        handleSpecialCardWithCards
    };
}
