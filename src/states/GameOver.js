import Phaser from 'phaser'
import _ from 'lodash'
import globals from './globals/index'
import { cookies, texts } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {  }

  create () {
    let newHighScore = false;
    let bestScores = JSON.parse(cookies.get('bestScores'))
    if(!bestScores){
      newHighScore = true;
      bestScores = [];
      bestScores.push(this.game.global.score)
      cookies.createOrEdit('bestScores', JSON.stringify(bestScores))
    } else {
      newHighScore =  Math.min(...bestScores) < this.game.global.score;
      bestScores.push(this.game.global.score)
      bestScores.sort((a, b) => a - b);
      console.log('bestScoresBefore',bestScores)
      while(bestScores.length > 5){
        bestScores.shift()
      }
      let cookieVal = JSON.stringify(bestScores);
      cookies.createOrEdit('bestScores', cookieVal)
    }


    let textGameOverContent = `Game Over\n\n`;
    let textNewHighScoreContent = `NEW HIGHSCORE!\n\n`;
    let textScoreContent = `You reached ${this.game.global.level} level with score ${this.game.global.score}`;

    let textGameOver = this.add.text(
      this.game.width * 0.5,
      this.game.height * 0.5,
      textGameOverContent, { font: '24px Arial', fill: '#000', align: 'center' }
    )
    if(newHighScore){
      let textNewHighScore = this.add.text(
        this.game.width * 0.5,
        this.game.height * 0.5 + 60,
        textNewHighScoreContent, { font: '32px Arial', fill: '#000', align: 'center' }
      )
      textNewHighScore.anchor.set(0.5)
      texts.flash(textNewHighScore, 0.5, this)
    }

    let textScore = this.add.text(
      this.game.width * 0.5,
      this.game.height * 0.5 + 85,
      textScoreContent, { font: '24px Arial', fill: '#000', align: 'center' }
    )

    textGameOver.anchor.set(0.5)
    textScore.anchor.set(0.5)

    this.input.onDown.add(this.restartGame, this);
  }

  resetGlobalVariables(){
    this.game.global = _.clone(globals)
  }

  restartGame(){
    this.resetGlobalVariables()
    this.game.state.start('Game')
  }
}
