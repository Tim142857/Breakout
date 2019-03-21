import Phaser from 'phaser'
import _ from 'lodash'
import globals from './globals/index'
import { cookies } from '../utils'

var LabelButton = function(game, x, y, key, label, callback, callbackContext, overFrame, outFrame, downFrame, upFrame){
  Phaser.Button.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
  //Style how you wish...
  this.style = {
    'font': '120px Arial',
    'fill': 'white',
    'align': 'center'
  };
  // this.anchor.setTo(0,0);
  this.label = new Phaser.Text(game, this.width / 2, this.height / 2, label, this.style);
  this.addChild(this.label);
  this.setLabel(label);
  this.label.centerX = this.width / 2;
  this.label.centerY = this.height / 2;

  //adds button to game
  //puts the label in the center of the button
  // this.label.anchor.setTo(0.5, 0.5);
  game.add.existing(this);
};
LabelButton.prototype = Object.create(Phaser.Button.prototype);
LabelButton.prototype.constructor = LabelButton;
LabelButton.prototype.setLabel = function(label) {this.label.setText(label);};
let defaultHeightbutton = 85;
let defaultWidthButton = 200;

export default class extends Phaser.State {
  init () {}

  preload () {}
  create () {
    this.createText(this.game.world.centerX - 80, 80, 'HIGH SCORES', {font: '24px Arial', fill: '#000', boundsAlignH: 'left'})

    let bestScores = JSON.parse(cookies.get('bestScores')).reverse();
    let yOffset = 120;
    let count = 1;
    let self = this;
    bestScores.forEach(function(score){
      self.createText(self.game.world.centerX - 45, yOffset + count * 50, count + ' - ' + score + 'points', {font: '18px Arial', fill: '#000', boundsAlignH: 'left'})
      count ++;
    })

    let btn = new LabelButton(
      this.game,
      this.game.world.centerX - (defaultWidthButton / 2),
      450,
      'button',
      'retour',
      this.mainMenu,
      this,
      2,
      1,
      0
    )
    btn.height = defaultHeightbutton;
    btn.width = defaultWidthButton
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

  mainMenu(){
    this.game.state.start('MainMenu')
  }
}
