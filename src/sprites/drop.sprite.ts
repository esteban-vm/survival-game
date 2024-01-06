import { BaseEntity } from '@/entities'

export default class Drop extends BaseEntity {
  constructor(scene: Phaser.Scene, x: number, y: number, frame: number) {
    super(scene, x, y, 'items', 1, 1, 'drop', frame)
    const collider = this.createCircleBody(10)
    this.setExistingBody(collider)
    this.setFrictionAir(1)
    this.setScale(0.5)
  }

  hit() {
    super.hit()
    if (this.dead) this.destroy()
  }
}
