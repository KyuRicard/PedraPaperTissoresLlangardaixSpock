// ROCK
var ROCK = {
	name: 'Rock',
	id: 0,
	weak: [2, 4],
	msgWeak1: 'Paper covers Rock',
	msgWeak2: 'Spock vaporizes Rock' 
};

//SCISSORS
var SCISSORS = {
	name: 'Scissors',
	id: 1,
	weak: [0, 4],
	msgWeak1: 'Rock crushes Scissors',
	msgWeak2: 'Spock smashes Scissors'
};

//PAPER
var PAPER = {
	name: 'Paper',
	id: 2,
	weak: [1, 3],
	msgWeak1: 'Scissors cuts Paper',
	msgWeak2: 'Lizard eats Paper'
};

//LIZARD
var LIZARD = {
	name: 'Lizard',
	id: 3,
	weak: [0, 1],
	msgWeak1: 'Rock crushes Lizard',
	msgWeak2: 'Scissors decapitates Lizard'
};

//SPOCK
var SPOCK = {
	name: 'Spock',
	id: 4,
	weak: [2, 3],
	msgWeak1: 'Paper disproves Spock',
	msgWeak2: 'Lizard poisons Spock'
};

exports.getHands = function(id) {
	if(id === 0) {
		return ROCK;
	} else if (id === 1) {
		return SCISSORS;
	} else if (id === 2) {
		return PAPER;
	} else if (id === 3) {
		return LIZARD;
	} else if (id === 4) {
		return SPOCK;
	} else {
		return undefined;
	}
}