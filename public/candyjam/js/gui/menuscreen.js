
function MenuScreen(game){
	
	this.game = game;
	Phaser.Group.call(this, this.game, null, "menuScreen");

	this.nextWave = WaveManager.currentWave;
	this.availablePoints = InventoryManager.points;

	//overlay
	this.overlay = this.create(0, 0, 'overlay');
	//this.overlay.anchor.setTo(0.5, 0.5);
	this.overlay.fixedToScreen = true;
	
	this.waveCompleteText = this.game.add.text(50, 150, "Wave Complete!", { font: "48px monospace", fill: '#ffffff'}, this);
	this.waveTimeText = this.game.add.text(50, 220, "Time: 0", { font: "24px monospace", fill: '#ffffff'}, this);
	//this.enemiesKillText = this.game.add.text(50, 260, "Enemies Killed: 0", { font: "24px monospace", fill: '#ffffff'}, this);
	this.accuracyText = this.game.add.text(50, 270, "Accuracy: 0", { font: "24px monospace", fill: '#ffffff'}, this);


	this.pointsText = this.game.add.text(640, 80, "Points Available: " + this.availablePoints, { font: "22px monospace", fill: '#ffffff'}, this);

	//Turret small
	this.t1_bg = this.create(660, 200, 'toolbar_slot_background');
	this.t1_bg.anchor.setTo(0.5, 0.5);
	this.t1 = this.create(660, 200, 'turret_small_icon');
	this.t1.anchor.setTo(0.5, 0.5);
	this.t1_text 		= this.game.add.text(650, 200, InventoryManager.inventory[2].amount.toString(), { font: "12px Arial", fill: '#ffffff'}, this);
	this.t1_title_text  = this.game.add.text(645, 150, "Small Turret", { font: "18px monospace", fill: '#ffffff'}, this);
	this.t1_range_text  = this.game.add.text(700, 180, "Range: 500", { font: "14px monospace", fill: '#ffffff'}, this);
	this.t1_damage_text = this.game.add.text(700, 200, "Damage: 5 (x1)", { font: "14px monospace", fill: '#ffffff'}, this);
	this.t1_cost_text   = this.game.add.text(700, 220, "Cost: " + MainGame.points.turret1, { font: "14px monospace", fill: '#ffffff'}, this);
	this.t1_btn = new Phaser.Button(this.game, 880, 190, 'buy_btn', this.buyTurretSmall, this, 1, 0, 0);
	this.add(this.t1_btn);

	//Turret big
	this.t2_bg = this.create(660, 310, 'toolbar_slot_background');
	this.t2_bg.anchor.setTo(0.5, 0.5);
	this.t2 = this.create(660, 310, 'turret_big_icon');
	this.t2.anchor.setTo(0.5, 0.5);
	this.t2_text 		= this.game.add.text(650, 310, InventoryManager.inventory[3].amount.toString(), { font: "12px Arial", fill: '#ffffff'}, this);
	this.t2_title_text 	= this.game.add.text(645, 260, "Large Turret", { font: "18px monospace", fill: '#ffffff'}, this);
	this.t2_range_text 	= this.game.add.text(700, 290, "Range: 300", { font: "14px monospace", fill: '#ffffff'}, this);
	this.t2_damage_text = this.game.add.text(700, 310, "Damage: 8 (x3)", { font: "14px monospace", fill: '#ffffff'}, this);
	this.t2_cost_text 	= this.game.add.text(700, 330, "Cost: " + MainGame.points.turret2, { font: "14px monospace", fill: '#ffffff'}, this);
	this.t2_btn = new Phaser.Button(this.game, 880, 300, 'buy_btn', this.buyTurretBig, this, 1, 0, 0);
	this.add(this.t2_btn);

	//Hammers
	this.h_bg = this.create(660, 420, 'toolbar_slot_background');
	this.h_bg.anchor.setTo(0.5, 0.5);
	this.h = this.create(660, 420, 'hammer_icon');
	this.h.anchor.setTo(0.5, 0.5);
	this.h_text 		= this.game.add.text(650, 420, InventoryManager.inventory[1].amount.toString(),  { font: "12px Arial", fill: '#ffffff'}, this);
	this.h_title_text 	= this.game.add.text(645, 370, "Repair Hammer", { font: "18px monospace", fill: '#ffffff'}, this);
	this.h_extra_text 	= this.game.add.text(700, 400, "Repairs one turret", { font: "14px monospace", fill: '#ffffff'}, this);
	this.h_extra_text2 	= this.game.add.text(700, 415, "to full health", { font: "14px monospace", fill: '#ffffff'}, this);
	this.h_cost_text 	= this.game.add.text(700, 440, "Cost: " + MainGame.points.hammer, { font: "14px monospace", fill: '#ffffff'}, this);
	this.h_btn = new Phaser.Button(this.game, 880, 410, 'buy_btn', this.buyHammer, this, 1, 0, 0);
	this.add(this.h_btn);

	//First Aid
	/*this.f_bg = this.create(660, 530, 'toolbar_slot_background');
	this.f_bg.anchor.setTo(0.5, 0.5);*/
	this.f = this.create(660, 530, 'player');
	this.f.anchor.setTo(0.5, 0.5);
	this.f_title_text 	= this.game.add.text(645, 480, "First Aid", { font: "18px monospace", fill: '#ffffff'}, this);
	this.f_extra_text 	= this.game.add.text(700, 510, "Heals the player", { font: "14px monospace", fill: '#ffffff'}, this);
	this.f_extra_text2 	= this.game.add.text(700, 525, "for 50 HP", { font: "14px monospace", fill: '#ffffff'}, this);
	this.f_cost_text 	= this.game.add.text(700, 550, "Cost: " + MainGame.points.firstaid, { font: "14px monospace", fill: '#ffffff'}, this);
	this.f_btn = new Phaser.Button(this.game, 880, 520, 'buy_btn', this.buyFirstAid, this, 1, 0, 0);
	this.add(this.f_btn);


	//
	//this.ready_btn = this.create(645, 640, 'ready_btn');
	this.ready_btn = new Phaser.Button(this.game, 645, 640, 'ready_btn', this.readyWave, this, 1, 0, 0);
	this.add(this.ready_btn);

}

