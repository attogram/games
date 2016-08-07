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
 
Crafty.c("LeftControls", {
    init: function() {
        this.requires('Multiway');
    },
    leftControls: function(speed) {
        this.multiway(speed, {UP_ARROW: -90, DOWN_ARROW: 90, RIGHT_ARROW: 0, LEFT_ARROW: 180})
        return this;
    }
});

/**
 * Component that initilizes player animation tweets
 */
Crafty.c('Dude', {
    Dude: function() {
        //setup animations
        var animSpeed = 300;
        this.requires("SpriteAnimation, Collision, Grid")
        .reel("walk_left", animSpeed, [ [0, 2], [1, 2], [2, 2] ])
        .reel("walk_right", animSpeed, [ [0, 3], [1, 3], [2, 3] ])
        .reel("walk_up", animSpeed, [ [0, 1], [1, 1], [2, 1] ])
        .reel("walk_down", animSpeed, [ [0, 0], [1, 0], [2, 0] ])
        return this;
    }
});

/**
 * Creates and handles all Player properties and actions - appearance, movement, score.
 */
Player = ActorObject.extend({
    defaults: {
        // references
        'tileMap': undefined,
        
        // behavior
        'speed': 2,
        'pullSpeed': 2,
        'pushDistance': 64 * 64, // 64px distance
        'pushRepelAmount': 25,
        'pullID': undefined,
        
        // gfx properties
        'spriteHeight': 48,
        'spriteHalfHeight': 24,
        'spriteHalfWidth': 16,
        'z-index': 10,
        
        // scores
        'carrotsCount': _Globals.conf.get('defaultCarrots'),
    },
    initialize: function() {
        var model = this;
        
        model.set('sprite-z', model.get('spriteHeight') + model.get('z-index'));
        var keyState = {none: 0, down: 1, up: 2};
        
        // generate player position
        var spawnPos = model.get('tileMap').spawnAtCentre();
            
        // init player entity
        var entity = Crafty.e("2D, " + _Globals.conf.get('renderType') + ", Dude, player, LeftControls")
        .attr({
            move: {left: false, right: false, up: false, down: false},
            digCarrot: {canPull: false, obj: undefined},
            pullBars: {red: undefined, green: undefined},
            actions: {action1: keyState.none, action2: keyState.none},
            x: spawnPos.x, y: spawnPos.y, z: model.get('sprite-z'),
            walk_start_frame: null,
            speed: model.get('speed')
        })
        .Dude()
        // movement
        .bind("KeyDown", function(e) {
            if (e.keyCode === Crafty.keys.RIGHT_ARROW) {
                this.move.right = true;
            } else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
                this.move.left = true;
            } else if(e.keyCode === Crafty.keys.UP_ARROW) {
                this.move.up = true;            
            } else if(e.keyCode === Crafty.keys.DOWN_ARROW) { 
                this.move.down = true;
            } else if (e.keyCode === Crafty.keys.Z || e.keyCode === Crafty.keys.Y) {
                this.actions.action1 = keyState.down;
            }
            
            //this.preventTypeaheadFind(e);
        })
        .bind("KeyUp", function(e) {
            if (e.keyCode === Crafty.keys.RIGHT_ARROW) {
                this.move.right = false;
            } else if(e.keyCode === Crafty.keys.LEFT_ARROW) {
                this.move.left = false;
            } else if(e.keyCode === Crafty.keys.UP_ARROW) {
                this.move.up = false;            
            } else if(e.keyCode === Crafty.keys.DOWN_ARROW) { 
                this.move.down = false;
            } else if (e.keyCode === Crafty.keys.Z || e.keyCode === Crafty.keys.Y) {
                this.actions.action1 = keyState.up;
            } else if (e.keyCode === Crafty.keys.Q) {
                this.trigger("PushEnemies");
            } else if (e.keyCode === Crafty.keys.W) {
                this.trigger("ForkEnemies");
            }
            
            //this.preventTypeaheadFind(e);
        })
        // updates
        .bind("EnterFrame", function(frame) {
            
            var oldx = this.x;
            var oldy = this.y;
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
            
            // --- determine which animation to show depending on the angle of movement
            
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
                
//                // play walk sound
//                if (_Globals.conf.get('sfx')) {
//                    if (!this.walk_start_frame) {
//                        Crafty.audio.play("walking", 1, _Globals.conf.get('sfx_vol'));
//                        this.walk_start_frame = frame.frame + 60;
//                    }
//                    if (this.walk_start_frame && this.walk_start_frame < frame.frame) {
//                        this.walk_start_frame = null;
//                    }
//                }                
            } else {
                this.pauseAnimation();
            }
            
            // --- Pull ---
            
            if (this.digCarrot.canPull) {
                this.trigger("UpdatePullBar", this.digCarrot.obj.health);
                
                if (this.actions.action1 === keyState.down) {
                    // pull, only if the carrot is still around
                    if (this.digCarrot.obj && !this.digCarrot.obj.pulled) { 
                        this.digCarrot.obj.health -= model.get('pullSpeed');
                        
    //                    if (_Globals.conf.get('trace'))
    //                        console.log('Player: extracting ...' + this.digCarrot.obj.health);
                        
                        // if pulled, simply destroy entity, the hit check should determine if we
                        // are about to pull another one or not
                        if (this.digCarrot.obj.health <= 0) {
                            this.actions.action1 = keyState.none; // reset
                            model.set('carrotsCount', 
                                model.get('carrotsCount') + _Globals.conf.get('carrotsCollect'));
                            
                            this.digCarrot.obj.pulled = true;
                            this.digCarrot.obj.destroy();
                            this.digCarrot.canPull = false;
                            
                            this.trigger('HidePullBar');
                            Crafty.trigger("UpdateStats");
                            Crafty.trigger('ShowMsg', 'clear');
                            
                            // play sound
                            if (_Globals.conf.get('sfx')) {
                                Crafty.audio.play("pull", 1, _Globals.conf.get('sfx_vol'));
                            }                        
                            
                            model.set('pullID', undefined);
                        }
                    }
                }
            }            
            
            // --- check for collisions --- 
            if (this.hit('Layer2Tile') 
                || this.x + 32 > Crafty.viewport.width || this.x < 0 
                || this.y + 32 > Crafty.viewport.height || this.y < -16) {
                    
                if (_Globals.conf.get('trace'))
                    console.log("Player: Hit object or wall");
                
                this.attr({x: oldx, y: oldy});
                return;
            }
            
            // nearby carrot -> rise extracting flag
            var hits = this.hit('carrot');
            if (hits) {
                if (!this.digCarrot.canPull) {
                    // we are pulling the first found
                    this.digCarrot.canPull = true;
                    this.digCarrot.obj = hits[0].obj;
                    
                    // remember which player's on
                    model.set('pullID', this.digCarrot.obj[0]);
                    
                    this.trigger('ShowPullBar', this.digCarrot.obj);
                }
            } else if (this.digCarrot.canPull) {
                this.digCarrot.canPull = false;
                this.digCarrot.obj = undefined;
                model.set('pullID', undefined);
                
                this.trigger('HidePullBar');
            }
            
            // determine sprite Z-index
            this.attr({z: this.y + model.get('sprite-z')});
        })
        // push back, all enemies within the push range 
        .bind("PushEnemies", function() {
            if (!model.eatCarrots(_Globals.conf.get('carrotsPushCost'))) {
                return;
            }   
                
            var enemies = Crafty('Enemy');
            if (enemies && enemies.length > 0) {
                // player sprite center
                var plrX = this.x + model.get('spriteHalfWidth');
                var plrY = this.y + model.get('spriteHalfHeight');
                
                // play anim
                Crafty.e("MagicPush").MagicPush({x: plrX, y: plrY});
                // play sound
                if (_Globals.conf.get('sfx')) {
                    if (Date.now() % 2 == 0) {
                        Crafty.audio.play("fart1", 1, _Globals.conf.get('sfx_vol'));
                    } else {
                        Crafty.audio.play("fart2", 1, _Globals.conf.get('sfx_vol'));
                    }
                }
                
                _.each(enemies, function(enemyObj) { 
                    var obj = Crafty(enemyObj);
                    var dx = obj.x - plrX;
                    var dy = obj.y - plrY;
                    var dist = (dx * dx + dy * dy);
                    // console.log("about to push %d/%d, Exy: %d, %d Oxy: %d, %d" , 
                    //    dist, model.get('pushDistance'), obj.x, obj.y, plrX, plrY);
                    if (dist < model.get('pushDistance')) {
                        var d = {amount: model.get('pushRepelAmount'), x: plrX, y: plrY};
                        obj.trigger("PushBack", d);
                        
                        // play sound
                        if (_Globals.conf.get('sfx')) {
                            if (Date.now() % 2 == 0) {
                                Crafty.audio.play("scream1", 1, _Globals.conf.get('sfx_vol'));
                            } else {
                                Crafty.audio.play("scream2", 1, _Globals.conf.get('sfx_vol'));
                            }            
                        }
                        
                    }
                });                
            }
        })
        // push back, all enemies within the push range 
        .bind("ForkEnemies", function() {
            if (Crafty('MagicFork').length > 0) {
                // only 1 magic fork permitted
                return;
            }
            
            if (!model.eatCarrots(_Globals.conf.get('carrotsForkCost'))) {
                return;
            }
            
            if (_Globals.conf.get('sfx'))
                Crafty.audio.play("aaaah", 1, _Globals.conf.get('sfx_vol'));
            
            var enemies = Crafty('Enemy');
            if (enemies && enemies.length > 0) {
                // player sprite center
                var where = {x: this.x + model.get('spriteHalfWidth'), 
                    y: this.y + model.get('spriteHalfHeight')};
                
                // create object and anim
                Crafty.e("MagicFork").MagicPush(where)
                    .bind("EnterFrame", function(frame) {
                        if (frame.frame > this._createdOn) {
                            this._anim.pauseAnimation();
                            this._anim.destroy();
                            this.destroy();
                    }
                });    
                // notify enemies that magic is active
                _.each(enemies, function(enemyObj) { 
                    var obj = Crafty(enemyObj);
                    obj.trigger("ForkBeacon", where);
                });                
            }            
        })
        // show bar with how much effort there is to pull a carrot (carrot's health)
        .bind("ShowPullBar", function(carrotObj) {
            this.pullBars.red = Crafty.e("2D, " + _Globals.conf.get('renderType') + ", Color")
                .attr({x: carrotObj.x, y: carrotObj.y - 5, w: 32, h: 5, z: 998})
                .color("#aa0000");
            
            this.pullBars.green = Crafty.e("2D, " + _Globals.conf.get('renderType') + ", Color")
                .attr({x: carrotObj.x, y: carrotObj.y - 5, w: 0.32 * carrotObj.health, h: 5, z: 999})
                .color("#00aa00");            
        })     
        .bind("HidePullBar", function(health) {
            if (this.pullBars.red) {
                this.pullBars.red.destroy();
                this.pullBars.red = undefined;
            }
            if (this.pullBars.green) {
                this.pullBars.green.destroy();
                this.pullBars.green = undefined;
            }
        })   
        .bind("UpdatePullBar", function(health) {
            if (this.pullBars.green && health >= 0) {
                this.pullBars.green.w = 0.32 * health;
            }
        })
        // define player collision properties
        .collision(
            [8, 40], 
            [24, 40], 
            [24, 48], 
            [8, 48]
        );
        
        // bind to object
        model.set({'entity' : entity });
    },
    // substract carrots for magic 
    // (Returns: True|False)
    eatCarrots: function(amount) {
        if (this.get('carrotsCount') < amount) {
            Crafty.trigger('ShowMsg', 'carrots');
            
            // play burp
            if (_Globals.conf.get('sfx')) {
                Crafty.audio.play("burp", 1, _Globals.conf.get('sfx_vol'));
            }
            
            return false;
        }
        
        this.set('carrotsCount', 
                this.get('carrotsCount') - amount);
                
        Crafty.trigger('UpdateStats');
        
        return true;
    }
    
});
