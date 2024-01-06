import type { EntityType, DropFrames } from '@/types'
import { StandardEntity } from '@/entities'

export default class Resource extends StandardEntity {
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
    const collider = this.createCircleBody(12)
    this.setExistingBody(collider)
    this.setStatic(true)
    this.setOrigin(0.5, offset)
  }
}
