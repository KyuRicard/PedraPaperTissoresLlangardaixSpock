function MessageHandler(message) {
	var x = game.width;
	var y = game.height;
	var msgBox = game.add.sprite((x / 2) - 150, (y / 2) - 100, 'msgBox');
	var style = {font: "20px Arial"};
	var msg = game.add.text((x / 2) - 130, (y / 2) - 80, message, style);
	
	//msgBox.scale.To(0.1, 0.1)
	msgBox.inputEnabled = true;
	msgBox.input.useHandCursor = true;
	
	msgBox.events.onInputDown.add(function killMsgBox (){
		msg.kill()
		msgBox.kill()
	}, this);

}

function ButtonHandler (text, clickListener) {
	var btn = game.add.sprite((game.width / 2) - 50, game.height / 1.15, 'button')
	var style = {font: "12px Arial"}
	var txt = game.add.text((game.width / 2) - 40, (game.height / 1.15) + 10, text, style)
	
	btn.inputEnabled = true;
	btn.input.useHandCursor = true;

	btn.events.onInputDown.add(function () {
		clickListener()
		txt.kill()
		btn.kill()
	}, this)
}