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
 * Play push magic animation
 */
Crafty.c('MagicPush', {
    _anim: undefined,
    MagicPush: function(origin) {
        this._anim = Crafty.e("2D, " + _Globals.conf.get('renderType') + ", explosion1, SpriteAnimation")
            .attr({x: origin.x - 32, y: origin.y - 32, z: 999})
            .reel('go', 450, 0, 0, 8) // setup animation
            .animate("go")
            .bind("AnimationEnd", function() {
                this.destroy();
            });            
        
        return this;
    }
}); 

/**
 * Play fork magic animation
 */
Crafty.c('MagicFork', {
    _anim: undefined,
    _createdOn: undefined,
    _duration: 300,
    MagicPush: function(origin) {
        this._createdOn = Crafty.frame() + this._duration;
        this._anim = Crafty.e("2D, " + _Globals.conf.get('renderType') + ", fork, SpriteAnimation")
            .attr({x: origin.x - 24, y: origin.y - 24, 
                z: 10 + origin.y + 48});
            //.animate('go', 0, 0, 2) // setup animation
            //.animate("go", 15, -1);
            
        return this;
    }
}); 