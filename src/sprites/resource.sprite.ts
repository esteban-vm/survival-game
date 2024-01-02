import Entity from '@/entity'

export default class Resource extends Entity {
  constructor(scene: Phaser.Scene, x: number, y: number, frame: string, { drops, depth, offset }: ResourceOptions) {
    super(scene, x, y, 'resources', frame, { drops, depth, health: 5, name: frame })
    this.y += this.height * (offset - 0.5)
    const collider = this.physics.bodies.circle(this.x, this.y, 12)
    this.setExistingBody(collider)
    this.setStatic(true)
    this.setOrigin(0.5, offset)
  }
}

interface ResourceOptions extends Pick<ConstructorParameters<typeof Entity>[5], 'drops' | 'depth'> {
  offset: number
}
