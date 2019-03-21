
import Phaser from 'phaser'
import lang from '../lang'
import Brick from '../prefabs/Brick'
import Paddle from '../prefabs/Paddle'
import Ball from '../prefabs/Ball'
import Bonus from '../prefabs/Bonus'
import Grid from '../prefabs/Grid'
import _ from 'lodash'
import { cookies } from '../utils'

export default class extends Phaser.State {
  constructor(){
    super()

    this.ballOnPaddle = true
  }

  init() { }
  preload() { }

  create() {
    this.game.physics.arcade.checkCollision.down = false
    this.setUpText();
    this.setUpBricks();
    this.setUpPaddle();
    // this.setUpBall();
    this.setUpBalls();
    this.setUpBonus();
    this.setUpExtraBalls();

    this.game.input.onDown.add(this.releaseBall, this)

  }

  releaseBall(){

    if(!this.ballOnPaddle) return

    this.ballOnPaddle = false;

    this.balls.getFirstAlive().body.velocity.y = this.game.global.defaultVelocityY + this.game.global.defaultVelocityY * this.game.global.level / 5
    this.balls.getFirstAlive().body.velocity.x = this.game.global.defaultVelocityX + this.game.global.defaultVelocityX * this.game.global.level / 5
  }

  setUpBall(){
    this.ball = new Ball(
      this.game,
      this.game.world.centerX,
      this.game.world.height - 100
    )
    this.putBallOnPaddle()
    this.game.add.existing(this.ball)
    this.ball.events.onOutOfBounds.add(this.ballLost, this)
  }

  setUpFirstBall(){
    this.addBall(
      this.game.world.centerX,
      this.game.world.height - 100
    )
    this.putBallOnPaddle()
  }

  setUpBalls(){
    this.balls = this.game.add.group()
    this.setUpFirstBall();
  }

  ballLost(ball){
    //Check if that was the last alive ball
    if(this.balls.countLiving() <= 1){
      --this.game.global.lives
      if(this.game.global.lives <= 0){
        //end the game
        this.endGame()
        return
      }
      ball.kill();
      this.setUpFirstBall();
      this.livesText.text = `Lives: ${this.game.global.lives}`
      // this.putBallOnPaddle()
    } else {
      ball.kill();
    }

  }

  putBallOnPaddle(){
    this.ballOnPaddle = true;
    this.balls.getFirstAlive().reset(this.paddle.body.x, this.paddle.y - (this.paddle.height +10));
  }

  endGame(){
    this.game.state.start('GameOver')
  }

  setUpPaddle(){
    this.paddle= new Paddle(
      this.game,
      this.game.world.centerX,
      this.game.world.height - 50
    )

    this.game.add.existing(this.paddle)
  }

  setUpBricks(){
    // group = to apply propertie to all from same things
    this.bricks = this.game.add.group()
    this.generateBricks(this.bricks);
  }

  setUpBonus(){
    this.bonus = this.game.add.group()
  }

  setUpExtraBalls(){
    this.extraBalls = this.game.add.group()
  }


  //Genere l'ensemble des objets sprite Bricks et ajout à game.bricks
  generateBricks(bricksGroup){
    let rows = this.game.global.defaultRows + this.game.global.level;
    let columns = this.game.global.defaultColumns + this.game.global.level;
    rows = rows > 14 ? 14 : rows;
    columns = columns > 14 ? 14 : columns;
    let xOffset = 65;
    let yOffset = 28;
    let brick;
    let marginTop = 80 - 10 * this.game.global.level;
    marginTop = marginTop < 20 ? 20 : marginTop


    for(let y = 0; y < rows; y++){
      for(let x = 0; x < columns; x++){
        let level = 1;
        if(this.game.global.level > 2){
          for(var i = 0; i < this.game.global.level; i++){
            if(Math.random() > 0.92) level ++;
          }
        }

        brick = new Brick(
          this.game,
          x * xOffset,
          y * yOffset + marginTop,
          level
        )
        bricksGroup.add(brick);
      }
    }

    //calcul from total width of the bricks
    let bricksGroupWidth = ((xOffset * columns) - (xOffset - brick.width)) / 2;
    bricksGroup.position.setTo(
      this.game.world.centerX - bricksGroupWidth,
      this.game.world.centerY - 200
    )

  }

