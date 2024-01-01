const Preloader = class extends Phaser.Scene {
  constructor() {
    super('preloader-scene')
  }

  preload() {
    this.load.image('tiles', 'assets/images/rpg_nature_tileset.png')
    this.load.tilemapTiledJSON('map', 'assets/images/map.json')
    this.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json')
    this.load.atlas('player', 'assets/images/player.png', 'assets/images/player_atlas.json')
    this.load.spritesheet('items', 'assets/images/items.png', { frameWidth: 32 })
    this.load.animation('player_anim', 'assets/images/player_anim.json')
    this.load.audio('pickup', 'assets/sounds/pickup.mp3')
    this.load.audio('bush', 'assets/sounds/bush.mp3')
    this.load.audio('rock', 'assets/sounds/rock.mp3')
    this.load.audio('tree', 'assets/sounds/tree.mp3')
  }

  create() {
    this.scene.start('main-scene')
  }
}

export default Preloader
