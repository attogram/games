
function InputManager(game){

	this.game = game;

	this.tileSize = 32;
	this.activeTile = { x: 0, y: 0};

	this.reach = 200;
}

InputManager.prototype.setup = function(){
	this.cursorSprite = this.game.add.sprite(0, 0, 'gun_cursor');
	this.cursorSprite.anchor.setTo(0.5, 0.5);
	this.cursorSprite.alpha = .5;
}

InputManager.prototype.update = function(){

	if(GUIManager.menuScreen.visible == false){

		this.handleCursorChange();

		this.cursorSprite.x = this.game.input.mousePointer.worldX;
		this.cursorSprite.y = this.game.input.mousePointer.worldY;

		var currentAction = "";
		var item = InventoryManager.inventory[GUIManager.toolbar.selectedSlot];
		var activeItem = item.name;

		if(activeItem == "gun"){
			if(this.game.input.mousePointer.isDown){

				var pixelX = this.game.input.mousePointer.worldX;
				var pixelY = this.game.input.mousePointer.worldY;

				this.game.player.attack({x: pixelX, y: pixelY});
			}
		}
		else if(activeItem == "hammer"){
			if(this.game.input.mousePointer.isDown){

				var x = this.game.input.mousePointer.worldX;
				var y = this.game.input.mousePointer.worldY;

				if(this.withinReach({x:x,y:y})){
					if(this.game.input.mousePointer.targetObject){
						if(this.game.input.mousePointer.targetObject.sprite){
							if(this.game.input.mousePointer.targetObject.sprite.name
								&& this.game.input.mousePointer.targetObject.sprite.name == "turret1"
								|| this.game.input.mousePointer.targetObject.sprite.name == "turret2"){

								var turret = this.game.input.mousePointer.targetObject.sprite;
								if(turret.health < turret.maxHealth){
									turret.fix();
									InventoryManager.inventory[GUIManager.toolbar.selectedSlot].amount--;
								}
							}
						}
					}
				}
			}
		}
		else if(activeItem == "turret_small"){

			if(this.game.input.mousePointer.isDown){

				var x = this.game.input.mousePointer.worldX;
				var y = this.game.input.mousePointer.worldY;

				if( item.amount > 0 ){

					if(!this.tooClose('turrets', {x:x, y:y}, 50)
						&& this.withinReach({x:x,y:y})
						&& this.emptyTile({x:x,y:y})){

						var t = new Turret(this.game, { x: x, y: y }, 1);
						InventoryManager.inventory[GUIManager.toolbar.selectedSlot].amount--;
						this.handleCursorChange();
					}
				}
			}
		}
		else if(activeItem == "turret_big"){
			if(this.game.input.mousePointer.isDown){

				var x = this.game.input.mousePointer.worldX;
				var y = this.game.input.mousePointer.worldY;

				if( item.amount > 0 ){

					if(!this.tooClose('turrets', {x:x, y:y}, 50)
						&& this.withinReach({x:x,y:y})
						&& this.emptyTile({x:x,y:y})){

						var t = new Turret(this.game, { x: x, y: y }, 2);
						InventoryManager.inventory[GUIManager.toolbar.selectedSlot].amount--;
						this.handleCursorChange();
					}
				}
			}
		}
		else if(activeItem == "mine"){
			if(this.game.input.mousePointer.isDown){

				var x = this.game.input.mousePointer.worldX;
				var y = this.game.input.mousePointer.worldY;

				if( item.amount > 0 ){

					if(!this.tooClose('mines', {x:x, y:y}, 30)
						&& this.withinReach({x:x,y:y})
						&& this.emptyTile({x:x,y:y})){

						var m = new Mine(this.game, { x: x, y: y });
						InventoryManager.inventory[GUIManager.toolbar.selectedSlot].amount--;
						this.handleCursorChange();
					}
				}
			}
		}

		if(this.game.keys.REMOVE.isDown){
			var x = this.game.input.mousePointer.worldX;
			var y = this.game.input.mousePointer.worldY;

			if(this.withinReach({x:x,y:y})){
				if(this.game.input.mousePointer.targetObject){
					if(this.game.input.mousePointer.targetObject.sprite){
						if(this.game.input.mousePointer.targetObject.sprite.name
							&& this.game.input.mousePointer.targetObject.sprite.name == "turret1"
							|| this.game.input.mousePointer.targetObject.sprite.name == "turret2"
							|| this.game.input.mousePointer.targetObject.sprite.name == "mine"){

							var obj = this.game.input.mousePointer.targetObject.sprite;

							var points = obj.pointValue * ( obj.health / obj.maxHealth );
							InventoryManager.points += points;
							obj.die();
						}
					}
				}
			}
		}

		if(this.game.keys.DEBUG.isDown){ console.log(InventoryManager.points)}

	}
	else{


	}
}

