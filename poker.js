const _ = require("lodash");

const aceStraight = [2,3,4,5,14];
const cardValueLookup = {'2' : 2, '3' : 3, '4' : 4, '5' : 5, '6' : 6, '7' : 7, '8' : 8, '9' : 9, 'T' : 10, 'J' : 11, 'Q' : 12, 'K' : 13, 'A' : 14}

var testHands = [
    "5H 5C 6S 7S KD 2C 3S 8S 8D TD",
    "5D 8C 9S JS AC 2C 5C 7D 8S QH",
    "2D 9C AS AH AC 3D 6D 7D TD QD",
    "4D 6S 9H QH QC 3D 6D 7H QD QS",
    "2H 2D 4C 4D 4S 3C 3D 3S 9S 9D"
];

testHands.forEach(function(hand){
    whoWins(hand);
});

function whoWins(input) {
    var playerHands = buildHands(input);
    var p1 = evalHand(playerHands.p1Hand);
    var p2 = evalHand(playerHands.p2Hand);
    
    var winner = "";
    if(_.isEqual(p1.cardCounts, p2.cardCounts) && _.isEqual(p1.cards, p2.cards)) {
        winner = "Nobody";
    } else if(_.isEqual(p1.cardCounts, p2.cardCounts)) {
        winner = p1.cards > p2.cards ? "Player 1" : "Player 2";
    } else {
        winner = p1.cardCounts > p2.cardCounts ? "Player 1" : "Player 2";
    }
    console.log(winner);
}

function buildHands(rawInput) {
    var p1 = rawInput.substring(0, rawInput.length/2).trim();
    var p2 = rawInput.substring(rawInput.length/2, rawInput.length).trim();
    var p1Hand = p1.split(" ");
    var p2Hand = p2.split(" ");
    return {
        p1Hand: p1Hand,
        p2Hand: p2Hand
    }
}

//argument hand example: ['2C', 'TH', 'TC', '2S', 'TS'] ---> full house 10s full of 2s
function evalHand(hand) {
    //ex. cardCountMap {'2': 2, 'T': 3}
    var cardCountMap = _.countBy(hand, function(card){
        return card[0];
    });
    //ex. cardsSortedByCount ['T', '2']
    var cardsSortedByCount = Object.keys(cardCountMap).sort(function(a, b) {
        return cardCountMap[a] < cardCountMap[b];
    });
    //ex. cardCounts [3, 2]
    var cardCounts = cardsSortedByCount.map(function(card){
        return cardsWithCount[card];
    });
    //ex. cardCounts [10, 2]
    var cardFaces = cardsSortedByCount.map(function(key){
        return cardValueLookup[key];
    });
    return {
        cardCounts: handleStraightAndFlush(cardFaces, hand) || cardCounts,
        cards: cardFaces
    }
}

function handleStraightAndFlush(cardFaces, hand){
    var straight = isStraight(cardFaces);
    var flush = isFlush(hand);
    if(straight && flush) {
        //Best hand possible. [5] beats [4,1] aka four of a kind
        return [5];
    } else if(straight) {
        /**1.5 is arbitrary, just needs to be greater than 1 (to beat [3,1,1] aka three of a kind) 
            and less than flush value (see below)
         **/
        return [3, 1.5];
    } else if (flush) {
        /**1.9 is arbitrary, just needs to be greater than 1 (to beat [3,1,1] aka three of a kind) 
            and less than 2 (loses to [3,2] aka full house)
         **/
        return [3, 1.9];
    }
}

function isFlush(hand) {
    var suitsWithCount = _.countBy(hand, function(card){
        return card[1];
    });
    return Object.keys(suitsWithCount).length === 1;
}

function isStraight(cardFaces) {
    //sort ascending
    cardFaces = cardFaces.sort(function(cardA, cardB){
        return cardA > cardB;
    });
    var isStraight = cardFaces.length === 5 && (cardFaces[4] - cardFaces[0] === 4 || _.isEqual(cardFaces, aceStraight));
    return isStraight;
}