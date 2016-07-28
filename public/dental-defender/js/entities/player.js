
function Player(game, spawn){

	this.game = game;
	Phaser.Sprite.call(this, this.game, spawn.x, spawn.y, 'player');

	this.speed = 150;
	this.anchor.setTo(0.5, 0.5);
	this.body.gravity.y = 0;
	this.body.collideWorldBounds = true;
	this.body.setSize(25, 25, 0, 2);
	this.dir = "down";

	this.name = "player";

	this.damaged = false;
	this.damagedTimer = Date.now();
	this.attackTimer = Date.now();
	this.attackCoolDown = 150;

	this.health = 200;
	this.maxHealth = 200;

	this.attackDamage = 10;

	this.animations.add('right', [0,1,2,3], 7, true);
	this.animations.add('right-idle', [0],  7, true);
	this.animations.add('left', [7,6,5,4],  7, true);
	this.animations.add('left-idle', [4],   7, true);

	this.animations.add('right-damaged', [8,9,10,11],  7, true);
	this.animations.add('right-idle-damaged', [8],     7, true);
	this.animations.add('left-damaged', [15,14,13,12], 7, true);
	this.animations.add('left-idle-damaged', [12],     7, true);

	this.animations.play('right-idle');

	this.game.add.existing(this);
	CollisionManager.addObjectToGroup(this, 'players');
}

Player.prototype = Object.create( Phaser.Sprite.prototype );
Player.prototype.constructor = Player;

Player.prototype.update = function(){

	if(GUIManager.menuScreen.visible == false){
		if(this.damaged
			&& Date.now() >= this.damagedTimer){

			this.damaged = false;
		}

		if(this.game.keys.UP.isDown){
			this.body.velocity.y = -this.speed;
		}
		else if(this.game.keys.DOWN.isDown){
			this.body.velocity.y = this.speed;
		}
		else{
			this.body.velocity.y = 0;
		}

		if(this.game.keys.LEFT.isDown){
			this.body.velocity.x = -this.speed;
		}
		else if(this.game.keys.RIGHT.isDown){
			this.body.velocity.x = this.speed;
		}
		else{
			this.body.velocity.x = 0;
		}

		var dist  = this.game.input.mousePointer.worldX - this.x;

		if(dist >= 0){
			this.dir = "right";
		}
		else{
			this.dir = "left"
		}

		if(this.body.velocity.x != 0 || this.body.velocity.y != 0){
			if(this.damaged){
				this.animations.play(this.dir + '-damaged');
			}
			else{
				this.animations.play(this.dir);
			}
		}
		else{
			if(this.damaged){
				this.animations.play(this.dir + '-idle-damaged');
			}
			else{
				this.animations.play(this.dir + '-idle')
			}
		}
	}
	else{
		this.body.velocity.x = this.body.velocity.y = 0;
	}

};

Player.prototype.attack = function(target){

	if(Date.now() < this.attackTimer){
		return;
	}

	this.game.player_shoot_sfx.play();
	WaveManager.shotsFired++;

	var start_x;

	if(this.dir == "left"){
		start_x = this.x - 20;
	}
	else if(this.dir == "right"){
		start_x = this.x + 20;
	}

	var x = target.x - start_x;
	var y = target.y - this.y;

	var mag = Math.sqrt((x * x) + (y * y));

	var nx = x / mag;
	var ny = y / mag;

	var b = new Bullet(this.game, {x:start_x, y: this.y + 2}, 'player', {x: nx, y: ny}, this);
	this.attackTimer = Date.now() + this.attackCoolDown;
}

Player.prototype._damage = function(amount){

	this.game.player_hurt_sfx.play();

	this.damage(amount);
	this.damaged = true;
	this.damagedTimer = Date.now() + 500;
}

Player.prototype.die = function(){

	GUIManager.destroy();
	WaveManager.destroy();
	this.game.state.states['GameOver'].win = false;
	this.game.state.start('GameOver');
}