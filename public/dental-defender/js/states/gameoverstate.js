
MainGame.GameOverState = function(game){
	
	this.win = false;
};

MainGame.GameOverState.prototype = {

	create: function(){
		if(this.win){

			var s = this.add.sprite(1024/2, 768/2, 'youwin');
			s.anchor.setTo(0.5, 0.5);
			s.fixedToCamera = true;
		}
		else{
			var s = this.add.sprite(1024/2, 768/2, 'youlose');
			s.anchor.setTo(0.5, 0.5);
			s.fixedToCamera = true;
		}

	},

	update: function(){

	}
};