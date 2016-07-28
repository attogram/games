
var MainGame = {};

MainGame.BootState = function(game){
	
};

MainGame.BootState.prototype = {

	preload: function(){
		//load any assets needed for the LoaderState
		for( var i = 0; i < MainGame.resources.BootState.spritesheets.length; i++ ){
			var obj = MainGame.resources.BootState.spritesheets[i];
			this.game.load.spritesheet(obj.name, obj.path, obj.width, obj.height);
		}

	},

	create: function(){

		this.game.keys 			= {};
		this.game.keys.UP 		= game.input.keyboard.addKey(Phaser.Keyboard.W);
		this.game.keys.DOWN 	= game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.game.keys.LEFT 	= game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.game.keys.RIGHT 	= game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.game.keys.REMOVE     = game.input.keyboard.addKey(Phaser.Keyboard.R);

		this.game.keys.DEBUG     = game.input.keyboard.addKey(Phaser.Keyboard.P);

		this.game.state.start('Loader');
	}
};