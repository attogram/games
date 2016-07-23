
MainGame.GameState = function(game){
	
};

MainGame.GameState.prototype = {
	
	create: function(){

		this.game.map = this.game.add.tilemap('test3');
		this.game.map.addTilesetImage('tileset', 'tileset');
		this.game.map.setCollision([0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 17, 18, 25, 26], 1);

		this.game.floor = this.game.map.createLayer(0);
		this.game.floor.resizeWorld();

		this.game.walls = this.game.map.createLayer(1);
		//this.game.walls.debug = true;
		this.game.walls.resizeWorld();
		CollisionManager.addObjectToGroup(this.game.walls, 'layers');

		this.game.player = new Player(this.game, {x:800, y:300});

		var tooth = new Tooth(this.game, { x: 800, y: 400 });
		this.tooth = tooth;
		this.game.camera.follow(this.game.player);

		GUIManager.setup();
		InputManager.setup();
		WaveManager.setup();

		//this.game.input.mouse.requestPointerLock();

		this.game.turret_small_sfx = this.game.add.audio('turret_small_sfx');
		this.game.turret_small_sfx.volume = .05;
		this.game.turret_big_sfx = this.game.add.audio('turret_big_sfx');
		this.game.player_shoot_sfx = this.game.add.audio('player_shoot_sfx');
		this.game.player_shoot_sfx.volume = .2;
		this.game.baddie_die_sfx = this.game.add.audio('baddie_die_sfx');
		this.game.baddie_die_sfx.volume = .1;
		this.game.player_hurt_sfx = this.game.add.audio('player_hurt_sfx');
		this.game.player_hurt_sfx.volume = .4;

		InventoryManager.addToInventory('gun', 1);
		InventoryManager.addToInventory('hammer', 0);
		InventoryManager.addToInventory('turret_small', 0);
		InventoryManager.addToInventory('turret_big', 0);
	},

	update: function(){

		InputManager.update();
		CollisionManager.update();
		GUIManager.update();
		WaveManager.update();
	},

	render: function(){
		
		/*this.game.debug.renderSpriteCorners(this.tooth, false, false);
		this.game.debug.renderSpriteCorners(this.game.player, false, false);*/
		//this.game.debug.renderSpriteBody(this.game.player);
		//this.game.debug.renderSpriteBody(this.tooth);
	}
};