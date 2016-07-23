
function ToolbarSlot(game, position, item, index){
	
	this.game = game;

	if( item == null || item == ""){
		item = "toolbar_slot_blank";
	}

	this.index = index;
	Phaser.Sprite.call(this, this.game, position.x, position.y, item + "_icon");

	this.anchor.setTo(0.5, 0.5);
	this.fixedToScreen = true;
}

ToolbarSlot.prototype= Object.create(Phaser.Sprite.prototype);
ToolbarSlot.prototype.constructor - ToolbarSlot;

ToolbarSlot.prototype.update = function(){

	var obj = InventoryManager.inventory[this.index];

	if(obj.name != this.item){

		if(obj.name == "empty" && this.item != "toolbar_slot_blank"){
			this.loadTexture('toolbar_slot_blank');
			this.item = 'toolbar_slot_blank';
		}
		else{
			this.loadTexture(obj.name + "_icon");
			this.item = obj.name;
		}
	}
}