import type { Texture, EntityType } from '@/types'

export default abstract class BaseEntity extends Phaser.Physics.Matter.Sprite {
  #physics
  #health
  #position
  #sound

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: Texture,
    depth: number,
    health: number,
    sound: EntityType,
    frame?: string | number
  ) {
    super(scene.matter.world, x, y, texture, frame)
    this.scene.add.existing(this)
    this.depth = depth
    this.name = sound
    this.#physics = new Phaser.Physics.Matter.MatterPhysics(this.scene)
    this.#health = health
    this.#position = new Phaser.Math.Vector2(this.x, this.y)
    this.#sound = this.scene.sound.add(sound)
    this.#sound.volume = 0.5
  }

  get position() {
    this.#position.set(this.x, this.y)
    return this.#position
  }

  get velocity() {
    return this.body!.velocity
  }

  get dead() {
    return this.#health <= 0
  }

  onDeath() {}

  hit() {
    this.#sound.play()
    this.#health--
    if (this.dead) this.onDeath()
  }

  toggleAnimation() {
    if (Math.abs(this.velocity.x) > 0.1 || Math.abs(this.velocity.y) > 0.1) {
      this.anims.play(`${this.name}_walk`, true)
    } else {
      this.anims.play(`${this.name}_idle`, true)
    }
  }

  createCircleBody(radius: number, isSensor = false) {
    const body = this.#physics.bodies.circle(this.x, this.y, radius, { isSensor })
    return body
  }

  createCompoundBody(collider: MatterJS.BodyType, sensor: MatterJS.BodyType) {
    const body = this.#physics.body.create({ parts: [collider, sensor], frictionAir: 0.35 })
    return body
  }
}
