import type { EntityType, DropFrames } from '@/types'
import MainEntity from '@/main-entity'

export default class Resource extends MainEntity {
  constructor(
    offset: number,
    drops: DropFrames,
    scene: Phaser.Scene,
    x: number,
    y: number,
    depth: number,
    health: number,
    entity: EntityType
  ) {
    super(drops, scene, x, y, 'resources', depth, health, entity, entity)
    this.y += this.height * (offset - 0.5)
    const collider = this.physics.bodies.circle(this.x, this.y, 12)
    this.setExistingBody(collider)
    this.setStatic(true)
    this.setOrigin(0.5, offset)
  }
}
