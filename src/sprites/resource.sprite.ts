import { Texture } from '@/constants'
import Entity from '@/entity'

export default class Resource extends Entity {
  constructor(
    offset: number,
    drops: [number, number],
    scene: Phaser.Scene,
    x: number,
    y: number,
    ...params: [frame: string, health: number, depth: number]
  ) {
    super(drops, scene, x, y, Texture.Resources, ...params)
    this.y += this.height * (offset - 0.5)
    this.x += this.width / 2
    this.y -= this.height / 2
    const collider = this.physics.bodies.circle(this.x, this.y, 12)
    this.setExistingBody(collider)
    this.setStatic(true)
    this.setOrigin(0.5, offset)
  }
}
