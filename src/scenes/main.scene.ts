import { Pickaxe, Player, Resource } from '@/sprites'

export default class Main extends Phaser.Scene {
  #player!: Player
  #resources!: Resource[]
  #map!: Phaser.Tilemaps.Tilemap
  #runningOnDesktop!: boolean

  constructor() {
    super('main-scene')
  }

  preload() {
    Pickaxe.preload(this)
    Player.preload(this)
    Resource.preload(this)
    this.load.image('tiles', 'assets/images/rpg_nature_tileset.png')
    this.load.tilemapTiledJSON('map', 'assets/images/map.json')
  }

  init() {
    this.#resources = []
    this.#runningOnDesktop = this.game.device.os.desktop
  }

  create() {
    this.#map = this.make.tilemap({ key: 'map' })
    const tileset = this.#map.addTilesetImage('rpg_nature_tileset', 'tiles')!
    const layer1 = this.#map.createLayer('Layer 1', tileset)!
    layer1.setCollisionByProperty({ collides: true })
    this.matter.world.convertTilemapLayer(layer1)
    this.#map.createLayer('Layer 2', tileset)
    if (this.#runningOnDesktop) {
      this.#player = new Player(this, 200, 200)
      this.#addResources()
    }
  }

  update() {
    if (this.#runningOnDesktop) {
      this.#player.update()
    }
  }

  #addResources() {
    const resources = this.#map.getObjectLayer('Resources')
    resources?.objects.forEach(({ x, y, type }) => {
      this.#resources.push(new Resource(this, x!, y!, type))
    })
  }
}
