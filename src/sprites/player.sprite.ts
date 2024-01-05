import { BaseEntity, StandardEntity } from '@/entities'
import Pickaxe from '@/pickaxe'
import Drop from '@/drop'

export default class Player extends BaseEntity {
  #keys
  #pointer
  #pickaxe
  #pickaxeRotation
  #touchingEntities

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player', 1, 2, 'player')
    const collider = this.physics.bodies.circle(this.x, this.y, 12)
    const sensor = this.physics.bodies.circle(this.x, this.y, 24, { isSensor: true })
    const compoundBody = this.physics.body.create({ parts: [collider, sensor], frictionAir: 0.35 })
    this.setExistingBody(compoundBody)
    this.setFixedRotation()
    this.#keys = this.scene.input.keyboard!.createCursorKeys()
    this.#pointer = this.scene.input.mousePointer
    this.#pickaxe = new Pickaxe(this.scene, this.x, this.y)
    this.#pickaxeRotation = 0
    this.#touchingEntities = <StandardEntity[]>[]
    this.#createPickupCollisions(collider)
    this.#createMiningCollisions(sensor)
  }

  update() {
    const vector = new Phaser.Math.Vector2()
    const { left, right, up, down } = this.#keys

    const touchingLeft = left.isDown
    const touchingRight = right.isDown
    const touchingUp = up.isDown
    const touchingDown = down.isDown

    if (touchingLeft) {
      vector.x = -1
      this.setFlipX(true)
    } else if (touchingRight) {
      vector.x = 1
      this.setFlipX(false)
    }

    if (touchingUp) vector.y = -1
    else if (touchingDown) vector.y = 1

    vector.normalize()
    vector.scale(2.5)

    this.setVelocity(vector.x, vector.y)
    this.toggleAnimation()
    this.#pickaxe.setPosition(this.x, this.y)
    this.#rotatePickaxe()
  }

  #rotatePickaxe() {
    if (this.#pointer.isDown) this.#pickaxeRotation += 6
    else this.#pickaxeRotation = 0

    if (this.#pickaxeRotation > 100) {
      this.#pickaxeRotation = 0
      this.#whackStuff()
    }

    if (this.flipX) this.#pickaxe.setAngle(-this.#pickaxeRotation - 90)
    else this.#pickaxe.setAngle(this.#pickaxeRotation)
  }

  #createPickupCollisions(playerCollider: MatterJS.BodyType) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: playerCollider,
      callback: ({ gameObjectB }) => {
        if (gameObjectB instanceof Drop) gameObjectB.hit()
      },
    })
  }

  #createMiningCollisions(playerSensor: MatterJS.BodyType) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: playerSensor,
      callback: ({ bodyB, gameObjectB }) => {
        if ((<MatterJS.BodyType>bodyB).isSensor) return
        if (gameObjectB instanceof StandardEntity) this.#touchingEntities.push(gameObjectB)
      },
    })

    this.scene.matterCollision.addOnCollideEnd({
      objectA: playerSensor,
      callback: ({ gameObjectB }) => {
        this.#touchingEntities = this.#touchingEntities.filter((object) => object !== gameObjectB)
      },
    })
  }

  #whackStuff() {
    this.#touchingEntities = this.#touchingEntities.filter((entity) => !entity.dead)
    this.#touchingEntities.forEach((entity) => entity.hit())
  }
}
