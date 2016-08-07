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
 
/**
 * Component that initilizes player animation tweets
 */
Crafty.c('Enemy', {
    tileMap: undefined,
    
    Enemy: function(tileMap) {
        //setup animations
        var animSpeed = 250;
        this.requires("SpriteAnimation, Collision, Grid")
        .reel("walk_left", animSpeed, [ [0, 2], [1, 2], [2, 2] ])
        .reel("walk_right", animSpeed, [ [0, 3], [1, 3], [2, 3] ])
        .reel("walk_up", animSpeed, [ [0, 1], [1, 1], [2, 1] ])
        .reel("walk_down", animSpeed, [ [0, 0], [1, 0], [2, 0] ])
        
        this.tileMap = tileMap;
        
        var spawnPos = this.tileMap.spawnRelativeToEdge('random');
        this.attr({x: spawnPos.x, y: spawnPos.y});
        this.newTarget();        
    
        return this;
    },
    init: function() {
        this.requires("2D " + _Globals.conf.get('renderType'));
        this.target = {x: undefined, y: undefined, obj: undefined, path: undefined, pathpos: 0};
        this.digCarrot = {canPull: false, obj: undefined};
        this.pushedProps = {pushed: false, atFrame: 0};

    },
    // get new target/carrot position or go to random location of no targets exist
    newTarget: function(anywhere) {
        if (!anywhere) {
            var carrtObj = this.tileMap.findFreeCarrot({x: this.x, y: this.y});
            if (carrtObj) {
                // TRACE
                if (_Globals.conf.get('trace')) {
                    console.log('Enemy:' + this[0] + ' new target coords ' + carrtObj[0] 
                        + ' XY:' + carrtObj.x + ',' + carrtObj.y + ' occ: ' + carrtObj.occupied);
                }
                this.target.x = carrtObj.x;
                this.target.y = carrtObj.y;
                this.target.obj = carrtObj;
                // mark this as already chosen
                this.target.obj.occupied = true;
            } else {
                // no carrots, so choose a random place to go
                anywhere = true; 
            }
        }
        
        if (anywhere) {
            var newPos = this.tileMap.spawnAtRandom();
            this.target.x = newPos.x;
            this.target.y = newPos.y;
            this.target.obj = undefined;
        }
        
        // adjust waypoint
        this.target.path = this.tileMap.getPathToTilePx(
            {x: this.x, y: this.y}, 
            {x: this.target.x, y: this.target.y});                
        this.target.pathpos = 0;
        
        // reset pulling
        if (this.digCarrot.canPull) {
            this.digCarrot.canPull = false;
            //this.digCarrot.obj.occupied = false;            
            this.digCarrot.obj = undefined;
        }
        
        return this;
    }
});

/**
 * Creates and handles all Enemy actions and attributes
 */
