import { Scenes, Assets, Textures, Animations, Sounds } from '@/constants'

const Preloader = class extends Phaser.Scene {
  constructor() {
    super(Scenes.Preloader)
  }

  preload() {
    this.load.image(Assets.Tileset, `assets/images/${Assets.TilesetName}.png`)
    this.load.tilemapTiledJSON(Assets.Map, `assets/images/${Assets.Map}.json`)
    this.load.spritesheet(Assets.Items, `assets/images/${Assets.Items}.png`, { frameWidth: 32 })

    Object.values(Textures).forEach((texture) => {
      this.load.atlas(texture, `assets/images/${texture}.png`, `assets/images/${texture}_atlas.json`)
    })

    Object.values(Animations).forEach((animation) => {
      this.load.animation(animation, `assets/images/${animation}.json`)
    })

    Object.values(Sounds).forEach((sound) => {
      this.load.audio(sound, `assets/sounds/${sound}.mp3`)
    })
  }

  create() {
    this.scene.start(Scenes.Main)
  }
}

export default Preloader
