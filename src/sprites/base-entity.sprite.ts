import type { Asset, Texture, Sound } from '@/constants'

export default abstract class BaseEntity extends Phaser.Physics.Matter.Sprite {
  physics
  #health
  #position
  #sound

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: Asset | Texture,
    frame: string | number,
    health: number,
    depth?: number,
    sound?: Sound
  ) {
    super(scene.matter.world, x, y, texture, frame)
    this.scene.add.existing(this)
    this.depth = depth ?? 1
    this.physics = new Phaser.Physics.Matter.MatterPhysics(this.scene)
    this.#health = health
    this.#position = new Phaser.Math.Vector2(this.x, this.y)
    this.#sound = this.scene.sound.add(sound ?? <string>frame)
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

  hit() {
    this.#sound.play()
    this.#health--
  }
}
