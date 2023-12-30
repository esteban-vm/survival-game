import { Player } from '@/sprites'

export default class Main extends Phaser.Scene {
  #player!: Player
  #map!: Phaser.Tilemaps.Tilemap

  constructor() {
    super('main-scene')
  }

  preload() {
    Player.preload(this)
    this.load.image('tiles', 'assets/images/rpg_nature_tileset.png')
    this.load.tilemapTiledJSON('map', 'assets/images/map.json')
    this.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json')
  }

  create() {
    this.#map = this.make.tilemap({ key: 'map' })
    const tileset = this.#map.addTilesetImage('rpg_nature_tileset', 'tiles')!
    const layer1 = this.#map.createLayer('Layer 1', tileset)!
    layer1.setCollisionByProperty({ collides: true })
    this.matter.world.convertTilemapLayer(layer1)
    this.#map.createLayer('Layer 2', tileset)
    this.#player = new Player(this, 100, 100)
    this.add.existing(this.#player)
    this.#addResources()
  }

  update() {
    this.#player.update()
  }

  #addResources() {
    const resources = this.#map.getObjectLayer('Resources')
    resources?.objects.forEach(({ x, y, type }) => {
      const { Sprite, MatterPhysics } = Phaser.Physics.Matter
      const item = new Sprite(this.matter.world, x!, y!, 'resources', type)
      const yOrigin = type === 'tree' ? 0.8 : 0.6
      item.x += item.width / 2
      item.y -= item.height / 2
      item.y += item.height * (yOrigin - 0.5)
      const collider = new MatterPhysics(this).bodies.circle(item.x, item.y, 12)
      item.setExistingBody(collider)
      item.setStatic(true)
      item.setOrigin(0.5, yOrigin)
      this.add.existing(item)
    })
  }
}
