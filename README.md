# Lyblics — Conquête de Territoire - https://front.lyblics.com/

Jeu de stratégie au tour par tour en navigateur. Commandez vos armées, gérez vos ressources, recherchez des technologies et conquérez la carte face à des factions adverses pilotées par l'IA.

## Stack technique

| Outil | Rôle |
|---|---|
| React 18 | Interface utilisateur |
| TypeScript 5.5 | Typage statique |
| Vite 5 | Bundler / dev server |
| Zustand + Immer | Gestion d'état globale |

## Lancer le projet

```bash
npm install
npm run dev
```

Ouvrir `http://localhost:5173` dans le navigateur.

```bash
npm run build    # Build de production
npm run preview  # Prévisualiser le build
```

## Gameplay

### Factions
Choisissez une faction humaine et affrontez des factions IA dotées de stratégies différentes :
- **Aggressive** — attaque en priorité
- **Défensive** — fortifie ses territoires
- **Expansionniste** — cherche à s'étendre rapidement

### Ressources
Trois ressources à gérer chaque tour : `Or`, `Nourriture`, `Bois`. Chaque territoire génère des ressources selon son type de terrain.

### Unités
| Unité | Type |
|---|---|
| Milice | Infanterie légère |
| Archer | Unité à distance |
| Chevalier | Cavalerie lourde |
| Siège | Artillerie |

### Conditions de victoire
- **Domination** — contrôler la majorité des territoires
- **Élimination** — éliminer toutes les factions adverses
- **Économique** — atteindre un seuil de ressources

### Terrains
`Plaines`, `Forêt`, `Collines`, `Montagnes`, `Marais`, `Côtier`, `Forteresse` — chaque terrain confère un bonus défensif différent.

## Structure du projet

```
src/
├── App.tsx              # Routage entre les phases de jeu
├── components/
│   ├── Game/            # Vue principale du jeu
│   ├── HUD/             # Interface en jeu (ressources, tour, actions)
│   ├── Map/             # Carte SVG interactive
│   ├── Menus/           # Menu principal, setup, victoire
│   └── Panels/          # Panneaux de détail (territoire, armée, recherche)
├── engine/
│   ├── tickProcessor.ts # Traitement du passage de tour
│   ├── combat.ts        # Résolution des combats
│   ├── movement.ts      # Déplacements d'armées
│   ├── resourceEngine.ts# Génération des ressources
│   ├── researchEngine.ts# Arbre technologique
│   ├── victoryEngine.ts # Vérification des conditions de victoire
│   └── actionPoints.ts  # Système de points d'action
├── ai/
│   ├── aiController.ts  # Boucle de décision IA
│   ├── aiUtils.ts       # Utilitaires IA
│   └── strategies/      # Stratégies par faction IA
├── store/
│   └── useGameStore.ts  # État global Zustand
├── constants/           # Config du jeu, factions, territoires, tech tree
├── types/               # Types TypeScript partagés
├── hooks/               # Hooks React (territoires adjacents, diplomatie...)
└── styles/              # CSS global (thème parchemin, animations)
```

## Phases de jeu

```
menu → setup → player_turn ↔ ai_turn → victory
```