InputManager.prototype.handleMouseWheel = function(e){

	if(GUIManager.menuScreen.visible == false){
		if( e.wheelDelta < 0 ){

			if(GUIManager.toolbar.selectedSlot == GUIManager.toolbar.slots.length - 1){
				GUIManager.toolbar.selectSlot(0);
			}
			else{
				GUIManager.toolbar.selectSlot( GUIManager.toolbar.selectedSlot + 1 );
			}
		}
		else if( e.wheelDelta > 0 ){
			
			if(GUIManager.toolbar.selectedSlot == 0){
				GUIManager.toolbar.selectSlot(3);
			}
			else{
				GUIManager.toolbar.selectSlot( GUIManager.toolbar.selectedSlot - 1 );
			}
		}
	}
}

InputManager.prototype.tooClose = function(group, pos, distance){

	var g = CollisionManager.groups[group];

	for( var i = 0; i < g.length; i++){
		
		var obj = g[i];
		
		var d = Math.abs(Math.sqrt((pos.x - obj.x)*(pos.x - obj.x) + (pos.y - obj.y)*(pos.y - obj.y)));

		if(d <= distance){
			return true;
		}
	}

	return false;

}

InputManager.prototype.withinReach = function(pos){

	var obj = this.game.player;
	var d = Math.abs(Math.sqrt((pos.x - obj.x)*(pos.x - obj.x) + (pos.y - obj.y)*(pos.y - obj.y)));

	if(d <= this.reach){
		return true;
	}

	return false;
}

InputManager.prototype.emptyTile = function(pos){
	
	var tileX = Math.floor(pos.x / 32);
	var tileY = Math.floor(pos.y / 32);

	var tile = this.game.map.getTile(tileX, tileY, 1);

	if(tile){
		return false;
	}

	return true;
}

InputManager.prototype.handleCursorChange = function(){

	var item = InventoryManager.inventory[GUIManager.toolbar.selectedSlot].name;
	var amount = InventoryManager.inventory[GUIManager.toolbar.selectedSlot].amount;

	this.cursorSprite.alpha = .5;

	var reachable = this.withinReach({ x: this.game.input.mousePointer.worldX, y: this.game.input.mousePointer.worldY });

	if(item == "hammer"){
		if(reachable){
			this.cursorSprite.loadTexture('hammer');
		}
		else{
			this.cursorSprite.loadTexture('hammer_x');
		}
	}
	else if(item == "turret_small"){
		if(reachable){
			this.cursorSprite.loadTexture('turret_small');
		}
		else{
			this.cursorSprite.loadTexture('turret_small_x');
		}
	}
	else if(item == "turret_big"){
		if(reachable){
			this.cursorSprite.loadTexture('turret_big');
		}
		else{
			this.cursorSprite.loadTexture('turret_big_x');
		}
		
	}
	else{
		this.cursorSprite.loadTexture('gun_cursor');
	}

	if(amount <= 0){
		this.cursorSprite.alpha = .1;
	}
}