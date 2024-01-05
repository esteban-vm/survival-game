import { Scenes, Stuff, Atlases, Animations, EntityTypes } from '@/constants'

const Preloader = class extends Phaser.Scene {
  constructor() {
    super(Scenes.Preloader)
  }

  preload() {
    this.load.image(Stuff.Tileset, `assets/images/${Stuff.TilesetName}.png`)
    this.load.tilemapTiledJSON(Stuff.GameMap, `assets/images/${Stuff.GameMap}.json`)
    this.load.spritesheet(Stuff.ItemSpritesheet, `assets/images/${Stuff.ItemSpritesheet}.png`, { frameWidth: 32 })

    Object.values(Atlases).forEach((texture) => {
      this.load.atlas(texture, `assets/images/${texture}.png`, `assets/images/${texture}_atlas.json`)
    })

    Object.values(Animations).forEach((animation) => {
      this.load.animation(animation, `assets/images/${animation}.json`)
    })

    Object.values(EntityTypes).forEach((sound) => {
      this.load.audio(sound, `assets/sounds/${sound}.mp3`)
    })
  }

  create() {
    this.scene.start(Scenes.Main)
  }
}

export default Preloader
