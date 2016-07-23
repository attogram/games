
function Turret(game, spawn, type){
	
	this.game = game;
	Phaser.Sprite.call(this, this.game, spawn.x, spawn.y, 'turret_' + (type == 1 ? "small" : "big"));

	this.anchor.setTo(0.5, 0.5);

	if(type == 1){
		this.setupTime = 300;
		this.curSetupTime = 300;
		this.health = 200;
		this.maxHealth = 200;
		this.name = "turret1";
		this.pointValue = MainGame.points.turret1;
		this.range = 500;
		this.attackCooldown = .5 * 1000;
		this.attackDamage = 5;
	}
	else if(type == 2){
		this.setupTime = 600;
		this.curSetupTime = 600;
		this.health = 300;
		this.maxHealth = 300;
		this.name = "turret2";
		this.pointValue = MainGame.points.turret2;
		this.range = 300;
		this.attackCooldown = 2 * 1000;
		this.attackDamage = 8;
	}

	this._type = type;

	this.attackTimer = Date.now();

	this.body.immovable = true;
	this.inputEnabled = true;

	this._state = "setup";
	if(type==1){
		this.progressBar = this.game.add.sprite(this.x, this.y - 20, 'turret_progress');	
	}
	else{
		this.progressBar = this.game.add.sprite(this.x, this.y - 30, 'turret_progress');
	}
	
	this.progressBar.anchor.setTo(0.5, 0.5);
	this.progressBar.alpha = 1;

	this.healthBar = null;

	CollisionManager.addObjectToGroup(this, 'turrets');
	this.game.add.existing(this);
}

Turret.prototype = Object.create(Phaser.Sprite.prototype);
Turret.prototype.constructor = Turret;

Turret.prototype.update = function(){

	if(this._state == "setup"){
		this.curSetupTime--;
		if(this.curSetupTime <= 0){
			this._state = "ready";
			this.progressBar.destroy();

			if(this._type == 1){
				this.healthBar = this.game.add.sprite(this.x, this.y + 20, 'turret_health_bar');	
			}
			else{
				this.healthBar = this.game.add.sprite(this.x, this.y + 34, 'turret_health_bar');
			}
			
			this.healthBar.anchor.setTo(0.5, 0.5);
		}
		else{

			var p = 1 - (this.curSetupTime / this.setupTime);
			if(p > .9){
				this.progressBar.frame = 3;
			}
			else if(p > .7){
				this.progressBar.frame = 2;
			}
			else if(p > .4){
				this.progressBar.frame = 1;
			}
			else{
				this.progressBar.frame = 0;
			}
		}
	}
	else{

		this.updateHealthBar();
		
		//shoot?
		var target = null;
		for( var i = 0; i < CollisionManager.groups.baddies.length; i++ ){
			var baddie = CollisionManager.groups.baddies[i];

			var dist = Math.abs(Math.sqrt((this.x - baddie.x)*(this.x - baddie.x) + (this.y - baddie.y)*(this.y - baddie.y)));

			if(dist < this.range){
				this.attack(baddie);
			}
		}
	}
}

Turret.prototype.attack = function(target){

	if(Date.now() < this.attackTimer){
		return;
	}


	if(this.name == "turret1"){
		//shoot
		var x = target.x - this.x;
		var y = target.y - this.y;
		var mag = Math.sqrt((x * x) + (y * y));
		var nx1 = x / mag;
		var ny1 = y / mag;
		var b = new Bullet(this.game, {x:this.x, y: this.y}, 'player', {x: nx1, y: ny1}, this);
		this.game.turret_small_sfx.play();
	}
	else{
		var x1 = target.x - this.x;
		var y1 = target.y - this.y;
		var mag1 = Math.sqrt((x1 * x1) + (y1 * y1));
		var nx1 = x1 / mag1;
		var ny1 = y1 / mag1;

		var x2 = ( target.x - 40 ) - this.x;
		var y2 = ( target.y - 40 ) - this.y;
		var mag2 = Math.sqrt((x2 * x2) + (y2 * y2));
		var nx2 = x2 / mag2;
		var ny2 = y2 / mag2;

		var x3 = ( target.x + 40 ) - this.x;
		var y3 = ( target.y + 40 ) - this.y;
		var mag3 = Math.sqrt((x3 * x3) + (y3 * y3));
		var nx3 = x3 / mag3;
		var ny3 = y3 / mag3;



		var b1 = new Bullet(this.game, {x:this.x, y: this.y}, 'player', {x: nx1, y: ny1}, this);
		var b2 = new Bullet(this.game, {x:this.x, y: this.y}, 'player', {x: nx2, y: ny2}, this);
		var b3 = new Bullet(this.game, {x:this.x, y: this.y}, 'player', {x: nx3, y: ny3}, this);
		this.game.turret_big_sfx.play();	
	}

	if(nx1 >= 0 && ny1 >= 0){
		if(Math.abs(nx1) > Math.abs(ny1)){
			this.frame = 0;	
		}
		else{
			this.frame = 3;
		}
	}
	else if(nx1 >= 0 && ny1 < 0){
		if(Math.abs(nx1) > Math.abs(ny1)){
			this.frame = 0;	
		}
		else{
			this.frame = 1;
		}
	}
	else if(nx1 < 0 && ny1 >= 0){
		if(Math.abs(nx1) > Math.abs(ny1)){
			this.frame = 2;	
		}
		else{
			this.frame = 3;
		}
	}
	else if(nx1 < 0 && ny1 < 0){
		if(Math.abs(nx1) > Math.abs(ny1)){
			this.frame = 2;	
		}
		else{
			this.frame = 1;
		}
	}
	
	this.attackTimer = Date.now() + this.attackCooldown;
}

Turret.prototype.fix = function(){
	this.health = this.maxHealth;
}

Turret.prototype.updateHealthBar = function(){

	var p = (this.health / this.maxHealth);
	p = parseFloat(p.toFixed(1));

	this.healthBar.frame = 10 - (p * 10);
}

Turret.prototype.die = function(){
	CollisionManager.removeObjectFromGroup(this, 'turrets');
	if(this.progressBar){
		this.progressBar.destroy();
	}
	if(this.healthBar){
		this.healthBar.destroy();
	}
	this.destroy();
}