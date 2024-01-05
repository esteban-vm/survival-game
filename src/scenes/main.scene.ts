import type { EnemyType, ResourceType, DropFrames } from '@/types'
import { Scenes, Stuff, Layers } from '@/constants'
import { Player, Enemy, Resource } from '@/sprites'

const Main = class extends Phaser.Scene {
  #player!: Player
  #enemies!: Enemy[]
  #resources!: Resource[]
  #desktop!: boolean
  #map!: Phaser.Tilemaps.Tilemap

  constructor() {
    super(Scenes.Main)
  }

  init() {
    this.#enemies = []
    this.#resources = []
    this.#desktop = this.game.device.os.desktop
  }

  create() {
    this.#addLayers()
    if (this.#desktop) {
      this.#addPlayer()
      this.#addEnemies()
      this.#addResources()
    }
  }

  update() {
    if (this.#desktop) {
      this.#player.update()
      this.#enemies.forEach((enemy) => enemy.update())
    }
  }

  #addLayers() {
    this.#map = this.make.tilemap({ key: Stuff.GameMap })
    const tileset = this.#map.addTilesetImage(Stuff.TilesetName, Stuff.Tileset)!
    const layer1 = this.#map.createLayer(Layers.Map1, tileset)!
    layer1.setCollisionByProperty({ collides: true })
    this.matter.world.convertTilemapLayer(layer1)
    this.#map.createLayer(Layers.Map2, tileset)
  }

  #addPlayer() {
    this.#player = new Player(this, 220, 220)
    const camera = this.cameras.main
    const { width, height } = this.game.config
    camera.zoom = 2
    camera.setLerp(0.1, 0.1)
    camera.setBounds(0, 0, <number>width, <number>height)
    camera.startFollow(this.#player)
  }

  #addEnemies() {
    const enemies = this.#map.getObjectLayer(Layers.Enemies)!
    const enemyObjs = <EnemyObject[]>enemies.objects
    enemyObjs.forEach(({ x, y, type, properties }) => {
      const drops = <DropFrames>JSON.parse(<string>properties.find(({ name }) => name === 'drops')!.value)
      const health = <number>properties.find(({ name }) => name === 'health')!.value
      this.#enemies.push(new Enemy(drops, this, x, y, health, type))
    })
  }

  #addResources() {
    const resources = this.#map.getObjectLayer(Layers.Resources)!
    const resourceObjs = <ResourceObject[]>resources.objects
    resourceObjs.forEach(({ x, y, type, properties }) => {
      const offset = <number>properties.find(({ name }) => name === 'offset')!.value
      const drops = <DropFrames>JSON.parse(<string>properties.find(({ name }) => name === 'drops')!.value)
      const depth = <number>properties.find(({ name }) => name === 'depth')!.value
      const health = <number>properties.find(({ name }) => name === 'health')!.value
      this.#resources.push(new Resource(offset, drops, this, x, y, depth, health, type))
    })
  }
}

export default Main

interface EnemyObject extends Phaser.Types.Tilemaps.TiledObject {
  x: number
  y: number
  type: EnemyType
  properties: CustomProperties[]
}

interface ResourceObject extends Phaser.Types.Tilemaps.TiledObject {
  x: number
  y: number
  type: ResourceType
  properties: CustomProperties[]
}

interface CustomProperties {
  name: 'offset' | 'drops' | 'depth' | 'health'
  type: string
  value: string | number
}
