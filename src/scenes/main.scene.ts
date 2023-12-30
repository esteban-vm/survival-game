import { Player } from '@/sprites'

export default class Main extends Phaser.Scene {
  #player!: Player

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
    const { world } = this.matter
    const { Sprite } = Phaser.Physics.Matter
    const map = this.make.tilemap({ key: 'map' })
    const tileset = map.addTilesetImage('rpg_nature_tileset', 'tiles', 32, 32, 0, 0)!

    const layer1 = map.createLayer('Capa de patrones 1', tileset, 0, 0)!
    layer1.setCollisionByProperty({ collides: true })
    world.convertTilemapLayer(layer1)

    map.createLayer('Capa de patrones 2', tileset, 0, 0)

    const tree = new Sprite(world, 50, 50, 'resources', 'tree')
    tree.setStatic(true)
    this.add.existing(tree)

    const rock = new Sprite(world, 150, 150, 'resources', 'rock')
    rock.setStatic(true)
    this.add.existing(rock)

    this.#player = new Player(this, 100, 100)
    this.add.existing(this.#player)
  }

  update() {
    this.#player.update()
  }
}
