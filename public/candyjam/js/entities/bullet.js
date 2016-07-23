
function Bullet(game, spawn, type, dir, parent){
	
	this.game = game;
	if(type=="player"){
		Phaser.Sprite.call(this, this.game, spawn.x, spawn.y, 'bullet');	
	}
	else{
		Phaser.Sprite.call(this, this.game, spawn.x, spawn.y, 'bullet_pink');
	}
	

	this.anchor.setTo(0.5, 0.5);
	this._parent = parent;

	this.speed = 550;
	this.life = 75;
	this._type = type;

	this.body.velocity.x = dir.x * this.speed;
	this.body.velocity.y = dir.y * this.speed;

	if(type == "player"){
		CollisionManager.addObjectToGroup(this, 'bullets');
	}
	else if(type == "enemy"){
		CollisionManager.addObjectToGroup(this, 'enemy_bullets');
	}
	
	this.game.add.existing(this);
}

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function(){

	this.life--;

	if(this.life <= 0){
		if(this.alive){
			this.die();
		}
	}
};

Bullet.prototype.die = function(){
	if(this._type == "player"){
		CollisionManager.removeObjectFromGroup(this, 'bullets');
	}
	else if(this._type == "enemy"){
		CollisionManager.removeObjectFromGroup(this, 'enemy_bullets');
	}
	
	this.destroy();
};