  setUpText(){
    this.scoreText = this.createText(0, 10, `Score: ${this.game.global.score}`, {font: '18px Arial', fill: '#000', boundsAlignH: 'left'})
    this.livesText = this.createText(0, 10, `Lives: ${this.game.global.lives}`, {font: '18px Arial', fill: '#000', boundsAlignH: 'center'})
    this.levelText = this.createText(0, 10, `Level: ${this.game.global.level}`, {font: '18px Arial', fill: '#000', boundsAlignH: 'right'})
  }

  createText(xOffest, yOffest, text, style) {
    let textDone = this.game.add.text(
      xOffest,
      yOffest,
      text,
      style
    )
    textDone.setTextBounds(0, 0, this.game.world.width, 10)
    return textDone
  }

  update(){
    if(this.ballOnPaddle){
      this.balls.getFirstAlive().body.x = this.paddle.x - (this.balls.getFirstAlive().width / 2)
    }

    //Collision between balls and paddle
    this.game.physics.arcade.collide(
      this.balls,
      this.paddle,
      this.ballHitPaddle,
      null,
      this
    )

    //Collision between balls and bricks
    this.game.physics.arcade.collide(
      this.balls,
      this.bricks,
      this.ballHitBrick,
      function(ball, brick) {
        if(ball.isFireBall){
          this.breakBrick(brick);
          return false;
        }
        return true;
      },
      this
    )

    //Collision between bonus and Paddle
    this.game.physics.arcade.collide(
      this.bonus,
      this.paddle,
      this.bonusWon,
      null,
      this
    )

    //Collision between bonus and other components
    this.game.physics.arcade.collide(
      this.bonus,
      [this.bricks, this.balls],
      null,
      () => false,
      this
    )


  }

  //listenever event collide ball/paddle
  ballHitPaddle(ball, paddle){
    console.log('------------------------')
    console.log('ball.x', ball.centerX)
    console.log('paddle.x', paddle.centerX)
    let diff = 0;
    if(ball.centerX < paddle.centerX) {
      diff = paddle.centerX - ball.centerX
      let oldVelocity = ball.body.velocity.x
      ball.body.velocity.x = (-10 * diff)
      console.log('balle a droite')
      console.log('diff', diff);
      console.log('oldVelocity', oldVelocity)
      console.log('newVelocity', ball.body.velocity.x)
      return
    }
    if(ball.centerX > paddle.centerX) {
      diff = ball.centerX - paddle.centerX
      let oldVelocity = ball.body.velocity.x
      ball.body.velocity.x = 10 * diff
      console.log('balle a gauche')
      console.log('diff', diff);
      console.log('oldVelocity', oldVelocity)
      console.log('newVelocity', ball.body.velocity.x)
    }
  }

  bonusHitWorld(bonus){
    bonus.kill();
  }

  getBonus(brick) {

    let rdm = Math.floor(Math.random() * 100 + 1)
    let bonus = this.chooseBonus()

    if(bonus) this.setBonus(bonus, brick.body.x, brick.body.y)
    //+ grand Paddle
    //vie getBonus
    //1 ou plusieurs cases dértuites
    //balle XXL
    //+ de balles simultanées
    //

    //Effets négatifs
    //geler le paddle adverse
    //brick mine quio reconstruit les briques autour d'elle cassable que par fireball
    //balle accelerante

    //bonus briques speciales
    //cases briques autour(diag, hauteur, largeur)
  }

  setBonus(type, x, y){
    let bonus = new Bonus(
      this.game,
      x,
      y,
      type
    )
    bonus.body.velocity.y = 120
    bonus.events.onOutOfBounds.add(this.bonusLost, this)
    this.bonus.add(bonus)
  }

