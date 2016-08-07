/*
 * The MIT License
 * 
 * Copyright (c) 2012 Petar Petrov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
Crafty.c("Layer2Tile", {
    init: function() {
        //this.requires('Multiway');
    }
});
 
Tilemap = ActorObject.extend({
    defaults: {
        // pixel size
        'pxWidth' : _Globals.conf.get('screen-width'),
        'pxHeight' : _Globals.conf.get('screen-height'),   
        
        // tilemap width & height
        'tileSize' : 64,
        'width' : _Globals.conf.get('screen-width') / 64,
        'height' : _Globals.conf.get('screen-height') / 64,
        'spawnArea': undefined,
        'base-z' : 10,
        'maxObstacles' : 27,
        
        // Carrots 
        'carrotHeightOffset': 16,
        'maxCarrots' : _Globals.conf.get('maxCarrotsToSpawn'),
        'carrotHealth': 100,
        
        // globals
        obstaclesCoords: undefined,
        obstaclesMap: undefined,
        carrotsCoordsQueue: [],
    },
    initialize: function() {
        var model = this;
        
        // items spawning area
        model.set('spawnArea', {
            top: 1, 
            left: 1, 
            right: model.get('width') - 2,
            bottom: model.get('height') -2 
        });
        model.set('spawnAreaPx', {
            top: model.get('tileSize') * model.get('spawnArea').top, 
            left: model.get('tileSize') * model.get('spawnArea').left, 
            right: model.get('tileSize') * model.get('spawnArea').right,
            bottom: model.get('tileSize') * model.get('spawnArea').bottom
        });        
        
        // generate layer #1 - ground tiles
        for (var i = 0; i < model.get('width'); i++) {
            for (var j = 0; j < model.get('height'); j++) {
                var entity = Crafty.e("2D," + _Globals.conf.get('renderType') + ", grass")
                .attr({x: i * model.get('tileSize'), y: j * model.get('tileSize'), z: 0});
            }
        }
        
        // generate layer #2 - obstacles
        var obstaclesCoords = [];
        
        for (var i = 0; i < model.get('maxObstacles'); i++) {
            var type = Crafty.math.randomInt(1, 6);
            var occupiedTile = false;
            var ox;
            var oy;
            var oz;
            var spriteName = '';
            
            do {
                ox = Crafty.math.randomInt(model.get('spawnArea').left, model.get('spawnArea').right);
                oy = Crafty.math.randomInt(model.get('spawnArea').top, model.get('spawnArea').bottom);
                occupiedTile = _.size(_.where(obstaclesCoords, {x: ox, y: oy})) > 0;
                
                if (_Globals.conf.get('debug') && occupiedTile)
                    console.log("Calculate new obstalce position for " + i);
                
            } while (occupiedTile);
            
            // save into tile map
            obstaclesCoords.push({x: ox, y: oy});
            
            // get absolute position
            ox *= model.get('tileSize');
            oy *= model.get('tileSize');
            
            if (type == 1) { // small stone
                spriteName = 'stone_small';
                oz = model.get('base-z') + oy + model.get('tileSize') - 16;
            } else if (type == 2) {
                spriteName = 'stone_big';
                oz = model.get('base-z') + oy + model.get('tileSize') - 8;
            } else if (type == 3) {
                spriteName = 'tree';
                oz = model.get('base-z') + oy + model.get('tileSize');
            } else if (type == 4) {
                spriteName = 'barrel';
                oz = model.get('base-z') + oy + model.get('tileSize') - 16;
            } else if (type == 5) {
                spriteName = 'bush';
                oz = model.get('base-z') + oy + model.get('tileSize') - 16;
            } else if (type == 6) {
                spriteName = 'heysack';
                oz = model.get('base-z') + oy + model.get('tileSize');                
            } else {
                continue;
            }
            
            var entity = Crafty.e("2D, " + _Globals.conf.get('renderType') + ", " + spriteName + ", Collision, Layer2Tile")
                .attr({x: ox, y: oy, z: oz});
                
            if (type == 1) { // stone_small
                entity.collision(
                    [16, 40], 
                    [48, 40], 
                    [48, 48], 
                    [16, 48]
                );
            } else if (type == 2) { // stone_big
                entity.collision(
                    [16, 40], 
                    [48, 40], 
                    [48, 48], 
                    [16, 48]
                );                       
            } else if (type == 3 || type == 6) { // tree/heysack
                entity.collision(
                    [12, 52], 
                    [56, 52], 
                    [56, 64], 
                    [12, 64]
                );                 
            } else if (type == 4 || type == 5) { // barrel/bush
                entity.collision(
                    [16, 40], 
                    [48, 40], 
                    [48, 48], 
                    [16, 48]
                );                      
            }
        }
        
        // set into local var
        model.set('obstaclesCoords', obstaclesCoords);
        // create obstalces map for A-Star
        var obstaclesMap = [];
        for (var y = 0; y < model.get('height'); y++) {
            var row = [];
            for (var x = 0; x < model.get('width'); x++) {
                row.push(GraphNodeType.OPEN);
            }
            obstaclesMap.push(row);
        }
        
        _.each(obstaclesCoords, function(pos) {
           obstaclesMap[pos.y][pos.x] = GraphNodeType.WALL;
        });
        model.set('obstaclesMap', new Graph(obstaclesMap));
    },
    // get shortest path to tile (using A-Star algorithm)
    getPathToTile: function(from, to) {
        var obstaclesGraph = this.get('obstaclesMap');
//        console.log(from);
//        console.log(to);  
        from.x = from.x < 0 ? 0 : from.x;
        from.x = from.x >= this.get('width') ? this.get('width') -  1 : from.x;
        from.y = from.y < 0 ? 0 : from.y;
        from.y = from.y >= this.get('height') ? this.get('height') - 1 : from.y;
//        console.log("find sx,sy: %d, %d", from.x, from.y);
        from.x = Math.floor(from.x);
        from.y = Math.floor(from.y);
        to.x = Math.floor(to.x);
        to.y = Math.floor(to.y);

        var start = obstaclesGraph.nodes[from.y][from.x];
        var end = obstaclesGraph.nodes[to.y][to.x];
        return astar.search(obstaclesGraph.nodes, start, end, true);
    },
    // get shortest path from pixel coords
    getPathToTilePx: function(from, to) {
        var sz = this.get('tileSize');
        from.x /= sz;
        from.y /= sz;
        to.x /= sz;
        to.y /= sz;
        return this.getPathToTile(from, to);
    },    
    // Spawn new carrot only if maximum is not reached
    spawnCarrot: function() {
        if (Crafty("carrot").length < this.get('maxCarrots')) {
            var done = false;
            var pos, tx, ty;
            
            do {
                var ox = Crafty.math.randomInt(this.get('spawnArea').left, this.get('spawnArea').right);
                var oy = Crafty.math.randomInt(this.get('spawnArea').top, this.get('spawnArea').bottom);
                pos = this.spawnAt(ox, oy);
                tx = pos.x / this.get('tileSize');
                ty = pos.y / this.get('tileSize');
                
                var carrotsCoordsQueue = this.get('carrotsCoordsQueue');
                done = _.size(_.where(carrotsCoordsQueue, {x: tx, y: ty})) == 0;
                
                if (_Globals.conf.get('debug') && !done) {
                    console.log('Carrot coords %d,%d already used!', tx, ty);
                }
            } while (!done);
            
            // we keep only last 3 coords generated
            carrotsCoordsQueue.push({x: tx, y: ty});
            if (carrotsCoordsQueue.length > 8)
                carrotsCoordsQueue.pop();            
            
            var oz = this.get('base-z') + 24 + pos.y + 1;

            Crafty.e("2D, " + _Globals.conf.get('renderType') + ", carrot, SpriteAnimation, Collision")
            .attr({
                x: pos.x, y: pos.y, z: oz, 
                health: this.get('carrotHealth'),
                pulled: false,
                occupied: false,
                startFrame: Crafty.frame() + 500,
            })
            .reel('wind', 450, [ [0, 0], [1, 0], [2, 0], [1, 0] ]) // setup anim
            .animate('wind', -1); // play anim

//                .bind("EnterFrame", function(frame) {
//                    if (frame.frame > this.startFrame) {
//                        this.destroy();
//                    }
//                });
        }
    },
    // get unoccupied map position given tile coordinates
    // returns pixel position
    spawnAt: function(tileX, tileY) {
        var cx = tileX,
            cy = tileY;
        var occupiedTile = false;
        var nextX = [1, 0, -1, 0];
        var nextY = [0, 1, 0, -1];
        var i = 0, m = 1;
        
        do {
            occupiedTile = _.size(_.where(this.get('obstaclesCoords'), {x: cx, y: cy})) > 0;
                
            if (occupiedTile) {
                // nadebugvaj gooo ....
                if (_Globals.conf.get('trace'))
                    console.log("spawnAt: Cannot spawn at " + cx + "," + cy);
                    
                cx = tileX + nextX[i] * m;
                cy = tileY + nextY[i] * m;
                
                if ( ++i > 3 ) {
                    i = 0;
                    m++; 
                }
            }
                
        } while (occupiedTile);
        
        return {x: cx * this.get('tileSize'), y: cy * this.get('tileSize')};
    }, 
    // spawn at pixel position 
    spawnAtPx: function(startX, startY) {
        return this.spawnAt(startX / this.get('tileSize'), startY / this.get('tileSize'));
    },
    // try to spawn coords at the central tile map position
    spawnAtCentre: function() {
        return this.spawnAt(
            this.get('width') * 0.5, 
            this.get('height') * 0.5);
    },
    // try to spawn coords at random free position
    spawnAtRandom: function() {
        var ox = Crafty.math.randomInt(this.get('spawnArea').left, this.get('spawnArea').right);
        var oy = Crafty.math.randomInt(this.get('spawnArea').top, this.get('spawnArea').bottom);        
        return this.spawnAt(ox, oy);
    },    
    // get spawn position relative to coordinates rx, ry
    spawnRelativeTo: function(rx, ry) {
            var sx, sy;
            var dxl = rx - this.get('spawnAreaPx').left;
            var dxr = this.get('spawnAreaPx').right - rx;
            
            // get random X position
            if (dxl < dxr) {
                sx = Crafty.math.randomInt(0, this.get('spawnArea').left);
            } else {
                sx = Crafty.math.randomInt(this.get('spawnArea').right, this.get('spawnArea').right + 2);
            }
            
            // get random Y position
            var dyt = ry - this.get('spawnAreaPx').top;
            var dyb = this.get('spawnAreaPx').bottom - ry;
            
            if (dyt < dyb) {
                sy = Crafty.math.randomInt(0, this.get('spawnArea').top);
            } else {
                sy = Crafty.math.randomInt(this.get('spawnArea').bottom, this.get('spawnArea').bottom + 2);
            }
            
            // console.log("dxl,dxr " + dxl + " " + dxr);
            // console.log("dyt,dyb " + dyt + " " + dyb);
            
            sx *= this.get('tileSize');
            sy *= this.get('tileSize');
            
            return {x: sx, y: sy};        
    },
    // get spawn position relative to map edge
    spawnRelativeToEdge: function(edge) {
        if (!edge || edge == 'random') {
            var edges = ['topleft', 'topright', 'bottomleft', 'bottomright'];
            var type = Crafty.math.randomInt(0, 3);
            return this.spawnRelativeToEdge(edges[type]);
        }
        if (edge == 'topleft') {
            return this.spawnRelativeTo(this.get('spawnAreaPx').left, this.get('spawnAreaPx').top);
        } else if (edge == 'topright') {
            return this.spawnRelativeTo(this.get('spawnAreaPx').right, this.get('spawnAreaPx').top);
        } else if (edge == 'bottomleft') {
            return this.spawnRelativeTo(this.get('spawnAreaPx').left, this.get('spawnAreaPx').bottom);
        } else if (edge == 'bottomright') {
            return this.spawnRelativeTo(this.get('spawnAreaPx').right, this.get('spawnAreaPx').bottom);
        }
    },
//    // get spawn coords to carrot pos. additionally get target carrot coords 
//    spawnRelativeToCarrot: function() {
//        var obj = this.findFreeCarrot();
//        if (obj != undefined) {
//            var pos = this.spawnRelativeTo(obj.x, obj.y);
//            return {
//                origin: {x: pos.x, y: pos.y}, 
//                target: {x: obj.x, y: obj.y}};
//        }
//        
//        // return undefined;
//    },
    // get non-occupied (& closest) carrot entity
    findFreeCarrot: function(from) {
        if (from) {
            // closest to from coords
            var carrotsArray = Crafty("carrot");  
            var ref = undefined;
            var dist = 18437736874454810627;    
            
            _.each(carrotsArray, function(carrotObj) { 
                var obj = Crafty(carrotObj);
                if (obj && !obj.occupied) {
                    var dx = (obj.x + 16) - (from.x + 16);
                    var dy = (obj.y + 24) - (from.y + 48);
                    var thisDist = (dx * dx) + (dy * dy);
                    if (thisDist < dist) {
                        dist = thisDist;
                        ref = obj;
                    }
                }
            });
//            console.log("Chosen");
//            console.log(ref);
//            console.log("this dist: %d", dist);
            return ref;            
        } else {
            // random carrot
            var carrotsArray = _.shuffle(Crafty("carrot"));  
            var ret = _.find(carrotsArray, function(carrotObj) { 
                var obj = Crafty(carrotObj);
                return (obj != undefined) && (!obj.occupied);
            });
            if (ref != undefined)
                return Crafty(ref);                 
        }
    }
});
 