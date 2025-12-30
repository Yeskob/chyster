# Tests Automatiques Chyster

## 🧪 Suite de tests Jest

Cette suite de tests valide la logique métier du jeu Chyster pour éviter les régressions.

## 📊 Couverture actuelle

**29 tests** répartis en 4 suites :

- ✅ **gameState.test.js** (6 tests) - Gestion de l'état du jeu
- ✅ **specialCards.test.js** (6 tests) - Détection des cartes spéciales  
- ✅ **chyster.test.js** (7 tests) - Logique de victoire Chyster
- ✅ **flows.test.js** (10 tests) - Transitions de flux de jeu

## 🚀 Commandes

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch (re-exécute à chaque changement)
npm run test:watch

# Exécuter avec rapport de couverture
npm run test:coverage
```

## ✅ Ce qui est testé

### État du jeu
- Initialisation avec valeurs par défaut
- Incrémentation du compteur de cartes
- Décrémentation des essais restants
- Reset de l'état pour nouvelle partie
- Flag `hasStartedGuessing` (cache "distribuer gorgées")

### Cartes spéciales
- Détection A, V, D, R comme cartes spéciales
- Cartes normales (2-10) non spéciales
- Gestion des valeurs invalides

### Chyster
- Détection quand `cardsCount >= chysterTarget`
- Calcul des gorgées (normal et Royale x2)
- Nombre de destructions (1 ou 2 pour Royale)

### Flux de jeu
- Première carte (sans cartes existantes)
- Cartes existantes (choix stratégique)
- Système des 3 essais
- Cartes spéciales (A/V/D/R)
- Transition vers Chyster

## 🐛 Tests de non-régression

Ces tests couvrent les bugs corrigés :

1. ✅ Double incrémentation pour As 'self'
2. ✅ V/D ne retournent pas aux essais
3. ✅ "Distribuer gorgées" visible après guess
4. ✅ Chyster non déclenché après bonne couleur

## 📁 Structure

```
chyster-website/
├── js/
│   └── game-logic.js          # Fonctions testables (isolées)
├── tests/
│   ├── gameState.test.js      # Tests état du jeu
│   ├── specialCards.test.js   # Tests cartes spéciales
│   ├── chyster.test.js        # Tests Chyster
│   └── flows.test.js          # Tests flux complets
├── jest.config.js             # Configuration Jest
└── package.json               # Scripts npm
```

## 🔄 Workflow recommandé

1. **Avant de coder** : Lancer `npm run test:watch`
2. **Développer** : Les tests se relancent automatiquement
3. **Avant commit** : Vérifier que tous les tests passent
4. **CI/CD** : Intégrer `npm test` dans GitHub Actions (optionnel)

## 📝 Ajouter de nouveaux tests

Créer un fichier `tests/nouveauFeature.test.js` :

```javascript
const { maFonction } = require('../js/game-logic');

describe('Ma nouvelle feature', () => {
    test('devrait faire quelque chose', () => {
        expect(maFonction()).toBe(true);
    });
});
```

## ⚠️ Notes

- Les tests sont indépendants du DOM (pas de simulation navigateur)
- Pour tester l'UI, utiliser Playwright (tests E2E)
- Les fonctions testées sont dans `js/game-logic.js` (module séparé)
