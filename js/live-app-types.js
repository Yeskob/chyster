/* ===================================
   CHYSTER LIVE APP - TYPE DEFINITIONS
   JavaScript implementation of TypeScript types
   =================================== */

// Since we're using vanilla JS, we'll use JSDoc for type documentation
// and runtime validation functions

/**
 * @typedef {'red' | 'black'} SuitColor
 */

/**
 * @typedef {'A'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'V'|'D'|'R'} Rank
 */

/**
 * @typedef {'V'|'D'|'R'|'A'|null} Special
 */

/**
 * @typedef {Object} Card
 * @property {string} id - Unique identifier for the card
 * @property {Rank} rank - Card rank (A, 2-10, V, D, R)
 * @property {SuitColor} color - Card color (red or black)
 * @property {Special} special - Special card type or null
 */

/**
 * @typedef {Object} Player
 * @property {string} id - Unique player identifier
 * @property {string} name - Player display name
 * @property {Card[]} row - Cards placed in player's row
 * @property {Card[]} jokers - King cards placed above row (don't count for Chyster)
 */

/**
 * @typedef {Object} GameConfig
 * @property {number} playersCount - Number of players (2-8+)
 * @property {number} targetRowLength - Cards needed for Chyster (based on player count)
 */

/**
 * @typedef {Object} AttemptState
 * @property {boolean} active - Whether attempt sequence is active
 * @property {number} max - Maximum attempts allowed (always 3)
 * @property {number} remaining - Attempts remaining (3..0)
 * @property {SuitColor} [announcedColor] - Color announced by player
 */

/**
 * @typedef {Object} TurnState
 * @property {string} currentPlayerId - ID of current player
 * @property {AttemptState} attempt - Current attempt state
 * @property {Card} [lastRevealedCard] - Last card revealed from deck
 */

/**
 * @typedef {Object} GameState
 * @property {string} id - Unique game identifier
 * @property {GameConfig} config - Game configuration
 * @property {Card[]} deck - Remaining cards in deck
 * @property {Card[]} discard - Discarded cards pile
 * @property {Player[]} players - All players in the game
 * @property {TurnState} turn - Current turn state
 * @property {string[]} history - Game action history for toasts
 */

/**
 * Card rank value mapping for comparisons
 * @type {Object<Rank, number>}
 */
const RANK_VALUES = {
    'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'V': 11, 'D': 12, 'R': 99 // R is special (joker)
};

/**
 * Players count to target row length mapping (Chyster calculation)
 * From Annexe A specifications
 * @type {Object<number, number>}
 */
const CHYSTER_TARGET_MAP = {
    2: 11, 3: 10, 4: 9, 5: 8, 6: 7, 7: 6, 8: 5, 9: 5, 10: 5
};

/**
 * Standard 52-card deck definition
 * @type {Array<{rank: Rank, suit: string, special: Special}>}
 */
