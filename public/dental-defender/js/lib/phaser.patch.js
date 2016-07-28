Phaser.Time.prototype.original_update = Phaser.Time.prototype.update;

Phaser.Time.prototype.update = function (time) {

	//  More aggressively clamp the delta
	if (this.physicsElapsed > (1.0/15))
	{
		this.physicsElapsed = (1.0/15);
	}

	this.lastPhysElapsed = this.physicsElapsed;
	this.original_update(time);

	// lowpass filter the physics to smooth out the jitters
	this.physicsElapsed = (this.physicsElapsed * 0.1) + (this.lastPhysElapsed * 0.9);
};

Phaser.Tilemap.prototype.calculateFacesLocal = function(layer, start_x, start_y){

	for (var y = start_y - 1; y <= start_y + 1; y++)
	{
		for (var x = start_x - 1; x <= start_x + 1; x++)
		{
			var tile = this.layers[layer].data[y][x];

			if (tile)
			{
				tile.faceTop = true;
				tile.faceBottom = true;
				tile.faceLeft = true;
				tile.faceRight = true;

				var above = this.getTileAbove(layer, x, y);
				var below = this.getTileBelow(layer, x, y);
				var left = this.getTileLeft(layer, x, y);
				var right = this.getTileRight(layer, x, y);

				if (above && above.collides)
				{
					//  There is a tile above this one that also collides, so the top of this tile is no longer interesting
					tile.faceTop = false;
				}

				if (below && below.collides)
				{
					//  There is a tile below this one that also collides, so the bottom of this tile is no longer interesting
					tile.faceBottom = false;
				}

				if (left && left.collides)
				{
					//  There is a tile left this one that also collides, so the left of this tile is no longer interesting
					tile.faceLeft = false;
				}

				if (right && right.collides)
				{
					//  There is a tile right this one that also collides, so the right of this tile is no longer interesting
					tile.faceRight = false;
				}
			}
		}
	}

	this.game.lightmap.recalculateSingleTile(start_x, start_y);
};


Phaser.Tilemap.prototype.createLightMap = function(){

	if (typeof width === 'undefined') { width = this.game.width; }
	if (typeof height === 'undefined') { height = this.game.height; }
	if (typeof group === 'undefined') { group = this.game.world; }

	return group.add(new LightMap(this.game, this, 2, width, height));
};