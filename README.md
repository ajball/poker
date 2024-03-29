# poker

Submission for `Project Euler #54: Poker hands` on Hacker Rank

I wanted to avoid a massive switch-style statement where I check if the hand is a pair, two-pair, 3-of-a-kind, full house, etc etc.

So, `evalHand` takes a hand array as an argument (e.g. `['TH', 'TC', '6S', '7S', 'KD']`) and returns an object containing the frequency of each card in the hand (e.g. `{cardCount: [2, 1, 1, 1], cards: [10, 6, 7, 13]}`)

From this output we can quickly determine the winner by comparing the `cardCount` (or the `cards`/kicker array if the players have identical hands) for each player

Straights and flushes are special so I handled them a little differently than your normal 2-pair, three-of-a-kind, and so on