MenuScreen.prototype = Object.create(Phaser.Group.prototype);
MenuScreen.prototype.constructor = MenuScreen;


MenuScreen.prototype.update = function(){

	this.waveTimeText.setText("Time: " + Math.floor(WaveManager.waveLength / 1000) + " seconds");
	//this.enemiesKillText.setText("Enemies Killed: " + WaveManager.enemiesKilled);
	this.accuracyText.setText("Accuracy: " + WaveManager.accuracy + "%");

	this.t1_text.setText(InventoryManager.inventory[2].amount.toString());
	this.t2_text.setText(InventoryManager.inventory[3].amount.toString());
	this.h_text.setText(InventoryManager.inventory[1].amount.toString());
	this.pointsText.setText("Points Available: " + InventoryManager.points);
}

MenuScreen.prototype.buyTurretSmall = function(){

	var cost = MainGame.points.turret1;

	if(InventoryManager.points >= cost){
		InventoryManager.points -= cost;
		InventoryManager.addToInventory('turret_small', 1);
	}
}

MenuScreen.prototype.buyTurretBig = function(){

	var cost = MainGame.points.turret2;

	if(InventoryManager.points >= cost){
		InventoryManager.points -= cost;
		InventoryManager.addToInventory('turret_big', 1);
	}
}

MenuScreen.prototype.buyHammer = function(){

	var cost = MainGame.points.hammer;

	if(InventoryManager.points >= cost){
		InventoryManager.points -= cost;
		InventoryManager.addToInventory('hammer', 1);
	}
}

MenuScreen.prototype.buyFirstAid = function(){

	var cost = MainGame.points.firstaid;

	if(InventoryManager.points >= cost){
		InventoryManager.points -= cost;
		this.game.player.health += 50;
		if(this.game.player.health > 200){
			this.game.player.health = 200;
		}
	}
}

MenuScreen.prototype.readyWave = function(){

	this.visible = false;
	WaveManager.startNewWave();
}