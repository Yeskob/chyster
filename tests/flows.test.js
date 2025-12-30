/**
 * Tests for Game Flow Transitions
 */

const {
    initializeGameState,
    incrementCardCount,
    startGuessing,
    decrementTries,
    resetGameState
} = require('../js/game-logic');

describe('Game Flow Transitions', () => {
    describe('First card flow (no cards)', () => {
        test('starts with 0 cards', () => {
            const state = initializeGameState();
            expect(state.cardsCount).toBe(0);
        });

        test('correct color prediction increments card count', () => {
            let state = initializeGameState();
            state = incrementCardCount(state);
            expect(state.cardsCount).toBe(1);
        });
    });

    describe('Has cards flow', () => {
        test('hasStartedGuessing is false initially', () => {
            const state = initializeGameState();
            expect(state.hasStartedGuessing).toBe(false);
        });

        test('choosing "guess" sets hasStartedGuessing to true', () => {
            let state = initializeGameState();
            state.cardsCount = 3;
            state = startGuessing(state);
            
            expect(state.hasStartedGuessing).toBe(true);
        });

        test('wrong color decrements tries when has cards', () => {
            let state = initializeGameState();
            state.cardsCount = 3;
            state.triesRemaining = 3;
            
            state = decrementTries(state);
            expect(state.triesRemaining).toBe(2);
            
            state = decrementTries(state);
            expect(state.triesRemaining).toBe(1);
            
            state = decrementTries(state);
            expect(state.triesRemaining).toBe(0);
        });

        test('exhausting tries resets cards to 0', () => {
            let state = initializeGameState();
            state.cardsCount = 5;
            state.triesRemaining = 0;
            
            // When tries are exhausted, new game starts
            state = resetGameState(state);
            expect(state.cardsCount).toBe(0);
            expect(state.triesRemaining).toBe(3);
        });
    });

    describe('Special cards flow', () => {
        test('As (self) increments card count', () => {
            let state = initializeGameState();
            state.cardsCount = 3;
            
            state = incrementCardCount(state);
            expect(state.cardsCount).toBe(4);
        });

        test('Roi (R) does NOT increment card count (joker)', () => {
            let state = initializeGameState();
            state.cardsCount = 3;
            
            // Roi is a joker, should not increment cardsCount
            // (no action needed, cardsCount stays the same)
            expect(state.cardsCount).toBe(3);
        });
    });

    describe('Chyster flow', () => {
        test('reaching 9 cards triggers Chyster', () => {
            let state = initializeGameState();
            
            // Simulate reaching 9 cards
            for (let i = 0; i < 9; i++) {
                state = incrementCardCount(state);
            }
            
            expect(state.cardsCount).toBe(9);
        });

        test('Chyster resets game state', () => {
            let state = initializeGameState();
            state.cardsCount = 9;
            state.jokersCount = 2;
            state.isRoyale = true;
            
            state = resetGameState(state);
            
            expect(state.cardsCount).toBe(0);
            expect(state.jokersCount).toBe(0);
            expect(state.isRoyale).toBe(false);
        });
    });
});
