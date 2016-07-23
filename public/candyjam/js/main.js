
var width = 1024;
var height = 768;

var game = new Phaser.Game(width, height, Phaser.CANVAS, 'phaser-div');

game.state.add('Boot', MainGame.BootState);
game.state.add('Loader', MainGame.LoaderState);
game.state.add('MainMenu', MainGame.MainMenuState);
game.state.add('Game', MainGame.GameState);
game.state.add('GameOver', MainGame.GameOverState);

CollisionManager = new CollisionManager(game);
InputManager = new InputManager(game);
InventoryManager = new InventoryManager(game);
GUIManager = new GUIManager(game);
WaveManager = new WaveManager(game);

document.addEventListener("mousewheel", function(e){ InputManager.handleMouseWheel(e); }, false);

game.state.start('Boot');

window.game = game;