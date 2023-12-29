import { Player } from '@/sprites'

export default class Main extends Phaser.Scene {
  player!: Player

  constructor() {
    super('main-scene')
  }

  preload() {
    Player.preload(this)
    this.load.image('tiles', 'assets/rpg_nature_tileset.png')
    this.load.tilemapTiledJSON('map', 'assets/map.json')
  }

  create() {
    const map = this.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage('rpg_nature_tileset', 'tiles', 32, 32, 0, 0)!
    map.createLayer('Capa de patrones 1', tileset, 0, 0)
    map.createLayer('Capa de patrones 2', tileset, 0, 0)
    this.player = new Player(this, 0, 0)
    this.add.existing(this.player)
  }

  update() {
    this.player.update()
  }
}
