import { Player } from '@/sprites'

export default class Main extends Phaser.Scene {
  player!: Player

  constructor() {
    super('main-scene')
  }

  preload() {
    Player.preload(this)
  }

  create() {
    this.player = new Player(this, 0, 0)
    this.add.existing(this.player)
  }

  update() {
    this.player.update()
  }
}
