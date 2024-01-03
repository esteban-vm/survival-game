import { Scene, Asset, Texture, Animation, Sound } from '@/constants'

const Preloader = class extends Phaser.Scene {
  constructor() {
    super(Scene.Preloader)
  }

  preload() {
    this.load.image(Asset.Tileset, `assets/images/${Asset.TilesetName}.png`)
    this.load.tilemapTiledJSON(Asset.Map, `assets/images/${Asset.Map}.json`)
    this.load.spritesheet(Asset.Items, `assets/images/${Asset.Items}.png`, { frameWidth: 32 })

    Object.values(Texture).forEach((texture) => {
      this.load.atlas(texture, `assets/images/${texture}.png`, `assets/images/${texture}_atlas.json`)
    })

    Object.values(Animation).forEach((animation) => {
      this.load.animation(animation, `assets/images/${animation}.json`)
    })

    Object.values(Sound).forEach((sound) => {
      this.load.audio(sound, `assets/sounds/${sound}.mp3`)
    })
  }

  create() {
    this.scene.start(Scene.Main)
  }
}

export default Preloader
