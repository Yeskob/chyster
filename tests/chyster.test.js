/**
 * Tests for Chyster Achievement Logic
 */

const {
    checkChysterAchievement,
    calculateChysterSips,
    calculateDestructions,
    initializeGameState
} = require('../js/game-logic');

describe('Chyster Achievement', () => {
    test('returns false when cards count is below target', () => {
        let state = initializeGameState();
        state.cardsCount = 8;
        state.chysterTarget = 9;
        
        expect(checkChysterAchievement(state)).toBe(false);
    });

    test('returns true when cards count equals target', () => {
        let state = initializeGameState();
        state.cardsCount = 9;
        state.chysterTarget = 9;
        
        expect(checkChysterAchievement(state)).toBe(true);
    });

    test('returns true when cards count exceeds target', () => {
        let state = initializeGameState();
        state.cardsCount = 10;
        state.chysterTarget = 9;
        
        expect(checkChysterAchievement(state)).toBe(true);
    });

    test('calculates sips correctly for normal Chyster', () => {
        expect(calculateChysterSips(9, false)).toBe(9);
        expect(calculateChysterSips(5, false)).toBe(5);
        expect(calculateChysterSips(10, false)).toBe(10);
    });

    test('calculates sips correctly for Chyster Royale (x2)', () => {
        expect(calculateChysterSips(9, true)).toBe(18);
        expect(calculateChysterSips(5, true)).toBe(10);
        expect(calculateChysterSips(10, true)).toBe(20);
    });

    test('calculates 1 destruction for normal Chyster', () => {
        expect(calculateDestructions(false)).toBe(1);
    });

    test('calculates 2 destructions for Chyster Royale', () => {
        expect(calculateDestructions(true)).toBe(2);
    });
});
