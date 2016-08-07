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
Crafty.scene("main", function() {
    var tilemap = new Tilemap();
    var player = new Player({'tileMap': tilemap});
    
    if (!_Globals.conf.get('mobile')) {
        $("#left-frame").show();
        $("#right-frame").show();
        $("#bottom-frame").show();
    }

    $('.safari').hide();
    $("#stats").show();    
    $("#in-menu").show();
    
    // display active FPS (only in DEBUG mode)
    if (_Globals.conf.get('debug') || _Globals.conf.get('showfps')) {
        Crafty.e("2D, " + _Globals.conf.get('renderType') + ", FPS").attr({maxValues:10}).bind("MessureFPS", function(fps) {
            $('#fps').text('FPS: ' + fps.value);
        });
        $("#fps").show();
    }
    
    // mute sfx 
    // TODO: Rework this!
    var mutedSfx = false;
    $("#toggle-sfx").click(function() {
        Crafty.audio.toggleMute();
        mutedSfx = !mutedSfx;
        if (mutedSfx) {
            $('#toggle-sfx').css("background-image", "url('art/sound_off-05.png')"); 
        } else {
            $('#toggle-sfx').css("background-image", "url('art/sound_on-05.png')"); 
        }
    });

    // mute music
    var mutedMusic = false;
    $("#toggle-music").click(function() {
        mutedMusic = !mutedMusic;
        if (mutedMusic) {
            Crafty.audio.stop('music');
            $('#toggle-music').css("background-image", "url('art/sound_off.png')"); 
        } else {
            Crafty.audio.play("music", -1, _Globals.conf.get('music_vol'));
            $('#toggle-music').css("background-image", "url('art/sound_on.png')"); 
        }
//        Crafty.pause();
//        
//        $("#dialog-restart").dialog({
//            resizable: false,
//            "width": 400,
//            "height": 180,
//            modal: true,
//            "title": "Restart Game",
//            buttons: {
//                "Yes": function() {
//                    // TODO: Cheap! :( Must replace with proper restart.
//                    window.location.reload()                     
//                },
//                "No": function() {
//                    $(this).dialog("close");
//                }
//            },
//            close: function(event, ui) {
//                Crafty.pause();
//            }  
//        });
    });
    
    if (_Globals.conf.get('music')) {
        Crafty.audio.play("music", -1, _Globals.conf.get('music_vol'));
    }
    
    /**
     * Triggers to update various game states
     */
     
    // UpdateStats Event - score, carrots
    Crafty.bind("UpdateStats",function() {
        $('#carrots').text(player.get('carrotsCount'));
    });
    
    // Show in-game message
    Crafty.bind("ShowMsg", function(msg) {
        $('#msgs').stop(true);
        $('#msgs').css('opacity', '1.0');
        $('#msgs').css('fontSize', '26px');
        $('#msgs').text('');
        
        if (msg == 'carrots') {
            //$('#msgs').css('color','#aa0000');
            $('#msgs').text('You have no carrots to eat!');
        } else if (msg == 'clear') {
            $('#msgs').text('');
            return;
        }
        
        $('#msgs').fadeTo(800, 0);
        
        // damn, this is slow
//        $("#msgs").animate({
//           // fontSize: "10%",
//            opacity: 0.125,
//          }, 1800, function() {
//              $("#msgs").text('');
//          });
    });
    
    
    /**
     * Game Loop
     */
    
    var currentEnemies = 0;
    var maxEnemies = _Globals.conf.get('startEnemiesCount');
    tilemap.set('maxCarrots', _Globals.conf.get('startCarrotsCount'));
    
    var gameTick = 0;
    var gameTimeLeft = Date.now() + _Globals.conf.get('gameTimeLimit'); 
    var gameTurnTimeLeft = Date.now() + _Globals.conf.get('gameTurnPeriod'); 
    
    var onEnterFrame = function(frame) {
        var currentTime = Date.now();
        if (gameTimeLeft < currentTime) {
            Crafty.unbind('EnterFrame');
            Crafty.stop();
            //Crafty.trigger("ShowHiscore", {text: undefined, refresh: true}); 
            Crafty.trigger('ShowSaveHiscore', player.get('carrotsCount'));
        } else {
            // --- time left
            var leftTime = (gameTimeLeft - currentTime) / 1000;
            var leftMin = Math.floor(leftTime / 60);
            var leftSec = leftTime % 60;
            
            var mins = leftMin.toFixed(0);
            mins = mins < 10 ? '0' + mins : mins;
            var sec = leftSec.toFixed(0);
            sec = sec < 10 ? '0' + sec : sec;
            $('#timer').text(mins + ':' + sec);
        }
        
        // --- game logic
        var currentTime = Date.now();
        
        // game turn passed ?
        if (currentTime > gameTurnTimeLeft) {
            gameTurnTimeLeft = Date.now() + _Globals.conf.get('gameTurnPeriod'); 
            
            if (tilemap.get('maxCarrots') < _Globals.conf.get('maxCarrotsToSpawn')) {
                tilemap.set('maxCarrots', 
                    tilemap.get('maxCarrots') + _Globals.conf.get('carrotsPerTurn'));
            }
            
            maxEnemies += _Globals.conf.get('enemiesPerTurn');
            maxEnemies = maxEnemies > _Globals.conf.get('maxEnemiesToSpawn') 
                ? _Globals.conf.get('maxEnemiesToSpawn') : maxEnemies;
            
            // DEBUG
            if (_Globals.conf.get('debug')) {
                console.log('Turn passed! New limites carrots: %d, enemies: %d', 
                    tilemap.get('maxCarrots'),
                    maxEnemies);
            }
        }
        
        if (currentTime > gameTick) {
            tilemap.spawnCarrot();
            
            if (currentEnemies < maxEnemies) {
                new Enemy({'tileMap': tilemap, 'player': player});
                currentEnemies++;
            }
            
            gameTick = Date.now() + _Globals.conf.get('gameTickPeriod');
        }
    };
    Crafty.bind("EnterFrame", onEnterFrame);
    Crafty.trigger("UpdateStats");
});