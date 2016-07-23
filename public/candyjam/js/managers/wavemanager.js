
function WaveManager(game){
	
	this.game = game;
	this.currentWave = 0;

	this.waveStart = 0;
	this.enemiesKilled = 0;
	this.shotsFired = 0;
	this.enemyHits = 0;

	this.states = {
		  PAUSED: 1
		, COUNTDOWN: 2
		, SPAWNING: 3
	};

	this._state = this.states.COUNTDOWN;
	this.countDown = 3 * 100;

	this.wavesBackup = MainGame.waves;
	this.waves = MainGame.waves; //in waves.js
	this.waveSaves= [];
	this.pauseTime = 0
}

WaveManager.prototype.setup = function(){
	this.banner = this.game.add.sprite(512, 64, 'wave_1');
	this.banner.anchor.setTo(0.5, 0.5);
	this.banner.fixedToCamera = true;
}

WaveManager.prototype.update = function(){

	if(this._state == this.states.PAUSED){

	}
	else if(this._state == this.states.COUNTDOWN){
		this.countDown--;
		if(this.countDown <= 0){
			if(this.banner){
				this.banner.destroy();
			}
			this.savePlayerState();
			this._state = this.states.SPAWNING;
			this.countDown = 300; //reset countdown for next wave
			console.log("BEGINNING WAVE "+this.currentWave);
			this.waveStart = Date.now();
		}
	}
	else if(this._state == this.states.SPAWNING){
		
		var wave = this.waves[this.currentWave];

		if(CollisionManager.groups.baddies.length < wave.moment){

			//lets spawn something

			var baddies = [];

			//get eligible baddies
			if(wave.corn > 0)
				baddies.push('corn');

			if(wave.cane > 0)
				baddies.push('cane');

			if(wave.bear > 0)
				baddies.push('bear');

			if( baddies.length == 0 && CollisionManager.groups.baddies.length == 0){

				if(this.pauseTime == 0){
					this.pauseTime = Date.now() + 1000;
				}

				if(Date.now() > this.pauseTime){

					console.log("WAVE " + this.currentWave + " COMPLETED.");
					this.currentWave++;

					if(this.currentWave == this.waves.length){
						//WIN
						GUIManager.destroy();
						WaveManager.destroy();
						this.game.state.states['GameOver'].win = true;
						this.game.state.start('GameOver');
					}
					else{
						this._state = this.states.PAUSED;
						this.waveLength = Date.now() - this.waveStart;
						this.accuracy = Math.floor((this.enemyHits / this.shotsFired) * 100);
						GUIManager.handleWaveEnd();

						this.pauseTime = 0;
					}
				}
				
			}
			else{
				var baddie = baddies[this.getRandomInt(0, baddies.length - 1)];

				switch(baddie){
					case 'corn':
						var b = new Corn(this.game, this.getSpawn());
						this.waves[this.currentWave].corn--;
						break;
					case 'cane':
						var b = new Cane(this.game, this.getSpawn());
						this.waves[this.currentWave].cane--;
						break;
					case 'bear':
						var b = new Bear(this.game, this.getSpawn());
						this.waves[this.currentWave].bear--;
						break;
				}
			}
		}
	}
}

WaveManager.prototype.getSpawn = function(){
	
	//50% chance
	var topbottom = Phaser.Math.chanceRoll(50);

	if(topbottom){

		var top = Phaser.Math.chanceRoll(50);
		var x = this.getRandomInt(0, 1600);

		if(top){
			return { x: x, y: 0};
		}
		else{
			return { x: x, y: 800};
		}

	}
	else{

		//left or right
		var left = Phaser.Math.chanceRoll(50);
		var y = this.getRandomInt(0, 800)

		if(left){
			return { x: 0, y: y };
		}
		else{
			return { x: 1600, y: y };
		}
	}
}

WaveManager.prototype.getRandomInt = function(min, max){

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

WaveManager.prototype.startNewWave = function(){

	this.waveStart = Date.now();
	this.enemiesKilled = 0;
	this.enemyHits = 0;
	this.shotsFired = 0;

	if(this.currentWave == this.waves.length){
		//WIN
		GUIManager.destroy();
		WaveManager.destroy();
		this.game.state.states['GameOver'].win = true;
		this.game.state.start('GameOver');
	}
	else{
		
		this.banner = this.game.add.sprite(512, 64, 'wave_1');
		this.banner.anchor.setTo(0.5, 0.5);
		this.banner.fixedToCamera = true;

		this.countdown = 3 * 100;
		this._state = this.states.COUNTDOWN;
	}
}

WaveManager.prototype.restartCurrentWave = function(){

	//FIX THIS

	this.countDown = 300;
	this._state = this.states.COUNTDOWN;

	//kill all baddies
	for( var i = 0; i < CollisionManager.groups.baddies.length; i++){
		var baddie = CollisionManager.groups.baddies[i];
		baddie.die();
	}

	this.waves[this.currentWave] = this.wavesBackup[this.currentWave];
	this.restorePlayerState(this.currentWave);

	// TODO -- change this to a restart banner
	this.banner = this.game.add.sprite(512, 64, 'wave_1');
	this.banner.anchor.setTo(0.5, 0.5);
	this.banner.fixedToCamera = true;

	this.game.player.x = this.game.player.y = 300;

	console.log("RESTARTING WAVE " + this.currentWave);
}

WaveManager.prototype.savePlayerState = function(){
	this.waveSaves[this.currentWave] = {
		  playerHealth: this.game.player.health
		, points: InventoryManager.points
		, inventory: InventoryManager.inventory
	};
	console.log("Saving state: ", this.waveSaves);
}

WaveManager.prototype.restorePlayerState = function(wave){
	var save = this.waveSaves[wave];

	console.log("Loading state: ", save);

	this.game.player.health = save.playerHealth;
	InventoryManager.points = save.points;
	InventoryManager.inventory = save.inventory;
}

WaveManager.prototype.destroy = function(){
	this._state = this.states.PAUSED;
}