const STANDARD_DECK = [
    // Hearts (red)
    { rank: 'A', suit: 'HEARTS', special: 'A' },
    { rank: '2', suit: 'HEARTS', special: null },
    { rank: '3', suit: 'HEARTS', special: null },
    { rank: '4', suit: 'HEARTS', special: null },
    { rank: '5', suit: 'HEARTS', special: null },
    { rank: '6', suit: 'HEARTS', special: null },
    { rank: '7', suit: 'HEARTS', special: null },
    { rank: '8', suit: 'HEARTS', special: null },
    { rank: '9', suit: 'HEARTS', special: null },
    { rank: '10', suit: 'HEARTS', special: null },
    { rank: 'V', suit: 'HEARTS', special: 'V' },
    { rank: 'D', suit: 'HEARTS', special: 'D' },
    { rank: 'R', suit: 'HEARTS', special: 'R' },
    
    // Diamonds (red)
    { rank: 'A', suit: 'DIAMONDS', special: 'A' },
    { rank: '2', suit: 'DIAMONDS', special: null },
    { rank: '3', suit: 'DIAMONDS', special: null },
    { rank: '4', suit: 'DIAMONDS', special: null },
    { rank: '5', suit: 'DIAMONDS', special: null },
    { rank: '6', suit: 'DIAMONDS', special: null },
    { rank: '7', suit: 'DIAMONDS', special: null },
    { rank: '8', suit: 'DIAMONDS', special: null },
    { rank: '9', suit: 'DIAMONDS', special: null },
    { rank: '10', suit: 'DIAMONDS', special: null },
    { rank: 'V', suit: 'DIAMONDS', special: 'V' },
    { rank: 'D', suit: 'DIAMONDS', special: 'D' },
    { rank: 'R', suit: 'DIAMONDS', special: 'R' },
    
    // Clubs (black)
    { rank: 'A', suit: 'CLUBS', special: 'A' },
    { rank: '2', suit: 'CLUBS', special: null },
    { rank: '3', suit: 'CLUBS', special: null },
    { rank: '4', suit: 'CLUBS', special: null },
    { rank: '5', suit: 'CLUBS', special: null },
    { rank: '6', suit: 'CLUBS', special: null },
    { rank: '7', suit: 'CLUBS', special: null },
    { rank: '8', suit: 'CLUBS', special: null },
    { rank: '9', suit: 'CLUBS', special: null },
    { rank: '10', suit: 'CLUBS', special: null },
    { rank: 'V', suit: 'CLUBS', special: 'V' },
    { rank: 'D', suit: 'CLUBS', special: 'D' },
    { rank: 'R', suit: 'CLUBS', special: 'R' },
    
    // Spades (black)
    { rank: 'A', suit: 'SPADES', special: 'A' },
    { rank: '2', suit: 'SPADES', special: null },
    { rank: '3', suit: 'SPADES', special: null },
    { rank: '4', suit: 'SPADES', special: null },
    { rank: '5', suit: 'SPADES', special: null },
    { rank: '6', suit: 'SPADES', special: null },
    { rank: '7', suit: 'SPADES', special: null },
    { rank: '8', suit: 'SPADES', special: null },
    { rank: '9', suit: 'SPADES', special: null },
    { rank: '10', suit: 'SPADES', special: null },
    { rank: 'V', suit: 'SPADES', special: 'V' },
    { rank: 'D', suit: 'SPADES', special: 'D' },
    { rank: 'R', suit: 'SPADES', special: 'R' }
];

// Validation functions

/**
 * Validates if a value is a valid SuitColor
 * @param {any} value
 * @returns {boolean}
 */
function isValidSuitColor(value) {
    return value === 'red' || value === 'black';
}

/**
 * Validates if a value is a valid Rank
 * @param {any} value
 * @returns {boolean}
 */
function isValidRank(value) {
    return ['A','2','3','4','5','6','7','8','9','10','V','D','R'].includes(value);
}

/**
 * Validates if a value is a valid Special
 * @param {any} value
 * @returns {boolean}
 */
function isValidSpecial(value) {
    return value === null || ['V','D','R','A'].includes(value);
}

/**
 * Validates if an object is a valid Card
 * @param {any} card
 * @returns {boolean}
 */
function isValidCard(card) {
    return card && 
           typeof card.id === 'string' &&
           isValidRank(card.rank) &&
           isValidSuitColor(card.color) &&
           isValidSpecial(card.special);
}

/**
 * Validates if an object is a valid Player
 * @param {any} player
 * @returns {boolean}
 */
function isValidPlayer(player) {
    return player &&
           typeof player.id === 'string' &&
           typeof player.name === 'string' &&
           Array.isArray(player.row) &&
           Array.isArray(player.jokers) &&
           player.row.every(isValidCard) &&
           player.jokers.every(isValidCard);
}

/**
 * Creates a unique identifier
 * @returns {string}
 */
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Make types available globally
if (typeof window !== 'undefined') {
    window.ChysterTypes = {
        RANK_VALUES,
        CHYSTER_TARGET_MAP,
        STANDARD_DECK,
        isValidSuitColor,
        isValidRank,
        isValidSpecial,
        isValidCard,
        isValidPlayer,
        generateId
    };
}