import Phaser from 'phaser'
import _ from 'lodash'
import globals from './globals/index'

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

  preload () {  }

  test(){

    let yFirstButton, offsetY;
    let buttons = [
      // {
      //   label: 'Login',
      //   onClick: this.login,
      // },
      {
        label: 'Play as guest',
        onClick: this.start,
      },
      {
        label: 'Best scores',
        onClick: this.bestScores,
      },
      {
        label: 'More games',
        onClick: this.bestScores,
      }
    ]


    offsetY = this.game.world.height / (buttons.length * 2 - 1);
    yFirstButton = offsetY / 2 + defaultHeightbutton;
    for(var i = 0; i < buttons.length; i++){
      let btn = new LabelButton(
        this.game,
        this.game.world.centerX - (defaultWidthButton / 2),
        yFirstButton + offsetY * i,
        'button',
        buttons[i].label,
        buttons[i].onClick,
        this,
        2,
        1,
        0
      )
      btn.height = defaultHeightbutton;
      btn.width = defaultWidthButton
    }

  }

  create () {
    this.test();
    // this.setUpButtons();
    // let defaultHeightbutton = 85;
    // let defaultWidthButton = 200;
    // let startButton = new LabelButton(this.game, this.game.world.centerX - defaultWidthButton/2, this.game.world.centerY - defaultHeightbutton/2, 'button', 'Play', this.login, this, 2, 1, 0);
    // startButton.height = defaultHeightbutton;
    // startButton.width = defaultWidthButton


    // startButton.onInputOver.add(over, this);
    // startButton.onInputOut.add(out, this);
    // startButton.onInputUp.add(up, this);


  }

  login(){
    var request = new XMLHttpRequest();
    request.open('GET', '/login', true)
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
      } else {
        alert('error from server');
        // We reached our target server, but it returned an error
      }
    }
    request.onerror = function() {
      // There was a connection error of some sort
    };
    request.send();
  }

  setUpButtons(){
    // this.buttons = this.game.add.group()
    // let startButton = game.add.button(game.world.centerX - defaultWidthButton/2, game.world.centerY - defaultHeightbutton/2, 'button', this.start, this, 2, 1, 0);

  }

  start(){
    this.game.state.start('Game')
  }

  bestScores(){
    this.game.state.start('BestScore')
  }


}
