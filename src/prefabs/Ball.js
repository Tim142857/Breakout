import Phaser from 'phaser'

class Ball extends Phaser.Sprite{

  constructor(game, x, y, isFireBall){
    let spriteImg = isFireBall ? 'fireBall' : 'ball';
    super(game, x, y, spriteImg)

    this.game.physics.arcade.enableBody(this);

    this.checkWorldBounds = true;

    this.body.collideWorldBounds = true;

    this.body.bounce.set(1);
    this.isFireBall = isFireBall;

  }

  update(){

      // console.log(this.centerX)
  }
}

export default Ball
