
MainGame.resources = {};

MainGame.resources.BootState = {
	spritesheets: [
		{name: 'spinner', path: '../web/dental-defender/assets/spritesheets/spinner.png', width: 15, height: 15 }
	]
};

MainGame.resources.LoaderState = {

	  images: [
	  	  {name: 'tileset', path: '../web/dental-defender/assets/images/tileset.png'}
	  	/*, {name: 'tileset2', path: '../web/dental-defender/assets/images/tileset2.png'}*/
	  	, {name: 'bullet', path: '../web/dental-defender/assets/images/bullet.png'}
	  	, {name: 'bullet_pink', path: '../web/dental-defender/assets/images/bullet_pink.png'}
	  	, {name: 'tooth', path: '../web/dental-defender/assets/images/tooth.png'}

	  	, {name: 'toolbar_slot_background', path: '../web/dental-defender/assets/images/toolbar_slot_background.png'}
	  	, {name: 'toolbar_arrow', path: '../web/dental-defender/assets/images/toolbar_arrow.png'}
	  	, {name: 'toolbar_slot_blank', path: '../web/dental-defender/assets/images/toolbar_slot_blank.png'}

	  	, {name: 'gun_icon', path: '../web/dental-defender/assets/images/gun.png'}
	  	, {name: 'gun_cursor', path: '../web/dental-defender/assets/images/gun_cursor.png'}

	  	, {name: 'hammer', path: '../web/dental-defender/assets/images/hammer.png'}
	  	, {name: 'hammer_x', path: '../web/dental-defender/assets/images/hammer_x.png'}
	  	, {name: 'hammer_icon', path: '../web/dental-defender/assets/images/hammer_icon.png'}

	  	, {name: 'turret_small_x', path: '../web/dental-defender/assets/images/turret_small_x.png'}
	  	, {name: 'turret_small_icon', path: '../web/dental-defender/assets/images/turret_small_icon.png'}
	  	
	  	, {name: 'turret_big_x', path: '../web/dental-defender/assets/images/turret_big_x.png'}
	  	, {name: 'turret_big_icon', path: '../web/dental-defender/assets/images/turret_big_icon.png'}

	  	, {name: 'wave_1', path: '../web/dental-defender/assets/images/wave_1.png'}

	  	, {name: 'overlay', path: '../web/dental-defender/assets/images/overlay.png'}

	  	, {name: 'mainmenu_bg', path: '../web/dental-defender/assets/images/mainmenu_bg.png'}
	  	, {name: 'youlose', path: '../web/dental-defender/assets/images/youlose.png'}
	  	, {name: 'youwin', path: '../web/dental-defender/assets/images/youwin.png'}
	]
	, spritesheets: [
		  {name: 'player', path: '../web/dental-defender/assets/spritesheets/player.png', width: 36, height: 36}
		, {name: 'player_health', path: '../web/dental-defender/assets/spritesheets/player_health.png', width: 48, height: 6}

		, {name: 'corn', path: '../web/dental-defender/assets/spritesheets/corn.png', width: 40, height: 40}
		, {name: 'corn_die', path: '../web/dental-defender/assets/spritesheets/corn_die.png', width: 4, height: 4}

		, {name: 'mint', path: '../web/dental-defender/assets/spritesheets/mint.png', width: 40, height: 40}
		, {name: 'mint_die', path: '../web/dental-defender/assets/spritesheets/mint_die.png', width: 4, height: 4}
		, {name: 'mint_explode', path: '../web/dental-defender/assets/spritesheets/mint_explode.png', width: 32, height: 32}

		, {name: 'gumball', path: '../web/dental-defender/assets/spritesheets/gumball.png', width: 44, height: 44}
		, {name: 'gumball_die', path: '../web/dental-defender/assets/spritesheets/gumball_die.png', width: 4, height: 4}

		, {name: 'turret_small', path: '../web/dental-defender/assets/spritesheets/turret_small.png', width: 32, height: 32}
		, {name: 'turret_big', path: '../web/dental-defender/assets/spritesheets/turret_big.png', width: 64, height: 64}
		, {name: 'turret_progress', path: '../web/dental-defender/assets/spritesheets/turret_progress.png', width: 9, height: 9}
		, {name: 'turret_health_bar', path: '../web/dental-defender/assets/spritesheets/turret_health_bar.png', width: 32, height: 4}

		, {name: 'buy_btn', path: '../web/dental-defender/assets/spritesheets/buy_btn.png', width: 75, height: 30}
		, {name: 'ready_btn', path: '../web/dental-defender/assets/spritesheets/ready_btn.png', width: 320, height: 60}

		, {name: 'start_btn', path: '../web/dental-defender/assets/spritesheets/start_btn.png', width: 288, height: 71}
		, {name: 'instructions_btn', path: '../web/dental-defender/assets/spritesheets/instructions_btn.png', width: 288, height: 71}
	]
	, tilemaps: [
		  {name: 'test3', path: '../web/dental-defender/assets/tilemaps/test3.json'}
	]
	, audio: [
		  {name: 'turret_small_sfx', path: 'assets/audio/turret_small.wav'}
		, {name: 'turret_big_sfx', path: 'assets/audio/turret_big.wav'}
		, {name: 'player_shoot_sfx', path: 'assets/audio/shoot.wav'}
		, {name: 'baddie_die_sfx', path: 'assets/audio/baddie_die.wav'}
		, {name: 'player_hurt_sfx', path: 'assets/audio/player_hurt.wav'}
		/*, {name: 'menu_music', path: 'assets/audio/spiff_tune_to_the_moon.mp3'}*/
		, {name: 'game_music', path: 'assets/audio/spiff_tune_hazard.mp3'}
	]
};



