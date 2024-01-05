import type { EntityType, DropFrames } from '@/types'
import MainEntity from '@/main-entity'

export default class Enemy extends MainEntity {
  constructor(drops: DropFrames, scene: Phaser.Scene, x: number, y: number, health: number, entity: EntityType) {
    super(drops, scene, x, y, 'enemies', 1, health, entity, `${entity}_idle_1`)
    const collider = this.physics.bodies.rectangle(this.x, this.y, this.width, this.height)
    this.setExistingBody(collider)
  }
}
