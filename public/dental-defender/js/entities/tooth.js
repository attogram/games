
function Tooth(game, spawn){
	
	this.game = game;
	Phaser.Sprite.call(this, this.game, spawn.x, spawn.y, 'tooth');
	this.name = "tooth";

	this.anchor.setTo(0.5, 0.5);
	this.body.immovable = true;

	this.health = 500;
	this.maxHealth = 500;

	this.healthBar = this.game.add.sprite(this.x, this.y + 40, 'player_health');
	this.healthBar.anchor.setTo(0.5, 0.5);

	CollisionManager.addObjectToGroup(this, 'teeth');
	this.game.add.existing(this);
}

Tooth.prototype = Object.create(Phaser.Sprite.prototype);
Tooth.prototype.constructor = Tooth;

Tooth.prototype.update = function(){

	var p = (this.health / this.maxHealth);
	p = parseFloat(p.toFixed(1));

	this.healthBar.frame = 10 - (p * 10);
}

Tooth.prototype.die = function(){
	GUIManager.destroy();
	WaveManager.destroy();
	this.game.state.states['GameOver'].win = false;
	this.game.state.start('GameOver');
}