Enemy = ActorObject.extend({
    defaults: {
        // references
        'tileMap': undefined,
        
        // behavior
        'speed': 2,
        'pullSpeed': 2.25,
        'pushCooldown': 30,
        
        // gfx properties
        'spriteHeight': 48,
        'z-index': 10,
        'spriteHalfHeight': 24,
        'spriteHalfWidth': 16,        
    },
    initialize: function() {
        var model = this;
        
        model.set('sprite-z', model.get('spriteHeight') + model.get('z-index'));
        
        // init player entity
        var entity = Crafty.e("2D, " + _Globals.conf.get('renderType') + ", Enemy, enemy")
        .attr({
            move: {left: false, right: false, up: false, down: false},
            z: model.get('sprite-z'), speed: model.get('speed')
        })
        .Enemy(model.get('tileMap'))
        // updates
        .bind("EnterFrame", function(frame) {
            
            if (this.pushedProps.pushed) {
                if (!this.pushedProps.atFrame) {
                    this.pushedProps.atFrame = frame.frame + model.get('pushCooldown');
                    return;
                }
                if (this.pushedProps.atFrame > frame.frame) {
                    return;
                }
                this.newTarget();
                this.pushedProps.pushed = false;
            }
            
            // --- Pull ---
            
            if (this.digCarrot.canPull) {
                this.pauseAnimation();
                this.digCarrot.obj.health -= model.get('pullSpeed');
                    
                // if pulled, simply destroy entity, the hit check should determine if we
                // are about to pull another one or not
                if (this.digCarrot.obj.health <= 0) {
                    this.digCarrot.canPull = false;
                    this.digCarrot.obj.pulled = true;
                    this.digCarrot.obj.destroy();
                    
                    // mock player
                    var playerPullID = model.get('player').get('pullID');
                    if (playerPullID && playerPullID == this.digCarrot.obj[0]) {
                        if (_Globals.conf.get('sfx'))
                            // play sound
                            if (_Globals.conf.get('sfx')) {
                                if (Date.now() % 2 == 0) {
                                    Crafty.audio.play("laughter1", 1, _Globals.conf.get('sfx_vol'));
                                } else {
                                    Crafty.audio.play("laughter2", 1, _Globals.conf.get('sfx_vol'));
                                }
                            }                        
                    }
                    
                    this.newTarget();
                }
                return;
            }             
            
            // --- Path decision ---
            this.move.up = this.move.down = this.move.left = this.move.right = false;
            
            // adjust sprite center position
            var sx = (this.x + 16);
            var sy = (this.y + 32);
            var targetX;
            var targetY;
            var checkGoal = false;

            if (this.target.pathpos == this.target.path.length) {
                if (this.target.obj) {
                    targetX = this.target.x + 16;
                    targetY = this.target.y + 16;    
                    checkGoal = true;
                } else {
                    // no carrot to pick up
                    this.newTarget();
                    return;
                }
            } else {
                // find destination tile center
                var gx = this.target.path[this.target.pathpos].pos.y;
                var gy = this.target.path[this.target.pathpos].pos.x;
                targetX = gx * this.tileMap.get('tileSize') + 32;
                targetY = gy * this.tileMap.get('tileSize') + 32;
                
                var dsx = (targetX - sx);
                var dsy = (targetY - sy);
                var fdist = (dsx * dsx + dsy * dsy);

//                console.log("esx,esy,dist: %d %d %d", dsx, dsy, fdist);
//                var tx = this.x / this.tileMap.get('tileSize');
//                var ty = this.y / this.tileMap.get('tileSize');
//                console.log('reached %d frm %d, tx, ty: %d, %d / trgx,trgy: %d,%d / trx,try: %d, %d / thisx,thixy: %d, %d / thisTrgX,thisTrgY: %d, %d', 
//                    this.target.pathpos, 
//                    this.target.path.length,
//                    tx, ty, 
//                    gx, gy,
//                    this.target.x,
//                    this.target.y,
//                    this.x,
//                    this.y,
//                    esx,
//                    esy);
    
                // had the destination been reached, go to next tile if so
                if (fdist < 64) {
                    this.target.pathpos += 1;
                }
            }
            
            if (sx < targetX) {
                this.move.right = true;
            } else if (sx > targetX) {
                this.move.left = true;
            }
                
            if (sy < targetY) {
                this.move.down = true;
            } else if (sy > targetY) {
                this.move.up = true;
            }              
            
            // --- Move ---
//            var oldx = this.x;
//            var oldy = this.y;
            var moving = this.move.up || this.move.down || this.move.left || this.move.right;

            if (this.move.up) {
                this.y -= this.speed;
            } 
            if (this.move.down) {
                this.y += this.speed;
            } 
            if (this.move.left) {
                this.x -= this.speed;
            } 
            if (this.move.right) {
                this.x += this.speed;
            }
            
            // --- Animate ---
            
            if (moving) {
                if (this.move.left) {
                    if (!this.isPlaying("walk_left"))
                        this.animate("walk_left", -1);
                } else if (this.move.right) {
                    if (!this.isPlaying("walk_right"))
                        this.animate("walk_right", -1);
                } else if (this.move.up) {
                    if (!this.isPlaying("walk_up"))
                        this.animate("walk_up", -1);
                } else if (this.move.down) {
                    if (!this.isPlaying("walk_down"))
                        this.animate("walk_down", -1);
                }
            } else {
                this.pauseAnimation();
            }
            
            // --- Collisions  --- 
//            
//            var tileHits = this.hit('Layer2Tile');
//            if (tileHits) {
//                // go around
//                var ox = tileHits[0].obj.x;
//                var oy = tileHits[0].obj.y;
//                
//                var newX = oldx, newY = oldy;
//                if (this.move.left || this.move.right) {
//                    newY = this.y + (this.y < oy ? -1 : 1);
//                }
//                else if (this.move.up || this.move.down) {
//                    newX = this.x + (this.x < ox ? -1 : 1);
//                }
//                
//                //console.log('setting x:' + newX + ' y: ' + newY);
//                this.attr({x: newX, y: newY});
//                return;
//            }
            
//            if (this._x > Crafty.viewport.width || this._x < -32
//            || this._y > Crafty.viewport.height || this._y < -32) {
//                
//            }

            // determine sprite Z-index 
            this.attr({z: this.y + model.get('sprite-z')});
            
            // --- Target ---
            
            // nearby carrot -> rise extracting flag
            if (checkGoal) {
                var dx = sx - this.target.x + 16;
                var dy = sy - this.target.y + 16;
                var dist = (dx * dx + dy * dy);
                // console.log("dist: %d", dist);
                
                if (dist <= 2048) {
                    var hits = this.hit('carrot');
                    
                    // check if we actually are on a carrot
                    if (!hits) {
                        // DEBUG
                        if (_Globals.conf.get('debug')) {
                            console.log('not hit! dist: %d / target: %d', dist, this.target.obj != undefined);
                            console.log("target-dist: %d, my-xy: %d,%d / target-xy: %d,%d", dist, sx, sy, 
                                this.target.x + 16, this.target.y + 16);                    
                        }
                            
                        this.newTarget();
                        return;
                    }
                        
                    // we are pulling the first found
                    var obj = hits[0].obj;
                    
                    // TRACE
                    if (_Globals.conf.get('trace'))
                        console.log('Enemy: %d has reached %d', this[0], obj[0]);
                    
    //                if (obj.occupied) {
    //                    this.newTarget();
    //                } else {
                        
                        // TRACE
                        if (_Globals.conf.get('trace'))
                            console.log("Enemy: carrot %d hit & occupied!", obj[0]);
                            
    //                    obj.occupied = true;
                        this.digCarrot.obj = obj;
                        this.digCarrot.canPull = true;
    //                }
                } else {
                    this.digCarrot.canPull = false;
                    this.digCarrot.obj = undefined;
                }
            }
        })
        // Push back effect when player uses Push magic
        .bind("PushBack", function(playerPos) {
            
            // TRACE
            if (_Globals.conf.get('trace'))
                console.log("Enemy: %d is pushed back", this[0]);
            
            var newX = this.x;
            var newY = this.y;
            var cx = this.x + model.get('spriteHalfWidth'), 
                cy = this.y + model.get('spriteHalfHeight');
            var amount = playerPos.amount;
            
            if (this.move.up && playerPos.y < this.y) {
                newY += amount;
            } else if (this.move.up && playerPos.y > cy) {
                newY -= amount;
            } else if (this.move.down && playerPos.y < cy) {
                newY += amount;
            } else if (this.move.down && playerPos.y > cy) {
                newY -= amount;
            }
            
            if (this.move.left && playerPos.x < cx) {
                newX += amount;
            } else if (this.move.left && playerPos.x > cx) {
                newX -= amount;
            } if (this.move.right && playerPos.x < cx) {
                newX += amount;
            } if (this.move.right && playerPos.x > cx) {
                newX -= amount;
            }

            var newPos = this.tileMap.spawnAtPx(newX, newY);
            this.attr({x: newPos.x, y: newPos.y});
            
            // flag that pushed occured
            this.pushedProps.pushed = true;
            this.pushedProps.atFrame = undefined; //Crafty.frame.frame + model.get('pushCooldown');
            this.pauseAnimation();
        })
        .bind("ForkBeacon", function(where) {
            // TRACE
            if (_Globals.conf.get('trace'))
                console.log("Enemy: %d is forked", this[0]);
                
            this.target.x = where.x;
            this.target.y = where.y;
            this.target.path = this.tileMap.getPathToTilePx(
                {x: this.x, y: this.y}, {x: this.target.x, y: this.target.y});            
            this.target.pathpos = 0;
        })
        // define player collision properties
        .collision(
            [2, 32], 
            [30, 32], 
            [30, 48], 
            [2, 48]
        );
        
        // bind to object
        model.set({'entity' : entity });
    }
});