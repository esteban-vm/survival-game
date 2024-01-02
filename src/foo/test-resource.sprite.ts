import Drop from '@/drop'

export default class Resource extends Phaser.Physics.Matter.Sprite {
  #health
  #sound
  #dropFrames
  #dropItems

  constructor(scene: Phaser.Scene, x: number, y: number, frame: string, offset: number, drops: [number, number]) {
    super(scene.matter.world, x, y, 'resources', frame)
    this.scene.add.existing(this)
    this.name = frame
    this.x += this.width / 2
    this.y -= this.height / 2
    this.y += this.height * (offset - 0.5)
    const physics = new Phaser.Physics.Matter.MatterPhysics(this.scene)
    const collider = physics.bodies.circle(this.x, this.y, 12)
    this.setExistingBody(collider)
    this.setStatic(true)
    this.setOrigin(0.5, offset)
    this.#health = 5
    this.#sound = this.scene.sound.add(this.name)
    this.#sound.volume = 0.5
    this.#dropFrames = drops
    this.#dropItems = <Drop[]>[]
  }

  get dead() {
    return this.#health <= 0
  }

  hit() {
    this.#sound.play()
    this.#health--
    if (this.dead) {
      this.#dropFrames.forEach((frame) => this.#dropItems.push(new Drop(this.scene, this.x, this.y, frame)))
      this.destroy()
    }
  }
}
