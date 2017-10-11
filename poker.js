const _ = require("lodash");

const aceStraight = [2,3,4,5,14];
const cardValueLookup = {'2' : 2, '3' : 3, '4' : 4, '5' : 5, '6' : 6, '7' : 7, '8' : 8, '9' : 9, 'T' : 10, 'J' : 11, 'Q' : 12, 'K' : 13, 'A' : 14}

const handTypes = [
    {
        id: 'pair',
        cardCount: [2, 1, 1, 1],
        rank: 1
    },
    {
        id: 'two pair',
        cardCount: [2, 2, 1],
        rank: 2
    },
    {
        id: 'three of a kind',
        cardCount: [3, 1, 1],
        rank: 3
    },
    {
        id: 'straight',
        cardCount: [null],
        rank: 4
    },
    {
        id: 'flush',
        cardCount: [null],
        rank: 5
    },
    {
        id: 'full house',
        cardCount: [3, 2],
        rank: 6
    },
    {
        id: 'four of a kind',
        cardCount: [3, 2],
        rank: 7
    },
    {
        id: 'straight flush',
        cardCount: [null],
        rank: 8
    }
];

var testHands = [
    "AH 2H 3H 4H 5H TC JC QC KC AC",
    "5D 8C 9S JS AC 2C 5C 7D 8S QH",
    "2D 9C AS AH AC 3D 6D 7D TD QD",
    "4D 6S 9H QH QC 3D 6D 7H QD QS",
    "2H 2D 4C 4D 4S 3C 3D 3S 9S 9D"
];

testHands.forEach(function(hand){
    whoWins(hand);
});

function Card(card){
    this.face = cardValueLookup[card[0]];
    this.suit = card[1];
    return this;
}

//hand is array of Card objects
function Hand(hand) {
    this.hand = hand;
    this.getHandRank = function(){
        var hand = this.hand;
        //comparing only face's of the cards
        var faces = _.map(hand, 'face');
        //group cards by count and return array of card counts
        var cardCountObj = _.countBy(faces);
        var cardCount = _.keys(cardCountObj).map(function(key){
            return cardCountObj[key];
        });
        //now that we have an array representing our card counts, find a matching array in possible handTypes
        var foundHandType = handTypes.find(function(handType){
            return handType.cardCount.every(count => cardCount.indexOf(count) > -1) 
            && handType.cardCount.length === cardCount.length;
        });
        if(foundHandType) {
            return foundHandType.rank;
        } else {
            return handleStraightAndFlush(hand) || 0;
        }
    }
    //Used to settle ties. Sorts card faces by count and in descending order when counts are equal
    this.getKicker = function(){
        var hand = this.hand;
        var faces = _.map(hand, 'face');
        var cardCountMap = _.countBy(faces);
        var cardsSortedByCount = _.keys(cardCountMap).sort(function(a, b) {
            return cardCountMap[a] > cardCountMap[b];
        });
        return cardsSortedByCount.reverse().map(function(cardFace){
            return parseInt(cardFace);
        });
    }
    return this;
}

function whoWins(input) {
    var winner = "";
    var playerHands = buildHands(input);
    var hand1 = playerHands.p1Hand;
    var hand2 = playerHands.p2Hand;
    var hand1Rank = hand1.getHandRank();
    var hand2Rank = hand2.getHandRank();
    if(hand1Rank === hand2Rank) {
        winner =  hand1.getKicker() > hand2.getKicker() ? "Player 1" : "Player 2";
    } else {
        winner = hand1Rank > hand2Rank ? "Player 1" : "Player 2";
    }
    console.log(winner);
}

function buildHands(rawInput) {
    var p1 = rawInput.substring(0, rawInput.length/2).trim();
    var p2 = rawInput.substring(rawInput.length/2, rawInput.length).trim();
    var p1Hand = p1.split(" ").map(function(card){
        return new Card(card);
    });
    var p2Hand = p2.split(" ").map(function(card){
        return new Card(card);
    });
    return {
        p1Hand: new Hand(p1Hand),
        p2Hand: new Hand(p2Hand)
    }
}

function handleStraightAndFlush(hand){
    var straight = isStraight(hand);
    var flush = isFlush(hand);
    if(straight && flush) {
        return 8;
    } else if(straight) {
        return 4;
    } else if(flush) {
        return 5;
    }
}

function isFlush(hand) {
    var suitsWithCount = _.countBy(hand, function(card){
        return card.suit;
    });
    return Object.keys(suitsWithCount).length === 1;
}

function isStraight(hand) {
    var cardFaces = _.map(hand, 'face');
    var cardFacesSorted = cardFaces.sort(function(cardA, cardB){
        return cardA > cardB;
    });
    return (cardFacesSorted[4] - cardFacesSorted[0] === 4 || _.isEqual(cardFacesSorted, aceStraight));
}
