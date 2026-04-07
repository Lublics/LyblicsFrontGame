# Architecture — LyblicsFrontGame

> Jeu de stratégie par tour — Frontend React/TypeScript

## Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Zustand** + **Immer** (state management)
- Pas de backend (jeu 100% client-side)

## Structure

```
LyblicsFrontGame/
├── src/
│   ├── main.tsx                    # Point d'entrée React
│   ├── App.tsx                     # Composant racine
│   ├── ai/
│   │   ├── aiController.ts         # Contrôleur IA (logique décisionnelle)
│   │   ├── aiUtils.ts              # Utilitaires IA
│   │   └── strategies/             # Stratégies IA par faction
│   ├── components/
│   │   ├── Game/                   # Composants principaux du jeu
│   │   ├── HUD/                    # Interface utilisateur en overlay
│   │   ├── Map/                    # Rendu de la carte
│   │   ├── Menus/                  # Menus (principal, pause, victoire...)
│   │   └── Panels/                 # Panneaux de détail (territoire, unités...)
│   ├── constants/
│   │   ├── factions.ts             # Définition des factions
│   │   ├── gameConfig.ts           # Configuration globale du jeu
│   │   ├── techTree.ts             # Arbre technologique
│   │   └── territories.ts          # Données des territoires
│   ├── engine/
│   │   ├── actionPoints.ts         # Gestion des points d'action
│   │   ├── combat.ts               # Logique de combat
│   │   ├── movement.ts             # Logique de déplacement
│   │   ├── researchEngine.ts       # Moteur de recherche technologique
│   │   ├── resourceEngine.ts       # Moteur de ressources
│   │   ├── tickProcessor.ts        # Traitement des tours (tick)
│   │   ├── useGameLoop.ts          # Hook du game loop
│   │   └── victoryEngine.ts        # Conditions de victoire
│   ├── hooks/
│   │   ├── useAdjacentTerritories.ts
│   │   ├── useDiplomacy.ts
│   │   └── useSelectedTerritory.ts
│   ├── store/
│   │   └── useGameStore.ts         # Store Zustand global du jeu
│   ├── styles/
│   │   ├── index.css
│   │   ├── animations.css
│   │   └── parchment.css           # Style thématique parchemin
│   ├── types/
│   │   ├── index.ts                # Types principaux
│   │   ├── diplomacy.ts            # Types diplomatie
│   │   └── tech.ts                 # Types technologie
│   └── utils/
│       ├── colorUtils.ts
│       ├── formatters.ts
│       ├── gameInit.ts             # Initialisation d'une partie
│       └── svgPathUtils.ts         # Utilitaires carte SVG
├── public/
│   └── vite.svg
├── index.html
├── vite.config.ts
└── tsconfig.json
```

## Flux de données

```
useGameStore (Zustand)
    ↓ actions
Engine (combat, movement, resources, research...)
    ↓ résultats
AI Controller → lit le store → joue son tour
    ↓
tickProcessor → applique les effets de fin de tour
```
