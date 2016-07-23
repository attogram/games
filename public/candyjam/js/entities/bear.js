
function Bear(game, spawn){
	
	this.game = game;
	Phaser.Sprite.call(this, this.game, spawn.x, spawn.y, 'mint');

	this.anchor.setTo(0.5, 0.5);

	this.animations.add('left', [0,1,2,3], 7, true);
	this.animations.add('right', [4,5,6,7], 7, true);
	this.animations.play('left');
	this.health = 20;
	this.maxHealth = 20;
	this.speed = 200;

	this.name = "mint";

	this.healthBar = this.game.add.sprite(this.x, this.y + 20, 'turret_health_bar');
	this.healthBar.anchor.setTo(0.5, 0.5);

	this.STATES = {
		  TRACKING: 0
		, DAMAGED: 1
	};

	this._state = this.STATES.TRACKING;

	this.damageTimer = 0;

	CollisionManager.addObjectToGroup(this, 'baddies');
	this.game.add.existing(this);
}

Bear.prototype = Object.create(Phaser.Sprite.prototype);
Bear.prototype.constructor = Bear;

Bear.prototype.update = function(){

	this.updateHealthBar();

	if(this._state == this.STATES.TRACKING){
		if(this.target){
			if(this.withinFollowingRange(this.target) || this.target.name == "tooth"){ 
					this.moveTowards(this.target);
			}
			else{
				this.target = CollisionManager.groups.teeth[0];
			}
		}
		else{
			this.target = CollisionManager.groups.teeth[0];
		}
	}
}

Bear.prototype.withinFollowingRange = function(target){
	var dist = Math.abs(Math.sqrt((target.x - this.x)*(target.x - this.x)+(target.y - this.y)*(target.x - this.y)));

	if(dist < 300){
		return true;
	}

	return false;
}

Bear.prototype.moveTowards = function(target){

	var x = target.x - this.x;
	var y = target.y - this.y;

	var mag = Math.sqrt((x * x) + (y * y));

	var nx = x / mag;
	var ny = y / mag;

	this.body.velocity.x = nx * this.speed;
	this.body.velocity.y = ny * this.speed;

	if(this.body.velocity.x >= 0){
		this.animations.play('right');
	}
	else{
		this.animations.play('left');
	}
}


Bear.prototype._damage = function(amount, attacker){
	this.damage(amount);

	if(this.health <= 0
		&& attacker.name == "player"){

		this.die(true);
	}
}

Bear.prototype.updateHealthBar = function(){

	this.healthBar.x = this.x;
	this.healthBar.y = this.y + 24;

	var p = (this.health / this.maxHealth);
	p = parseFloat(p.toFixed(1));
	this.healthBar.frame = 10 - (p * 10);
}

Bear.prototype.die = function(points){

	if(this.game){
		this.game.baddie_die_sfx.play();
	}

	var points = points || false;

	var e = game.add.emitter(this.x, this.y, 16);
	e.makeParticles('mint_die', [0,1,2,3]);
	//e.gravity = 10;
	e.maxRotation = 0;
	e.minRotation = 0;
	e.start(true, 400, null, 16);

	//var t = new Explosion(this.game, {x:this.x, y:this.y}, 'mint_explode');

	CollisionManager.removeObjectFromGroup(this, "baddies");
	if(this.healthBar){
		this.healthBar.destroy();
	}
	
	if(points){
		InventoryManager.points += MainGame.points.kill_bear;
	}
	this.destroy();
}