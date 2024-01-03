import { Texture } from '@/constants'
import Entity from '@/entity'

export default class Resource extends Entity {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    frame: string,
    depth: number,
    health: number,
    drops: [number, number],
    offset: number
  ) {
    super(scene, x, y, Texture.Resources, frame, health, depth, undefined, drops)
    this.y += this.height * (offset - 0.5)
    const collider = this.physics.bodies.circle(this.x, this.y, 12)
    this.setExistingBody(collider)
    this.setStatic(true)
    this.setOrigin(0.5, offset)
  }
}
