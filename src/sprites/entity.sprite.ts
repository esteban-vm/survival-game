import type { Texture, Sound } from '@/constants'
import Drop from '@/drop'

export default abstract class Entity extends Phaser.Physics.Matter.Sprite {
  physics
  #health
  #dropFrames
  #dropItems
  #position
  #sound

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: Texture,
    frame: string,
    health: number,
    depth?: number,
    sound?: Sound,
    drops?: [number, number]
  ) {
    super(scene.matter.world, x, y, texture, frame)
    this.scene.add.existing(this)
    this.x += this.width / 2
    this.y -= this.height / 2
    this.depth = depth ?? 1
    this.physics = new Phaser.Physics.Matter.MatterPhysics(this.scene)
    this.#health = health
    this.#dropFrames = drops
    this.#dropItems = <Drop[]>[]
    this.#position = new Phaser.Math.Vector2(this.x, this.y)
    this.#sound = this.scene.sound.add(sound ?? frame)
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
    if (this.dead) {
      this.#dropFrames?.forEach((frame) => {
        this.#dropItems.push(new Drop(this.scene, this.x, this.y, frame))
      })
      this.destroy()
    }
  }
}
