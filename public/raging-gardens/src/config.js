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
Config = Backbone.Model.extend({
    defaults: {
        'trace' : false,
        'debug' : false,
        'showfps': false,
        'renderType' : 'Canvas',
        'screen-width' : 1024,
        'screen-height' : 768,
        'mobile': false,
        'tid': '15884',
        
        // media
        'sfx': true,
        'sfx_vol': 0.4,
        'music': true,
        'music_vol': 0.3,
        
        // gameplay
        'gameTimeLimit': 180 * 1000, // 3 mins
        'gameTurnPeriod': 30 * 1000, // every 30 seconds
        'gameTickPeriod': 1 * 1000, 
        
        'enemiesPerTurn': 2,
        'startEnemiesCount': 4, // start with 2 enemies
        'maxEnemiesToSpawn': 16, // through the whole game

//        'startEnemiesCount': 2, // start with 2 enemies
//        'maxEnemiesToSpawn': 1, // through the whole game

        'carrotsPerTurn': 1,
        'startCarrotsCount' : 4, // start with 2 carrots
//        'startCarrotsCount' : 8, // start with 3 carrots
        'maxCarrotsToSpawn': 11, // through the whole game
        
        // player props
        'defaultCarrots': 0,
        'carrotsCollect': 2,
        'carrotsPushCost': 1,
        'carrotsForkCost': 2,        
    },
    initialize: function() {
        //var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
        // if (is_chrome) {
        //     this.set('renderType', 'Canvas');
        // }
        //if (this.get('debug')) {
        //    console.log("Using %s rendering ...", this.get('renderType'));
        //}
        // Detect mobile browsers
        if (Modernizr.touch) {
            this.set('mobile', true);
            this.set('screen-width', 960);
            this.set('screen-height', 704);
            this.set('renderType', 'Canvas');
            var $canvas = $('#stage');
            var x = $(window).width() / 2 - this.get('screen-width') / 2;
//          //var y = $(windows).height() / 2 - this.get('screen-height') / 2;
            $canvas.css({
                 position: 'absolute',
                 width: this.get('screen-width'),
                 height: this.get('screen-height'),
                 left: x,
                 top: 0
               });
        }
    }
});