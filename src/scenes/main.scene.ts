import { Assets, Layers, Scenes } from '@/constants'
import { Player, Resource } from '@/sprites'

const Main = class extends Phaser.Scene {
  #player!: Player
  #resources!: Resource[]
  #map!: Phaser.Tilemaps.Tilemap
  #runningOnDesktop!: boolean

  constructor() {
    super(Scenes.Main)
  }

  init() {
    this.#resources = []
    this.#runningOnDesktop = this.game.device.os.desktop
  }

  create() {
    this.#map = this.make.tilemap({ key: Assets.Map })
    const tileset = this.#map.addTilesetImage(Assets.TilesetName, Assets.Tileset)!
    const layer1 = this.#map.createLayer(Layers.Layer1, tileset)!
    layer1.setCollisionByProperty({ collides: true })
    this.matter.world.convertTilemapLayer(layer1)
    this.#map.createLayer(Layers.Layer2, tileset)
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
    resources?.objects.forEach(({ x, y, type, properties }) => {
      const customProperties = <CustomProperties[]>properties
      const offset = <number>customProperties.find(({ name }) => name === 'offset')!.value
      const drops = <[number, number]>JSON.parse(<string>customProperties.find(({ name }) => name === 'drops')!.value)
      const depth = <number>customProperties.find(({ name }) => name === 'depth')!.value
      const health = <number>customProperties.find(({ name }) => name === 'health')!.value
      this.#resources.push(new Resource(this, x!, y!, type, { offset, health, drops, depth }))
    })
  }
}

interface CustomProperties {
  name: 'offset' | 'drops' | 'depth' | 'health'
  type: string
  value: string | number
}

export default Main
