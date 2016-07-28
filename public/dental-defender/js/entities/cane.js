
function Cane(game, spawn){
	
	this.game = game;
	Phaser.Sprite.call(this, this.game, spawn.x, spawn.y, 'gumball');

	this.anchor.setTo(0.5, 0.5);
	this.health = 80;
	this.maxHealth = 80;
	this.speed = 70;

	this.animations.add('left', [0,1,2,3], 5, true);
	this.animations.add('right', [4,5,6,7], 5, true);

	this.animations.play('right');

	this.healthBar = this.game.add.sprite(this.x, this.y + 40, 'turret_health_bar');
	this.healthBar.anchor.setTo(0.5, 0.5);

	this.STATES = {
		  TRACKING: 0
		, DAMAGED: 1
	};

	this.name = "gumball";

	this._state = this.STATES.TRACKING;

	this.damageTimer = 0;
	this.attackTimer = Date.now();

	CollisionManager.addObjectToGroup(this, 'baddies');
	this.game.add.existing(this);
}

Cane.prototype = Object.create( Phaser.Sprite.prototype );
Cane.prototype.constructor = Cane;

Cane.prototype.update = function(){

	this.updateHealthBar();

	if(this._state == this.STATES.TRACKING){
		if(this.target){
			if(this.withinShootingRange(this.target)){
				this.attack(this.target);
			}
			
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
	else if(this._state == this.STATES.DAMAGED){
		this.body.veloctiy = {x:0, y:0};
		this.damageTimer--;
		if(this.damageTimer <= 0){
			this._state = this.STATES.TRACKING;
		}
	}

}

Cane.prototype.withinShootingRange = function(target){
	var dist = Math.abs(Math.sqrt((target.x - this.x)*(target.x - this.x)+(target.y - this.y)*(target.x - this.y)));

	if(dist < 400){
		return true;
	}

	return false;
}

Cane.prototype.withinFollowingRange = function(target){
	var dist = Math.abs(Math.sqrt((target.x - this.x)*(target.x - this.x)+(target.y - this.y)*(target.x - this.y)));

	if(dist < 600){
		return true;
	}

	return false;
}

Cane.prototype.moveTowards = function(target){

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
	else if(this.body.velocity.x < 0){
		this.animations.play('left')
	}
}

Cane.prototype.attack = function(target){

	if(Date.now() < this.attackTimer){
		return;
	}

	this.game.player_shoot_sfx.play();

	var x = target.x - this.x;
	var y = target.y - this.y;
	var mag = Math.sqrt((x * x) + (y * y));
	var nx = x / mag;
	var ny = y / mag;
	var b = new Bullet(this.game, {x:this.x, y: this.y}, 'enemy', {x: nx, y: ny}, this);
	this.attackTimer = Date.now() +  1 * 1000;
}

Cane.prototype._damage = function(amount, attacker){

	this.target = attacker;

	this.damage(amount);
	this._state = this.STATES.DAMAGED;
	this.damageTimer = 0;

	if(this.health <= 0
		&& attacker.name == "player"){

		this.die(true);
	}
}

Cane.prototype.updateHealthBar = function(){

	this.healthBar.x = this.x;
	this.healthBar.y = this.y + 40;

	var p = (this.health / this.maxHealth);
	p = parseFloat(p.toFixed(1));
	this.healthBar.frame = 10 - (p * 10);
}

Cane.prototype.die = function(points){

	if(this.game){
		this.game.baddie_die_sfx.play();
	}

	var points = points || false;

	var e = game.add.emitter(this.x, this.y, 16);
	e.makeParticles('gumball_die', [0,1]);
	//e.gravity = 0;
	e.minRotation = 0;
	e.maxRotation = 0;
	e.start(true, 400, null, 16);

	CollisionManager.removeObjectFromGroup(this, "baddies");
	if(this.healthBar){
		this.healthBar.destroy();
	}

	if(points){
		InventoryManager.points += MainGame.points.kill_cane;
	}
	this.destroy();
}