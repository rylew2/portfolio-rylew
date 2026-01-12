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

## Intro

In this project, I was interested in working with a new stack, so I took on a project to build a card game with React, GraphQL, Django, and Postgres. This project was a foray into developing the frontend, establishing GraphQL model types, configuring a Django application, and setting up a PostgreSQL database, all containerized with Docker and orchestrated by robust Makefile commands. The project was my first time using Django, GraphQL, and `react-redux`.

[Source code here](https://github.com/rylew2/cardgame) - (full repo available by request)

## Game Rules

- Standard 52-card deck
- The goal is to end up with the last hand having at least one ace.
- A dealt hand is 5 cards, and each hand is randomly dealt from the remaining cards in the deck each time the user clicks the `Deal` button.
  - If you successfully make it to the final hand without losing, there will be 2 cards in the hand.
- The game is "over" if all the aces in the deck have been dealt/exhausted before the last hand.
- The game is considered a "win" if the last hand contains at least 1 ace.
- The game can be replayed as many times as needed—there's always a Reset (or `Play Again`) button present.
- The number of cards left and the number of aces left are displayed at the top.

## Frontend App

I first built the frontend app (without any GraphQL) with all the state (deck, hand, aces left) as in-memory data. The time-consuming part here was setting up all the CSS—especially for intricate pieces like the card suit (club/ace/heart/diamond in different orientations), the card animation and rotation, and the overall layout.

The standalone frontend app is here:
https://card-game-frontend.vercel.app/

### CSS/Design

To expedite development without perfecting the design, I utilized inline Tailwind utility classes. I'm typically used to a more established design system setup with larger projects, but I found simplifying CSS in this area got me to more of the frontend state management issues faster.

Similarly, with the animation and rotation—I quickly gave a bit of a curve to make the hand look like it was dealt, added some opacity animations as cards were "dealt" into place on the board, and added confetti animation (3rd party package) for the win state.

### React/state considerations

Although `useState` is often sufficient for small apps, I opted to gain experience with `redux-toolkit`—so I spent some time reading their [excellent docs](https://redux-toolkit.js.org/tutorials/typescript) to help bootstrap the setup of TypeScript-friendly action creators and a test setup file that made it easy to mock the Redux store so I could test any game state easily.

The store itself was fairly straightforward with 2 actions (`deal` and `reset`) and 2 reducers with the same names. The `Reset` action simply returns the deck to 47 cards (with 5 having been randomly dealt to the user). `Deal` will try to deal a new hand and determine what state that new hand will confer.

The store's `deal` reducer:

```js
// filepath: src/store/gameSlice.ts
// ...existing code...
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
// ...existing code...
```

### Testing

Once the Redux store `renderWithProviders` is set up, it becomes really easy to make assertions (using `React Testing Library`) for what's directly on the screen in a given state:

```js
// filepath: src/tests/game.test.ts
// ...existing code...
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
// ...existing code...
```

Or even a simple test that actually clicks things on the screen (I usually define button clicks and actions as their own functions to keep tests compact):

```js
// filepath: src/tests/game.test.ts
// ...existing code...
test('reset game', async () => {
  renderWithProviders(<App />);

  expect(getCardsLeftCountByText('Cards Left')).toBe(47);
  await waitFor(() => {
    clickDealButton();
    expect(getCardsLeftCountByText('Cards Left')).toBe(42);
  });
});
// ...existing code...
```

### If more time allowed for the front end:

While I wanted to touch all parts of the stack with this project and not spend a ton of time perfecting the frontend, there are a few areas I wish I had more time to explore:

- Move some of the Tailwind inline classes into CSS files, maybe create app-specific variables for colors and shared styles. As mentioned above, the utility classes were done hastily to reach frontend completion.
- Animation changes:
  - Fix some of the animation jitter between each hand deal.
  - There's also a known issue when going from a low viewport width to a high width—it will trigger the animation again. This could likely be stopped with a handleResize-type function preventing repeat animations.
- I didn't get into any React performance issues with the React Dev tools given this was a small app—but you could look at things like `React.memo` or preventing unnecessary re-renders.
  - I added some simple `useCallback` on the click handler functions that get passed down into other components.
- More robust component library:
  - Creating a reusable `Button` component, for example.
  - Combining the game state components into one shared component (combining `GameWon`, `GameInProgress`, `GameLost`).
- Pull test helper functions out to a separate file.
- Exposing `graphqlService` as a hook instead of a service.

## Backend

### Backend overview

- `card` table - stores all 52 cards for a deck.
  - Multiple games could be played with just the 52 cards by resetting status or inserting 52 new entries tied to a new game ID. (I chose the former, but the latter is possible if you wanted to view a prior game's state.)
- `game` table - simply stores the current status.
- Mutations => `dealCards(count)`, `resetGame`.
- Queries => returns `cardsLeftInDeck`, `acesLeftInDeck`, `gameStatus`.
- The game likely could have been done all in memory—kind of how the standalone frontend works. Obviously, this wouldn't be durable or support multiple game/streak feature additions.

The backend work included setting up a DB schema that had a `card` table that stores all 52 cards for a deck, with each card having a suit and rank, and a particular status (`Deck`, `Hand`, or `Discarded`). There's also a simple `game` table that simply stores the game phase (`In Progress`, `Won`, `Lost`, `Loading`)—this allows multiple games to be stored. Along with the standard Django tables, this was all that was needed to represent this game on the backend.

For 3rd normal form, I considered introducing a lookup table for card statuses—this would put the status in one place, so it would be easy to rename a status in the future. However, I skipped this normalization step.

Most of the database update functionality was placed in a `GameQueryService`—a quick collection of static methods that use the Django ORM for querying and updates. A potentially more idiomatic approach would be to embed this logic directly in the models, but I preferred the clean separation and development speed of a dedicated service layer.

I did try to ensure that we weren't doing any database saves in loops, but rather running Django ORM's `bulk_update` after all data updates were made. Although we're dealing with a small amount of data in this app, it's nice to introduce simple improvements along the way that would scale well.

### GraphQL

The GraphiQL explorer facilitated the setup of the GraphQL API by streamlining query testing. The mutation and resolver files were set up in the `/graphql/types` folder, which are referenced in the `schema.py` file—the schema file defines the fields used in mutations or queries.

Writing tests for specific GraphQL queries is also pretty straightforward—we simply use a `setUp` method from the built-in `unittest` framework that gets called before each individual test to set up a game. Then it's simply testing the GraphQL query we want (as if coming from the frontend) and making assertions on the returned data.

```py
# filepath: src/tests/graphql/test_deal_cards.py
# ...existing code...
class DealCardsTestCase(TestCase):
    def setUp(self):
        # Create a test game and some cards for testing
        self.game = Game.objects.create(game_phase=GAME_PHASE.IN_PROGRESS.value)
        for suit in SUIT:
            for rank in RANK:
                Card.objects.create(
                    suit=suit.value,
                    rank=rank.value,
                    game=self.game,
                    status=CARD_STATUS.DECK.value,
                )

    def test_deal_cards_mutation(self):
        # GraphQL mutation query
        mutation_query = """
            mutation DealCardsMutation($count: Int!) {
                dealCards(count: $count) {
                    success
                    message
                    dealtCards {
                        id
                        suit
                        status
                        rank
                    }
                    cardsLeftInDeck
                    acesLeftInDeck
                }
            }
        """

        # Set the count for dealing cards
        count = 5

        # Create a GraphQL client
        client = Client()

        # Execute the mutation with the specified count
        response = client.post(
            "/graphql/",
            json.dumps(
                {
                    "query": mutation_query,
                    "variables": {"count": count},
                }
            ),
            content_type="application/json",
        )

        # Check if the response status code is 200
        assert response.status_code == 200
        self.assertEqual(len(data["data"]["dealCards"]["dealtCards"]), 5)
        # among other assertions
# ...existing code...
```

### If more time allowed for the back end:

- Define more GraphQL return types—this was something that looked like a common GraphQL pattern, just ran out of time here.
- Further normalize the DB—maybe a lookup table for the `card` `status` column.
  - Possibly set up a DB repository pattern.
- Consider adding a domain layer of pure/deterministic business logic functions.
- Rate limit some of the API requests—i.e., I believe resetting the DB too quickly can cause issues (if the user clicks reset one too many times).
- Install `ptw` to watch and rerun tests more easily.
- Following GraphQL best practices, it would be more idiomatic to use nested fields.

## Putting it all together

After ensuring the frontend and backend worked and were fully tested, I followed a few steps to integrate the full-stack application:

- Installing Apollo and pointing the client to the GraphQL address in `index.tsx`.

```js
// filepath: src/index.tsx
// ...existing code...
const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql/',
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={setupStore()}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
// ...existing code...
```

- Removing the frontend in-memory storage and instead referencing the GraphQL returned data.
- I set up a `codegen` file using the `@graphql-codegen/cli` that would take the GraphQL types defined on the backend and generate a set of TypeScript types that I could use on the frontend. This required me to go back and update a lot of the frontend enums and utility functions with those types.

## Conclusion

Working with familiar languages while learning new frameworks and libraries was an engaging experience. There are a few final next steps I was considering:

### Additional items if more time allowed for the project:

- Set loading state prior to GraphQL calls (and between deals/resets)—although it's pretty quick to make a mutation and get the result, it might make sense to have the loader show momentarily.
- E2E tests—it would have been nice to add some Playwright tests to get additional behavioral coverage.
- Data fetching—I didn't have time to get into it, but there is `Redux Toolkit Query` and I would be curious how that might overlap, enhance, or work in combination with GraphQL and the Apollo client.
- Synchronizing the backend database state with the Redux store felt somewhat redundant; relying solely on the backend might suffice for this type of app. However, I kept Redux to gain experience with `redux-toolkit`.
- Deploy the full-stack app to Vercel (it works fine locally for now)—right now just the frontend is deployed, though it functions exactly the same as the full-stack app.
