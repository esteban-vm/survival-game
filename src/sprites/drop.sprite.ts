import { Asset, Sound } from '@/constants'
import BaseEntity from '@/base-entity'

export default class Drop extends BaseEntity {
  constructor(scene: Phaser.Scene, x: number, y: number, frame: number) {
    super(scene, x, y, Asset.Items, frame, 1, undefined, Sound.Drop)
    const collider = this.physics.bodies.circle(this.x, this.y, 10)
    this.setExistingBody(collider)
    this.setFrictionAir(1)
    this.setScale(0.5)
  }

  hit() {
    super.hit()
    if (this.dead) this.destroy()
  }
}
