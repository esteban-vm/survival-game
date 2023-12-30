export default class Player extends Phaser.Physics.Matter.Sprite {
  #keys
  #pointer

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, 'player', 'player_idle_1')
    this.scene.add.existing(this)
    const physics = new Phaser.Physics.Matter.MatterPhysics(this.scene)
    const collider = physics.bodies.circle(this.x, this.y, 12, { isSensor: false, label: 'playerCollider' })
    const sensor = physics.bodies.circle(this.x, this.y, 24, { isSensor: true, label: 'playerSensor' })
    const compoundBody = physics.body.create({ parts: [collider, sensor], frictionAir: 0.35 })
    this.setExistingBody(compoundBody)
    this.setFixedRotation()
    this.#keys = this.scene.input.keyboard!.createCursorKeys()
    this.#pointer = this.scene.input.pointer1
  }

  static preload(scene: Phaser.Scene) {
    scene.load.atlas('player', 'assets/images/player.png', 'assets/images/player_atlas.json')
    scene.load.animation('player_anim', 'assets/images/player_anim.json')
  }

  update() {
    const velocity = new Phaser.Math.Vector2()
    const { left, right, up, down } = this.#keys
    const { position, wasTouch } = this.#pointer

    const touchingLeft = left.isDown || (wasTouch && position.x < this.x)
    const touchingRight = right.isDown || (wasTouch && position.x > this.x)
    const touchingUp = up.isDown || (wasTouch && position.y < this.y)
    const touchingDown = down.isDown || (wasTouch && position.y > this.y)

    if (touchingLeft) velocity.x = -1
    else if (touchingRight) velocity.x = 1

    if (touchingUp) velocity.y = -1
    else if (touchingDown) velocity.y = 1

    velocity.normalize()
    velocity.scale(2.5)
    this.setVelocity(velocity.x, velocity.y)

    if (Math.abs(this.#velocity.x) > 0.1 || Math.abs(this.#velocity.y) > 0.1) {
      this.anims.play('player_walk', true)
    } else {
      this.anims.play('player_idle', true)
    }
  }

  get #velocity() {
    return this.body!.velocity
  }
}
