---
title: Card Game
date: '2023-10'
slug: 'cardgame'
selectedWork: true
description: 'Building with a fullstack django graphql project'
previewImage: '/images/project/cardgame/cardgame.png'
liveSite: 'https://card-game-frontend.vercel.app/'
sourceCode: 'https://github.com/rylew2/cardgame'
tags:
    - javascript
    - python
    - django
    - fullstack
---

## Intro

In this project, I was interested in working with a new stack, so I took on a project to build a card game with React, GraphQL, and Django. It was an interesting exploration into first building the frontend portion, then setting up GraphQL model types, a Django application, and PostgresQL database.

## Game Rules
- Standard 52 card deck
- The goal is to end up with the last hand having at least one ace:
- A hand is 5 cards, and each hand is randomly dealt from the remaining cards in the deck each time the user clicks the Deal button.
   - If you make it to the final hand, it will be 2 cards
- The game is "over" if all the aces in the deck have been dealt before the last hand
- The game is considered a "win" if the the last hand contains at least 1 ace
- The game can be replayed as many times as needed - there's always a Reset (or Play Again) button present
- The number of cards left and the number of aces left are displayed at the top
-




## Frontend App
