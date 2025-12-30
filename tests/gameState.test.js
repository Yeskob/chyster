/**
 * Tests for Game State Management
 */

const {
    initializeGameState,
    incrementCardCount,
    decrementTries,
    resetGameState,
    startGuessing,
    shouldCompareCardValues
} = require('../js/game-logic');

describe('Game State Management', () => {
    test('initializes game state with correct default values', () => {
        const state = initializeGameState();
        
        expect(state.cardsCount).toBe(0);
        expect(state.jokersCount).toBe(0);
        expect(state.triesRemaining).toBe(3);
        expect(state.hasStartedGuessing).toBe(false);
        expect(state.drinkConfirmed).toBe(false);
        expect(state.chysterTarget).toBe(9);
        expect(state.isRoyale).toBe(false);
    });

    test('increments card count correctly', () => {
        let state = initializeGameState();
        
        state = incrementCardCount(state);
        expect(state.cardsCount).toBe(1);
        
        state = incrementCardCount(state);
        expect(state.cardsCount).toBe(2);
        
        state = incrementCardCount(state);
        expect(state.cardsCount).toBe(3);
    });

    test('decrements tries remaining correctly', () => {
        let state = initializeGameState();
        
        expect(state.triesRemaining).toBe(3);
        
        state = decrementTries(state);
        expect(state.triesRemaining).toBe(2);
        
        state = decrementTries(state);
        expect(state.triesRemaining).toBe(1);
        
        state = decrementTries(state);
        expect(state.triesRemaining).toBe(0);
        
        // Should not go below 0
        state = decrementTries(state);
        expect(state.triesRemaining).toBe(0);
    });

    test('resets game state correctly', () => {
        let state = initializeGameState();
        state.cardsCount = 5;
        state.jokersCount = 2;
        state.triesRemaining = 1;
        state.hasStartedGuessing = true;
        state.isRoyale = true;
        
        state = resetGameState(state);
        
        expect(state.cardsCount).toBe(0);
        expect(state.jokersCount).toBe(0);
        expect(state.triesRemaining).toBe(3);
        expect(state.hasStartedGuessing).toBe(false);
        expect(state.isRoyale).toBe(false);
    });

    test('marks guessing as started and resets tries', () => {
        let state = initializeGameState();
        state.triesRemaining = 1;
        
        state = startGuessing(state);
        
        expect(state.hasStartedGuessing).toBe(true);
        expect(state.triesRemaining).toBe(3);
    });

    test('determines when card value comparison should occur', () => {
        let state = initializeGameState();
        
        // No cards: should not compare
        expect(shouldCompareCardValues(state, 'red', 'black')).toBe(false);
        
        // Has cards + wrong color: should compare
        state.cardsCount = 3;
        expect(shouldCompareCardValues(state, 'red', 'black')).toBe(true);
        
        // Has cards + correct color: should not compare
        expect(shouldCompareCardValues(state, 'red', 'red')).toBe(false);
    });
});
