import Phaser from 'phaser'
import WebFont from 'webfontloader'
import config from '../config'
import globals from './globals/index'
import _ from 'lodash'

export default class extends Phaser.State {
  init() {
    this.stage.backgroundColor = '#51d8b9'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }
  create() {
    this.initGlobalVariables()
  }

  initGlobalVariables() {
    this.game.global = _.clone(globals)
  }

  preload() {
    if (config.webfonts.length) {
      WebFont.load({
        google: {
          families: config.webfonts
        },
        active: this.fontsLoaded
      })
    }

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
    this.load.image('paddle', './assets/images/paddle.png')

    this.load.image('ball', './assets/images/ball.png')
    this.load.image('fireBall', './assets/images/fireBall.png')

    this.load.image('bonusLife', './assets/images/bonusLife.png')
    this.load.image('bonusMaxPaddle', './assets/images/bonusMaxPaddle.png')
    this.load.image('bonusExtraBalls', './assets/images/bonusExtraBalls.png')
    this.load.image('bonusFireBall', './assets/images/bonusFireBall.png')

    this.load.image('brick1', './assets/images/brick1.png')
    this.load.image('brick2', './assets/images/brick2.png')
    this.load.image('brick3', './assets/images/brick3.png')
    this.load.image('brick4', './assets/images/brick4.png')
    this.load.image('brick5', './assets/images/brick5.png')
    this.load.image('brick6', './assets/images/brick6.png')
    this.load.image('brick7', './assets/images/brick7.png')

    this.load.image('button', './assets/images/button.png')
  }

  render() {
    if (config.webfonts.length && this.fontsReady) {
      this.state.start('Splash')
    }
    if (!config.webfonts.length) {
      this.state.start('Splash')
    }
  }

  fontsLoaded() {
    this.fontsReady = true
  }
}
