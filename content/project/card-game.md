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

The public demo is the standalone frontend. The [source repository](https://github.com/rylew2/cardgame) contains the React frontend configured for local integration and the Django/GraphQL backend; the full path, including PostgreSQL, ran locally.

## Problem and constraints

The interface needed to make the game state legible while preserving the card-game rules: it displays the current hand, cards remaining, aces remaining, and controls to deal, reset, or play again. Each deal replaces the hand with cards from the remaining deck, so the state must consistently track the deck, hand, counters, and game phase.

I began with in-memory frontend state, then connected the same gameplay to a local backend. The backend integration was not deployed: the public URL hosts only the standalone frontend, while the integrated path was exercised locally.

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

## Outcome and tradeoffs

The result was a playable public frontend, a locally exercised React/Django/GraphQL/PostgreSQL path, and automated coverage of frontend game states, backend services, and GraphQL mutations. Visitors to the public demo can play the in-memory frontend, but they cannot exercise the backend integration.

The integrated version keeps Redux client state alongside the persisted backend state. That duplicates some state across the client and server, while exposing both state-management approaches within the same project.
