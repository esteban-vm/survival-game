export default class Drop extends Phaser.Physics.Matter.Sprite {
  #sound

  constructor(scene: Phaser.Scene, x: number, y: number, frame: number) {
    super(scene.matter.world, x, y, 'items', frame)
    this.scene.add.existing(this)
    this.name = 'drop'
    const physics = new Phaser.Physics.Matter.MatterPhysics(this.scene)
    const collider = physics.bodies.circle(this.x, this.y, 10)
    this.setExistingBody(collider)
    this.setFrictionAir(1)
    this.setScale(0.5)
    this.#sound = this.scene.sound.add('pickup')
    this.#sound.volume = 0.5
  }

  pickup() {
    this.#sound.play()
    this.destroy()
  }
}
