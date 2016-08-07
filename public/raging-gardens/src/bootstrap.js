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

require(["../web/raging-gardens/src/traps.js", "../web/raging-gardens/src/config.js", "../web/raging-gardens/src/actor_object.js", "../web/raging-gardens/src/hiscore.js"], function() {
    var isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    /**
     * Global Registry
     */
    _Globals['conf'] = new Config({});

    $("#stats").hide();

    var hiscore = new Hiscore();
    hiscore.open();
    _Globals['hiscore'] = hiscore;

    /**
     * Init Crafty Engine
     */
    var screen = document.getElementById('stage');
    Crafty.init(_Globals.conf.get('screen-width'), _Globals.conf.get('screen-height'), screen);
    // Crafty.viewport.init(_Globals.conf.get('screen-width'), _Globals.conf.get('screen-height'), screen);
    Crafty.settings.modify('autoPause', true);
    Crafty.background('transparent');

    /**
     * Load assets
     */
    Crafty.scene("loading", function() {
        Crafty.paths({ audio: "../web/raging-gardens/sfx/", images: "../web/raging-gardens/art/" });
        var assets = {
            images: ['stuz_splash.png'],
            sprites: {
                'stuz_tiles.png': {
                    tile: 64,
                    tileh: 64,
                    map: {
                        grass: [0,0],
                        stone_small: [1,0],
                        stone_big: [2,0],
                        heysack: [3,0],
                        tree: [0,1],
                        bush: [1,1],
                        barrel: [2,1]
                    }
                },
                'stuz_rabbit.png': {
                    tile: 32,
                    tileh: 48,
                    map: {
                        player: [0, 0]
                    }
                },
                'stuz_enemy.png': {
                    tile: 32,
                    tileh: 48,
                    map: {
                        enemy: [0, 0]
                    }
                },
                'stuz_fart_moving.png': {
                    tile: 64,
                    tileh: 64,
                    map: {
                        explosion1: [0, 0]
                    }
                },
                'stuz_carrots.png': {
                    tile: 32,
                    tileh: 32,
                    map: {
                        carrot: [0, 0]
                    }
                },
                'stuz_forkit.png': {
                    tile: 48,
                    tileh: 48,
                    map: {
                        fork: [0, 0]
                    }
                }
            },
            audio: {
                fart1: ["fart1.ogg"],
                fart2: ["fart2.ogg"],
                pull: ["pull.ogg"],
                scream1: ["scream1.ogg"],
                scream2: ["scream2.ogg"],
                aaaah: ["aaaah.ogg"],
                laughter1: ["laughter01.ogg"],
                laughter2: ["laughter02.ogg"],
                burp: ["burp.ogg"],
                music: ["trouble_in_the_garden_lowq.ogg"],
            }
        };
        if (isSafari) {
            assets.audio = {};
        }
        Crafty.load(assets, function() {
            Crafty.scene(_Globals['scene']);
            // disable loading
            $('#loading').hide();
        },
        // On Progress
        function(e) {
            $('#loading').html('Loaded: ' + e.percent.toFixed(0) + '%');
        },
        // On Error
        function(e) {
            $('#loading').html('Could not load: ' + e.src);
            if (_Globals.conf.get('debug'))
                console.error(e);
        });
        $('#loading').show();
    });

    /**
     * Load required scenes and game data
     */
    require([
        "../web/raging-gardens/src/actor_object.js",
        "../web/raging-gardens/src/tilemap.js",
        "../web/raging-gardens/src/player.js",
        "../web/raging-gardens/src/enemy.js",
        "../web/raging-gardens/src/scene.splash.js",
        "../web/raging-gardens/src/scene.game.js",
        "../web/raging-gardens/src/gfx.js",
    ], function() {
        Crafty.scene("loading");
    });
});
