
function InventoryManager(game){
	
	this.game = game;
	this.inventory = [];
	this.maxSpace = 5;

	this.points = 0;

	for(var i = 0; i < this.maxSpace; i++){
		var obj = {
			  name: "empty"
			, amount: 0
		};
		this.inventory.push(obj);
	}
}

InventoryManager.prototype.addToInventory = function(name, amount){

	var exists = this.existsInInventory(name);

	if( exists !== false ){

		var obj = this.inventory[exists];
		obj.amount += amount;

		return true;
	}
	else{

		var obj = {
			  name: name
			, amount: amount
		};

		this.inventory[this.firstEmptySlot()] = obj;
		return true;
	}

	return false;
}

InventoryManager.prototype.existsInInventory = function(name){

	for( var i = 0; i < this.inventory.length; i++ ){

		var obj = this.inventory[i];
		if(obj.name == name){

			return i;
		}
	}

	return false;
}

InventoryManager.prototype.firstEmptySlot = function(){

	for(var i = 0; i < this.inventory.length; i++){

		var obj = this.inventory[i];
		if(obj.name == "empty"){
			return i;
		}
	}

	return false;
}