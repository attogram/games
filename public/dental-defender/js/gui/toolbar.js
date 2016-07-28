
function Toolbar(game){
	
	this.game = game;
	Phaser.Group.call(this, this.game, null, "toolbar");
	this.offsetX = 10;
	this.offsetY = 10;

	this.slots = [];
	this.selectedSlot = 0;

	this.arrow = this.create(46, 22, 'toolbar_arrow');
	this.arrow.anchor.setTo(0.5, 0.5);

	for( var i = 0; i < 4; i++ ){

		var obj = {};

		var bg_x = 22;
		var bg_y = 22 + (i*5) + (i*32);
		obj.background = this.create(bg_x, bg_y, 'toolbar_slot_background');
		obj.background.anchor.setTo(0.5, 0.5);

		var slot = new ToolbarSlot(this.game, { x: 22, y: 22 + (i*5) + (i*32)}, null, i);
		obj.slot = slot;
		this.add(slot);

		var text_x = 11;
		var text_y = 20 + i * 37;

		var text = this.game.add.text(text_x, text_y, "", { font: "12px Arial", fill: '#ffffff'}, this);
		obj.text = text;

		obj.selected = false;

		this.slots.push(obj);
	}

	this.fixedToCamera = true;
}

Toolbar.prototype = Object.create(Phaser.Group.prototype);
Toolbar.prototype.constructor = Toolbar;

Toolbar.prototype.selectSlot = function(index){

	this.arrow.y = this.slots[index].slot.y;

	this.slots[this.selectedSlot].selected = false;

	this.selectedSlot = index;
	this.slots[index].selected = true;

	InputManager.handleCursorChange();
}

Toolbar.prototype.update = function(){

	for( var i = 0; i < this.slots.length; i++ ){

		var obj = this.slots[i];

		obj.slot.update();

		var inv_obj = InventoryManager.inventory[i];
		if( obj.slot.item == "gun" ){
			obj.text.setText('');
		}
		else{
			obj.text.setText(inv_obj.amount.toString());	
		}
		
	}
}