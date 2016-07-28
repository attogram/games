
function Mine(game, spawn){
	
	this.game = game;
	Phaser.Sprite.call(this, this.game, spawn.x, spawn.y, 'mine');

	this.anchor.setTo(0.5, 0.5);
	this.inputEnabled = true;

	this.name = "mine";
	this.pointValue = MainGame.points.mine;

	CollisionManager.addObjectToGroup(this, 'mines');
	this.game.add.existing(this);
}

Mine.prototype = Object.create(Phaser.Sprite.prototype);
Mine.prototype.constructor = Mine;

Mine.prototype.update = function(){

}

Mine.prototype.explode = function(){

	this.die();
}

Mine.prototype.die = function(){
	CollisionManager.removeObjectFromGroup(this, 'mines');
	this.destroy();
}