  bonusLost(bonus){
    bonus.kill()
  }

  chooseBonus(){
    let rdm = Math.floor(Math.random() * 100 + 1)
    if(rdm < 2) return 'bonusLife'
    if(rdm < 5) return 'bonusMaxPaddle'
    if(rdm < 8) return 'bonusExtraBalls'
    if(rdm < 11) return 'bonusFireBall'
    return null
  }

  bonusWon(paddle, bonus){
    switch(bonus.name){
      case 'bonusLife':
      this.game.global.lives += 1;
      this.livesText.text = `Lives: ${this.game.global.lives}`
      break;
      case 'bonusMaxPaddle':
      this.paddle.width += 50
      this.game.time.events.add(Phaser.Timer.SECOND * 5, function(){
        this.paddle.width -= 50
      }, this);
      break;
      case 'bonusExtraBalls':
      for(var i = 0; i < 3; i++){
        this.addBall(
          this.game.world.centerX,
          this.game.world.height - 400,
          Math.floor(Math.random() * 200 + 20) * (-1),
          Math.floor(Math.random() * 400 + 20) * (-1)
        );
      }
      break;
      case 'bonusFireBall':
      this.convertToFireBalls();
      break;
      default:
      break;
    }
    this.displayBonusWon(bonus.name);
    bonus.kill()
  }

  displayBonusWon(bonusName){
    let text;
    switch(bonusName){
      case 'bonusLife':
      text = "+1 vie";
      break;
      case 'bonusMaxPaddle':
      text = "5s maxi paddle"
      break;
      case 'bonusExtraBalls':
      text = "+3 balls"
      break;
      case 'bonusFireBall':
      text = "4s fire ball"
      break;
      default:
      break;
    }
    this.setFlashBag(text);
  }

  ballHitBrick(ball, brick){
    // console.log('ballHitBrick');
    // console.log('ball.body.velocity.x', ball.body.velocity.x)
    this.breakBrick(brick);
  }

  render() {
  }

  setFlashBag(msg){
    let text = this.createText(0, 250, msg, {font: '24px Arial', fill: '#000', boundsAlignH: 'center'})
    this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){
      this.game.add.tween(text).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
    }, this);
  }

  addBall(x, y, velX, velY, isFireBall){
    if(!x) x = this.game.world.centerX
    if(!y) x = this.game.world.height - 300
    if(!velX) velX = 0
    if(!velY) velY = 0
    if(!isFireBall) isFireBall = false;
    let extraBall = new Ball(
      this.game,
      x,
      y,
      isFireBall
    )
    extraBall.body.velocity.y = velY
    extraBall.body.velocity.x = velX
    extraBall.events.onOutOfBounds.add(this.ballLost, this)
    this.balls.add(extraBall)
  }

  initNextLevel(){
    this.balls.forEachAlive(function(elm){ elm.kill() })
    this.setUpFirstBall();
    this.game.global.level += 1
    this.levelText.text = `Level: ${this.game.global.level}`
    this.putBallOnPaddle();

    this.generateBricks(this.bricks)
  }

  convertToFireBalls(){
    this.balls.forEachAlive(function(elm){
      elm.isFireBall = true;
      elm.loadTexture('fireBall')
    })
    this.game.time.events.add(Phaser.Timer.SECOND * 4, function(){
      this.balls.forEachAlive(function(elm){
        elm.isFireBall = false;
        elm.loadTexture('ball')
      })
    }, this);

  }

  breakBrick(brick){
    if(brick.level != 1){
      --brick.level
      brick.loadTexture('brick' + brick.level, 0)
    } else {
      this.getBonus(brick)
      brick.kill();
      if(this.bricks.countLiving() <= 0) {
        this.initNextLevel()
      }
    }
    this.game.global.score += 10
    this.scoreText.text = `Score: ${this.game.global.score}`
  }
}
