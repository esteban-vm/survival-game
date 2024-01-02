import Drop from '@/drop'

export default abstract class Entity extends Phaser.Physics.Matter.Sprite {
  #health
  #drops
  #position
  #sound
  physics

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: string,
    { health, drops, depth = 1, name }: EntityOptions
  ) {
    super(scene.matter.world, x, y, texture, frame)
    this.scene.add.existing(this)
    this.depth = depth
    this.name = name
    this.x += this.width / 2
    this.y -= this.height / 2
    this.#health = health
    this.#drops = drops
    this.#position = new Phaser.Math.Vector2(this.x, this.y)
    this.#sound = this.scene.sound.add(this.name)
    this.#sound.volume = 0.5
    this.physics = new Phaser.Physics.Matter.MatterPhysics(this.scene)
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
    this.#sound?.play()
    this.#health--
    if (this.dead) {
      this.#drops?.forEach((frame) => new Drop(this.scene, this.x, this.y, frame))
      this.destroy()
    }
  }
}

interface EntityOptions {
  health: number
  depth?: number
  drops?: [number, number]
  name: string
}
