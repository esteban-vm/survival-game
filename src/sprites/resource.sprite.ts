export default class Resource extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, frame: string) {
    super(scene.matter.world, x, y, 'resources', frame)
    this.scene.add.existing(this)
    const yOrigin = frame === 'tree' ? 0.8 : 0.6
    this.x += this.width / 2
    this.y -= this.height / 2
    this.y += this.height * (yOrigin - 0.5)
    const physics = new Phaser.Physics.Matter.MatterPhysics(this.scene)
    const collider = physics.bodies.circle(this.x, this.y, 12)
    this.setExistingBody(collider)
    this.setStatic(true)
    this.setOrigin(0.5, yOrigin)
  }

  static preload(scene: Phaser.Scene) {
    scene.load.atlas('resources', 'assets/images/resources.png', 'assets/images/resources_atlas.json')
  }
}
