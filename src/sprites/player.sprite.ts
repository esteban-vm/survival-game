import Drop from '@/drop'
import Pickaxe from '@/pickaxe'
import Resource from '@/resource'

export default class Player extends Phaser.Physics.Matter.Sprite {
  #keys
  #mousePointer
  // #touchPointer
  #pickaxe
  #pickaxeRotation
  #touchingResources

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene.matter.world, x, y, 'player', 'player_idle_1')
    this.scene.add.existing(this)
    this.name = 'player'
    const physics = new Phaser.Physics.Matter.MatterPhysics(this.scene)
    const collider = physics.bodies.circle(this.x, this.y, 12)
    const sensor = physics.bodies.circle(this.x, this.y, 24, { isSensor: true })
    const compoundBody = physics.body.create({ parts: [collider, sensor], frictionAir: 0.35 })
    this.setExistingBody(compoundBody)
    this.setFixedRotation()
    this.#keys = this.scene.input.keyboard!.createCursorKeys()
    this.#mousePointer = this.scene.input.mousePointer
    // this.#touchPointer = this.scene.input.pointer1
    this.#pickaxe = new Pickaxe(this.scene, this.x, this.y)
    this.#pickaxeRotation = 0
    this.#touchingResources = <Resource[]>[]
    this.#createMiningCollisions(sensor)
    this.#createPickupCollisions(collider)
  }

  update() {
    const velocity = new Phaser.Math.Vector2()
    const { left, right, up, down } = this.#keys
    // const { position, wasTouch } = this.#touchPointer

    const touchingLeft = left.isDown /* || (wasTouch && position.x < this.x) */
    const touchingRight = right.isDown /* || (wasTouch && position.x > this.x) */
    const touchingUp = up.isDown /* || (wasTouch && position.y < this.y) */
    const touchingDown = down.isDown /* || (wasTouch && position.y > this.y) */

    if (touchingLeft) {
      velocity.x = -1
      this.setFlipX(true)
    } else if (touchingRight) {
      velocity.x = 1
      this.setFlipX(false)
    }

    if (touchingUp) {
      velocity.y = -1
    } else if (touchingDown) {
      velocity.y = 1
    }

    velocity.normalize()
    velocity.scale(2.5)
    this.setVelocity(velocity.x, velocity.y)

    if (Math.abs(this.#velocity.x) > 0.1 || Math.abs(this.#velocity.y) > 0.1) {
      this.anims.play('player_walk', true)
    } else {
      this.anims.play('player_idle', true)
    }

    this.#pickaxe.setPosition(this.x, this.y)
    this.#rotatePickaxe()
  }

  get #velocity() {
    return this.body!.velocity
  }

  #rotatePickaxe() {
    if (this.#mousePointer.isDown) {
      this.#pickaxeRotation += 6
    } else {
      this.#pickaxeRotation = 0
    }

    if (this.#pickaxeRotation > 100) {
      this.#pickaxeRotation = 0
      this.#whackStuff()
    }

    if (this.flipX) {
      this.#pickaxe.setAngle(-this.#pickaxeRotation - 90)
    } else {
      this.#pickaxe.setAngle(this.#pickaxeRotation)
    }
  }

  #createMiningCollisions(playerSensor: MatterJS.BodyType) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: playerSensor,
      callback: ({ bodyB, gameObjectB }) => {
        if ((<MatterJS.BodyType>bodyB).isSensor) return
        if (gameObjectB instanceof Resource) {
          this.#touchingResources.push(gameObjectB)
        }
      },
    })

    this.scene.matterCollision.addOnCollideEnd({
      objectA: playerSensor,
      callback: ({ gameObjectB }) => {
        this.#touchingResources = this.#touchingResources.filter((object) => object !== gameObjectB)
      },
    })
  }

  #createPickupCollisions(playerCollider: MatterJS.BodyType) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: playerCollider,
      callback: ({ gameObjectB }) => {
        if (gameObjectB instanceof Drop) gameObjectB.pickup()
      },
    })

    this.scene.matterCollision.addOnCollideActive({
      objectA: playerCollider,
      callback: ({ gameObjectB }) => {
        if (gameObjectB instanceof Drop) gameObjectB.pickup()
      },
    })
  }

  #whackStuff() {
    this.#touchingResources = this.#touchingResources.filter((resource) => !resource.dead)
    this.#touchingResources.forEach((resource) => resource.hit())
  }
}
