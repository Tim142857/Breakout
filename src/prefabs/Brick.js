import Phaser from 'phaser'

class Brick extends Phaser.Sprite{

  constructor(game, x, y, level){
    let nameSprite = 'brick' + level
    super(game, x, y, nameSprite)

    this.game.physics.arcade.enableBody(this);

    this.body.immovable = true;
    this.level = level

  }
}

export default Brick
