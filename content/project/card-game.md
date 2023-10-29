---
title: Card Game
date: '2023-10'
slug: 'cardgame'
selectedWork: true
description: 'Building with a fullstack django graphql project'
previewImage: '/images/project/cardgame/cardgame.png'
liveSite: 'https://card-game-frontend.vercel.app/'
sourceCode: 'https://github.com/rylew2/cardgame' (full repo available by request)
tags:
    - javascript
    - python
    - django
    - fullstack
    - graphql
    - postgres
---

## Intro

In this project, I was interested in working with a new stack, so I took on a project to build a card game with React, GraphQL, Django, and Postgres. It was an interesting exploration into first building the frontend portion, then setting up GraphQL model types, a Django application, and PostgresQL database - all wrapped up in Docker with a robust set of `Makefile`. The project was my first time using both Django, GraphQL, and `react-redux` .

## Game Rules

-   Standard 52 card deck
-   The goal is to end up with the last hand having at least one ace:
-   A dealt hand is 5 cards, and each hand is randomly dealt from the remaining cards in the deck each time the user clicks the `Deal` button.
    -   If you successfully make it to the final dealt cards, there will be 2 cards in a hand
-   The game is "over" if all the aces in the deck have been dealt/exhausted before the last hand
-   The game is considered a "win" if the the last hand contains at least 1 ace
-   The game can be replayed as many times as needed - there's always a Reset (or `Play Again`) button present
-   The number of cards left and the number of aces left are displayed at the top


# Frontend App

I first built the frontend app (without any GraphQL) and a sort of mocked deck. The time consuming part here was setting up all the CSS - especially for intricate pieces like the card suit (club/ace/heart/diamond in different orientations), the card animation and rotation, and the overall layout.

https://card-game-frontend.vercel.app/

#### CSS/Design

Since the look and feel was not an area I wanted to perfect, I tried to speed things by using Tailwind utility classes (usually inline). I'm typically used to a more established design system setup with larger projects, but I found simplifying things in this area got me to more of the front end state management issues faster.

Simlarly with the animation and rotation - I quickly gave a bit of a curve to make the hand look like it was dealt, added some opacity animations as cards were "dealt" into place on the board, and added confettie animation (3rd party package) for the win state.

#### React/state considerations

 Typically `useState` suffices for a small app like this, but I wanted some experience with `redux-toolkit` - so I spent some time reading their [excellent docs](https://redux-toolkit.js.org/tutorials/typescript) to help bootstrap the setup of typescript friendly action creators and a test setup file that made it easy to mock the redux store so I could test any state.

The store itself was fairly straightforward with 2 actions (`deal` and `reset`), and 2 reducers with the same name. `Reset` simply returns the deck to 47 cards (with 5 having been randomly dealt to the user). `Deal` will try to deal a new hand and determine what state that new hand will indicate.

The store's `deal` reducer:
```
    deal: (state: GameState, action: PayloadAction<DealAction>) => {
      const { hand, deck } = action.payload;

      const acesInHand = getAcesInHand(hand); // call to utility function
      const stateAcesLeftInDeck = state.acesLeft - acesInHand;

      // directly update state variables in an immutable way using redux-toolkit/Immer
      state.deck = deck;
      state.hand = hand;
      state.cardsLeft = deck.length;
      state.acesLeft -= acesInHand;

      // check for game phase change if no aces left
      if (stateAcesLeftInDeck <= 0) {
        // if aces in hand on the last deal
        if (acesInHand >= 1 && deck.length === 0) {
          state.gamePhase = GamePhase.Won;
        } else {
          state.gamePhase = GamePhase.Lost;
        }
      }
    },
```


#### Testing

Once the redux store `renderWitProviders` is setup, it becomes really easy to make assertions (using `React Testing Library`) for what's directly on the screen in a given state:

```
   test('overridden initial state', () => {
        const preloadedState = {
          game: {
            deck: [],
            hand: [],
            cardsLeft: 30,
            acesLeft: 1,
            gamePhase: GamePhase.InProgress,
          },
        };

        renderWithProviders(<App />, {
          preloadedState,
        });

        expect(screen.getByText('30')).toBeInTheDocument();
        // additional assertions...
      });
```

Or even a simple test that actually clicks things on the screen (I usually define button clicks and actions as their own functions to keep tests compact):
```
  test('reset game', async () => {
      renderWithProviders(<App />);

      expect(getCardsLeftCountByText('Cards Left')).toBe(47);
      await waitFor(() => {
        clickDealButton();
        expect(getCardsLeftCountByText('Cards Left')).toBe(42);
      });
    });
```

#### If more time allowed for the front end:
While I wanted to touch all parts of the stack with this project and not spend a ton of time perfecting the frontend, there are a few areas I wish I had more time to explore:

- Move some of the Tailwind classes added to components into CSS files, maybe create app specific variables for colors and shared styles. As mentioned above, the utility classes were done hastily to reach frontend completion.
- Animation changes:
    - Fix some of the animation jitter between each hand deal
    - There's also a known issue when going from a low width to a high width - it will trigger the animation again - this could likely be stopped with a handleResize type function that passes props to prevent repeat animations.
- Didn't get into any react performance issues with the React Dev tools given this was a small app - but you could look at things like `React.memo` or preventing unnecessary re-renders
     - added some simple `useCallback` on the click handler functions that get passed down into other components
- More robust component library
    - Creating a reusable `Button` component for example
    - Combining the game state components into one shared component ( combining GameWon, GameInProgress, GameLost)
- Pull test helper functions out to separate file




# Backend


