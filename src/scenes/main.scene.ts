import { Asset, Layer, Scene } from '@/constants'
import { Player, Resource } from '@/sprites'

const Main = class extends Phaser.Scene {
  #player!: Player
  #resources!: Resource[]
  #map!: Phaser.Tilemaps.Tilemap
  #desktop!: boolean

  constructor() {
    super(Scene.Main)
  }

  init() {
    this.#resources = []
    this.#desktop = this.game.device.os.desktop
  }

  create() {
    this.#map = this.make.tilemap({ key: Asset.Map })
    const tileset = this.#map.addTilesetImage(Asset.TilesetName, Asset.Tileset)!
    const layer1 = this.#map.createLayer(Layer.Layer1, tileset)!
    layer1.setCollisionByProperty({ collides: true })
    this.matter.world.convertTilemapLayer(layer1)
    this.#map.createLayer(Layer.Layer2, tileset)
    if (this.#desktop) {
      this.#player = new Player(this, 200, 200)
      this.#addResources()
    }
  }

  update() {
    if (this.#desktop) this.#player.update()
  }

  #addResources() {
    const resources = this.#map.getObjectLayer('Resources')
    resources?.objects.forEach(({ x, y, type, properties }) => {
      const customProperties = <CustomProperties[]>properties
      const depth = <number>customProperties.find(({ name }) => name === 'depth')!.value
      const health = <number>customProperties.find(({ name }) => name === 'health')!.value
      const drops = <[number, number]>JSON.parse(<string>customProperties.find(({ name }) => name === 'drops')!.value)
      const offset = <number>customProperties.find(({ name }) => name === 'offset')!.value
      this.#resources.push(new Resource(this, x!, y!, type, depth, health, drops, offset))
    })
  }
}

export default Main

interface CustomProperties {
  name: 'offset' | 'drops' | 'depth' | 'health'
  type: string
  value: string | number
}
