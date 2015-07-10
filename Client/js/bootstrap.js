var game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'game');

var username = '';
var elo = 1000;
var matching = false;
var partidaId = 0;
var isMatch = false;

var x = game.width;
var y = game.height;

var boot = {
	preload: function () {
		//Load Images	
		game.load.image('msgBox', '/img/msgBox.png');
		game.load.image('button', '/img/button.png')
		game.load.image('rock', '/img/rock.png');
		game.load.image('scissors', '/img/scissors.png');
		game.load.image('paper', '/img/paper.png');
		game.load.image('lizard', '/img/lizard.png');
		game.load.image('spock', '/img/spock.png');

		//Init Socket.io
		socket = io(URL);

		getUsername(socket);
	
	},
	
	create: function () {
		game.stage.backgroundColor = '#00A0FF';
		game.state.start('Menu');
	}
};

var menu = {
	update: function() {
		socket.on('msg', function(msg) {
			MessageHandler(msg);
		});

		if (!isMatch) {
			matchmaking();
		}
	}
};

var play = {
	update: function() {
		interface();
	}
};

game.state.add('boot', boot);
game.state.add('Menu', menu);
game.state.add('Game', play);

game.state.start('boot');

function getUsername (socket) {
	//Tell to Server your username		
	var getuser = prompt('Introduce your username');
	if (getuser != null) {
		socket.emit('username', getuser);
		socket.on('usernameCorrect', function (bool) {
			if (bool) {
				username = getuser;
			} else {
				getUsername(socket);
			}
		});
	} else {
		getUsername(socket);
	}
}

function matchmaking () {
	var btn_match = ButtonHandler("Match", function () {
		socket.emit('matchMe', username, elo);		
	});
	socket.on('matchFound', function (name, partidaId) {
		if (!isMatch) {
			alert('Jugador trobat! ' + name);		
			game.state.start('Game');		
			isMatch = true;
		}		
	});
}

function interface() {
	var imatges = [];
	var select = 0;
	var isSelected = false;
	var resultat = null;


	var rock = game.add.sprite(15, 15, 'rock');
	rock.scale.set(0.75, 0.75);
	rock.inputEnabled = true;
	rock.input.useHandCursor = true;
	rock.events.onInputDown.add(function () {
		console.log(rock);
		socket.emit('resolveGame', partidaId, username, 0);
		select = 0;
		isSelected = true;
	}, this);

	var paper = game.add.sprite(game.width - 315, 15, 'paper');
	paper.scale.set(0.75, 0.75);
	paper.inputEnabled = true;
	paper.input.useHandCursor = true;
	paper.events.onInputDown.add(function () {
		console.log(paper);
		socket.emit('resolveGame', partidaId, username, 2);
		select = 1;
		isSelected = true;
	}, this);

	var scissors = game.add.sprite((game.width / 2) - (200 * 0.75), 15, 'scissors');
	scissors.scale.set(0.75, 0.75);
	scissors.inputEnabled = true;
	scissors.input.useHandCursor = true;
	scissors.events.onInputDown.add(function () {
		console.log(scissors);
		socket.emit('resolveGame', partidaId, username, 1);
		select = 2;
		isSelected = true;
	}, this);

	var lizard = game.add.sprite(245, game.height - 315, 'lizard');
	lizard.scale.set(0.75, 0.75);
	lizard.inputEnabled = true;
	lizard.input.useHandCursor = true;
	lizard.events.onInputDown.add(function () {
		console.log(lizard);
		socket.emit('resolveGame', partidaId, username, 3);
		select = 3;
		isSelected = true;
	}, this);

	var spock = game.add.sprite(game.width - 545, game.height - 315, 'spock');
	spock.scale.set(0.75, 0.75);
	spock.inputEnabled = true;
	spock.input.useHandCursor = true;
	spock.events.onInputDown.add(function () {
		console.log(spock);
		socket.emit('resolveGame', partidaId, username, 4);
		select = 4;
		isSelected = true;
	}, this);

	socket.on('result', function(result, winner) {
		alert(result);
		alert(winner);
		game.state.destroy('Game');
		game.state.start('Menu');
	});

	
}
