import { Asset } from '@/constants'

export default class Pickaxe extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Asset.Items, 162)
    this.scene.add.existing(this)
    this.setOrigin(0.25, 0.75)
    this.setScale(0.8)
  }
}
