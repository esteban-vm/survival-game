export default class Pickaxe extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'items', 162)
    this.scene.add.existing(this)
    this.name = 'pickaxe'
    this.setOrigin(0.25, 0.75)
    this.setScale(0.8)
  }
}
