module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'js/**/*.js',
    '!js/cards-animation.js',
    '!js/mobile-app.js',
    '!js/parallax.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};
