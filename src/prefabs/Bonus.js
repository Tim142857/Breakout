import Phaser from 'phaser'

class Bonus extends Phaser.Sprite{

  constructor(game, x, y, type){
    super(game, x, y, type)

    this.name = type
    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
    this.checkWorldBounds = true;

  }
}

export default Bonus
