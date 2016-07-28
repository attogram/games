
function Explosion(game, spawn, image){
	
	this.game = game;
	Phaser.Sprite.call(this, this.game, spawn.x, spawn.y, image);

	this.anchor.setTo(0.5, 0.5);
	this.animations.add('explode', [0,1,2,3], 12, false);
	this.animations.play('explode');
	this.life = Date.now() + 250;

	this.game.add.existing(this);
}

Explosion.prototype = Object.create(Phaser.Sprite.prototype);
Explosion.prototype.constructor = Explosion;

Explosion.prototype.update = function(){

	if(Date.now() >= this.life){

		this.destroy();
	}	
}