---
title: Card Game
date: '2023-10'
slug: 'cardgame'
selectedWork: true
description: 'Building a fullstack React/GraphQL/Django card game'
previewImage: '/images/project/cardgame/cardgame.png'
liveSite: 'https://card-game-frontend.vercel.app/'
sourceCode: 'https://github.com/rylew2/cardgame'
tags:
  - javascript
  - python
  - django
  - fullstack
  - graphql
  - postgres
---

## Overview

I built this card game to learn a new full-stack combination: React, Redux Toolkit, GraphQL, Django, and PostgreSQL. The game deals from a standard 52-card deck; the player wins by reaching the final hand with at least one ace and loses when all aces have been exhausted before then.

The public demo is the standalone frontend. The Django, GraphQL, and PostgreSQL integration ran locally; the [source repository](https://github.com/rylew2/cardgame) contains both implementations.

## Problem and constraints

The interface needed to make the game state legible while preserving the card-game rules: it displays the current hand, cards remaining, aces remaining, and controls to deal, reset, or play again. Each deal replaces the hand with cards from the remaining deck, so the state must consistently track the deck, hand, counters, and game phase.

I began with in-memory frontend state, then connected the same gameplay to a local backend. Keeping the deployed demo frontend-only was a deliberate delivery boundary: the public experience remains playable without presenting the local service integration as a hosted full-stack application.

## Architecture and key decisions

On the frontend, Redux Toolkit centralizes the deck, hand, remaining-card and ace counts, and game phase. The `deal` and `reset` reducers make game transitions explicit, while the components render the phase-specific controls and game state. The frontend also includes GraphQL operations and generated TypeScript types for the integrated version.

The local backend uses Django models for cards and games, a GraphQL schema with deal and reset mutations, and PostgreSQL for persistence. A card records its suit, rank, and status; a game records its phase. The service layer applies state changes through the Django ORM and uses `bulk_update` for card updates rather than saving each card inside a loop.

```ts
state.deck = deck;
state.hand = hand;
state.cardsLeft = deck.length;
state.acesLeft -= acesInHand;
```

That reducer update keeps the frontend's visible counters aligned with the cards and hand returned by a deal.

## Testing and delivery

The frontend test suite uses React Testing Library with a Redux-aware render helper. It covers the initial hand, distinct dealt hands, reset and play-again flows, and won and lost game states. The repository also includes Django service and GraphQL tests for dealing and resetting games.

The public link in this project is the standalone React frontend. The full Django/GraphQL/PostgreSQL path was run locally, with the frontend configured to call the local GraphQL endpoint for that integration.

## Outcome and tradeoffs

This project provided a concrete way to work through frontend state management, GraphQL types and operations, Django models and services, and a PostgreSQL-backed game state in one small application.

The standalone frontend and the local full-stack integration intentionally remain separate delivery modes. Redux continues to represent the client-side game state even when the GraphQL-backed version is used, which kept the learning focus on both state-management approaches rather than reducing the application to only one of them.
