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
    const tileset = this.#map.addTilesetImage('rpg_nature_tileset', 'tiles', 32, 32, 0, 0)!
    const layer1 = this.#map.createLayer('Layer 1', tileset, 0, 0)!
    layer1.setCollisionByProperty({ collides: true })
    this.matter.world.convertTilemapLayer(layer1)
    this.#map.createLayer('Layer 2', tileset, 0, 0)
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
      const item = new Phaser.Physics.Matter.Sprite(this.matter.world, x!, y!, 'resources', type)
      const physics = new Phaser.Physics.Matter.MatterPhysics(this)
      const collider = physics.bodies.circle(x!, y!, 12, { isSensor: false, label: 'resourceCollider' })
      item.setExistingBody(collider)
      item.setStatic(true)
      item.setOrigin(0.5, type === 'tree' ? 0.8 : 0.6)
      this.add.existing(item)
    })
  }
}
