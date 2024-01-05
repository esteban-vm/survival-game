import type { EntityType, DropFrames } from '@/types'
import { StandardEntity } from '@/entities'
import Player from '@/player'

export default class Enemy extends StandardEntity {
  #player?: Player
  #attackTimer?: NodeJS.Timer

  constructor(drops: DropFrames, scene: Phaser.Scene, x: number, y: number, health: number, entity: EntityType) {
    super(drops, scene, x, y, 'enemies', 1, health, entity, `${entity}_idle_1`)
    const collider = this.physics.bodies.circle(this.x, this.y, 12)
    const sensor = this.physics.bodies.circle(this.x, this.y, 80, { isSensor: true })
    const compoundBody = this.physics.body.create({ parts: [collider, sensor], frictionAir: 0.35 })
    this.setExistingBody(compoundBody)
    this.setFixedRotation()
    this.#createMiningCollisions(sensor)
  }

  update() {
    if (this.dead) return
    if (this.#player) {
      const vector = this.#player.position.subtract(this.position)
      if (vector.length() > 24) {
        vector.normalize()
        this.setVelocityX(vector.x)
        this.setVelocityY(vector.y)
        if (this.#attackTimer) {
          clearInterval(this.#attackTimer)
          this.#attackTimer = undefined
        }
      } else {
        if (!this.#attackTimer) {
          this.#attackTimer = setInterval(this.#attack, 500, this.#player)
        }
      }
      this.setFlipX(this.velocity.x < 0)
      this.toggleAnimation()
    }
  }

  #createMiningCollisions(enemySensor: MatterJS.BodyType) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: enemySensor,
      callback: ({ gameObjectB }) => {
        if (gameObjectB instanceof Player) this.#player = gameObjectB
      },
    })
  }

  #attack = (target: Player) => {
    if (target.dead || this.dead) clearInterval(this.#attackTimer)
    else target.hit()
  }
}
