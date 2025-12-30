/**
 * Tests for Special Cards Detection
 */

const { isSpecialCard } = require('../js/game-logic');

describe('Special Cards Detection', () => {
    test('identifies As (A) as special card', () => {
        expect(isSpecialCard('A')).toBe(true);
    });

    test('identifies Valet (V) as special card', () => {
        expect(isSpecialCard('V')).toBe(true);
    });

    test('identifies Dame (D) as special card', () => {
        expect(isSpecialCard('D')).toBe(true);
    });

    test('identifies Roi (R) as special card', () => {
        expect(isSpecialCard('R')).toBe(true);
    });

    test('identifies numbered cards as NOT special', () => {
        expect(isSpecialCard('2')).toBe(false);
        expect(isSpecialCard('3')).toBe(false);
        expect(isSpecialCard('4')).toBe(false);
        expect(isSpecialCard('5')).toBe(false);
        expect(isSpecialCard('6')).toBe(false);
        expect(isSpecialCard('7')).toBe(false);
        expect(isSpecialCard('8')).toBe(false);
        expect(isSpecialCard('9')).toBe(false);
        expect(isSpecialCard('10')).toBe(false);
    });

    test('handles invalid card values', () => {
        expect(isSpecialCard('')).toBe(false);
        expect(isSpecialCard(null)).toBe(false);
        expect(isSpecialCard(undefined)).toBe(false);
        expect(isSpecialCard('X')).toBe(false);
    });
});
