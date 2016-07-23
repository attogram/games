
MainGame.LoaderState = function(game){
	
	this._continue = Date.now();// + 1000;
};

MainGame.LoaderState.prototype = {
	
	preload: function(){

		var spinner = this.add.sprite(512, 384, 'spinner');
		spinner.anchor.setTo(0.5, 0.5);
		spinner.animations.add('spin', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
		spinner.animations.play('spin');


		var resources = MainGame.resources;

		//load all game assets!

		//IMAGES
		for( var i = 0; i < resources.LoaderState.images.length; i++ ){
			var obj = resources.LoaderState.images[i];
			this.game.load.image(obj.name, obj.path);
		}

		//SPRITESHEETS
		for( var i = 0; i < resources.LoaderState.spritesheets.length; i++ ){
			var obj = resources.LoaderState.spritesheets[i];
			this.game.load.spritesheet(obj.name, obj.path, obj.width, obj.height);
		}

		//TILEMAPS
		for( var i = 0; i < resources.LoaderState.tilemaps.length; i++ ){
			var obj = resources.LoaderState.tilemaps[i];
			this.game.load.tilemap(obj.name, obj.path, null, Phaser.Tilemap.TILED_JSON);
		}

		//SOUNDS
		for( var i = 0; i < resources.LoaderState.audio.length; i++ ){
			var obj = resources.LoaderState.audio[i];
			this.game.load.audio(obj.name, obj.path);
		}
	},

	update: function(){

		if(Date.now() > this._continue){
			this.game.state.start('MainMenu');
			//this.game.state.start('Game');
		}
	}
};