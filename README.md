# Chyster Website

Site web pour le jeu de cartes Chyster avec design mobile-first et navigation par arbre de décision.

## ✨ Nouvelle Version - Navigation par Situation

Le site a été repensé avec une approche centrée sur l'utilisateur :

### 🎯 Navigation intuitive par situation
- **"Je n'ai pas de carte devant moi"** - Pour les débutants
- **"J'ai des cartes devant moi"** - Pour les choix stratégiques  
- **"J'ai atteint la Chyster"** - Pour la victoire
- **"Cartes spéciales"** - Pour les exceptions

### 📱 Design Mobile-First
- Interface optimisée pour les écrans tactiles
- Navigation fluide entre les sections
- Cartes interactives pour chaque situation

## 🚀 Fonctionnalités

- Design responsive et moderne
- Navigation par arbre de décision basée sur les situations de jeu
- Animations fluides
- Interface intuitive et accessible

## 📂 Structure

```
├── index.html              # Page principale (version timeline)
├── css/
│   └── style.css           # Styles pour la timeline
├── js/
│   ├── mobile-app.js      # Navigation mobile (actif)
│   ├── main.js            # JavaScript principal (legacy)
│   ├── cards-animation.js # Animations des cartes (legacy)
│   ├── counter.js         # Compteurs animés (legacy)
│   └── parallax.js        # Effets parallax (legacy)
└── backup files/
    ├── index_decision_tree_backup.html  # Version arbre de décision
    └── index_backup.html                # Version originale
```

## 🎮 Comment naviguer

1. **Situation** : Choisissez votre situation actuelle dans le jeu
2. **Action** : Suivez les étapes correspondantes
3. **Résultat** : Consultez les conséquences et actions suivantes

## 💻 Développement

Pour modifier le site :
1. Ouvrez avec VS Code
2. Utilisez Live Server pour le développement
3. Les styles sont dans `css/style.css`
4. La logique JavaScript est répartie dans le dossier `js/`

## 🔄 Historique des versions

- **v2.0** - Timeline des règles (actuelle sur mobile-adaptation)
- **v3.0** - Arbre de décision par situation (sauvegardée)
- **v1.0** - Design original (sauvegardée)

---

*Créé avec ❤️ pour des soirées inoubliables*