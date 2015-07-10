express = require('express')
app = express()
http = require('http')
socketIO = require('socket.io')(http.createServer(app));
hands = require('../Common/Hands.js'); 
server = http.createServer(app);

app.use('/', express.static('../Client/'));
app.use('/Common', express.static('../Common'))
app.use('/img', express.static('../Client/img'))
app.listen(80);

server.listen(8080, function () {
	host = server.address().address;
	port = server.address().port;
	console.log('http://%s:%s', host, port);
})
var players = [];
var playerNums = 0;
var partides = [];
var playerMatch = [];

var partidaEstruct = {
	id: 0, 
	jugador1: {id: 0, name: 'player1', hand: 0, elo: 1000, socket: undefined, played: false},
	jugador2: {id: 1, name: 'player2', hand: 0, elo: 1000, socket: undefined, played: false}
}

io = socketIO.listen(server);

io.on('connection', function (socket) {		
	var pos;
	playerNums += 1;
	socket.on('username', function (username) {
		if (!playerExists(username)) {
			players.push({name: username, id: socket.id, elo: 1000, socket: socket, hand: 0, played: false});				
			pos = players.length - 1;					
			socket.emit('usernameCorrect', true)
			msg('Hello ' + username + " welcome to \nthe game!", socket)
		}
		
	});

	socket.on('resolveGame', function(partidaId, name, hand) {
		resolveGame(partidaId, name, hand);		
	});

	socket.on('matchMe', function (usename, elo) {
		var me = players[pos];
		playerMatch.push(me);
		var mypos = playerMatch.length - 1;
		match(me, mypos);		
	});

	socket.on('disconnect', function (socket) {
		console.log('disconnected ' + players[pos].id);
		for (var i = 0; i < playerMatch.length; i++) {
			if (playerMatch[i].id == players[pos].id) {
				delete playerMatch[i];
			}
		}
		delete players[pos];
		playerNums -= 1;
		if (playerNums === 0) {
			players = [];
		}
	});
});

process.on('SIGINT', function (argument) {
	console.log('Tancant...');	
	process.exit(0);
})

process.on('uncaughtException', function (err) {
	console.log(err);		
});

function resolveGame(partidaId, name, hand) {	
	var partida = partides[partidaId];
	console.log(name + ' ' + hand);
	var player1 = partida.jugador1;
	var player2 = partida.jugador2;

	console.log(partida);

	if (player1.name == name) {
		partides[partidaId].jugador1.hand = hand;
		partides[partidaId].jugador1.played = true;
		console.log(partides[partidaId].jugador1.hand);
	} else if (player2.name == name) {
		partides[partidaId].jugador2.hand = hand;
		partides[partidaId].jugador2.played = true;
		console.log(partides[partidaId].jugador2.hand);
	}

	if (partides[partidaId].jugador1.played && partides[partidaId].jugador2.played) {
		var winner = null;
		var result = '';
		var player1Hand = hands.getHands(player1.hand);
		var player2Hand = hands.getHands(player2.hand);

		if (player1Hand.id === player2Hand.id) {
			result = 'Draft';
			player1.socket.emit('result', 'Draft');
			player2.socket.emit('result', 'Draft');
			winner = 'Draft';
		} else if (player1Hand.weak[0] == player2Hand.id) {
			result = player1Hand.msgWeak1;
			winner = player2.name;
		} else if (player1Hand.weak[1] == player2Hand.id) {
			result = player1Hand.msgWeak2;
			winner = player2.name;
		} else if (player2Hand.weak[0] == player1Hand.id) {
			result = player2Hand.msgWeak1;
			winner = player1.name;
		} else if (player2Hand.weak[1] == player1Hand.id) {
			result = player2Hand.msgWeak2;
			winner = player1.name;
		}


		partides[partidaId].jugador1.socket.emit('result', result, winner);
		partides[partidaId].jugador2.socket.emit('result', result, winner);
		console.log(result + ' -> ' + hands.getHands(player1.hand).name + " VS " + hands.getHands(player2.hand).name);

		delete partides[partidaId];
	}
}

function msg(message, handler) {
	handler.emit('msg', message)
}

function playerExists (username) {
	for (var i = 0; i < players.length; i++) {
		if (players[i] === username) {
			return true;
		}
	};
	return false;
}

function match (me, mypos) {
	for (var i = 0; i < playerMatch.length; i++) {		
		var pl = playerMatch[i];
		if (pl == undefined) {
			continue;
		}
		
		if (pl.id == me.id) {
			continue;
		}

		console.log(playerMatch[i].id + ' ' + playerMatch[i].elo)
		if (pl.elo - me.elo < 150 || me.elo - pl.elo < 150) {
			console.log(pl.id + ' ' + me.id)
			
			playerMatch.splice(i, 1);
			playerMatch.splice(mypos, 1);
			var partidaId = partides.length;
			partides[partidaId] = {id: partidaId, jugador1: me, jugador2: pl};

			pl.socket.emit('matchFound', me.name, partidaId);
			me.socket.emit('matchFound', pl.name, partidaId);
			return;
		}
	};
}
