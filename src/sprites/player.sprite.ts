import { Texture, Sound } from '@/constants'
import Entity from '@/entity'
import Pickaxe from '@/pickaxe'
import Resource from '@/resource'
import Drop from '@/drop'

export default class Player extends Entity {
  #keys
  #mousePointer
  // #touchPointer
  #pickaxe
  #pickaxeRotation
  #touchingResources

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Texture.Player, 'player_idle_1', 2, undefined, Sound.Player)
    const collider = this.physics.bodies.circle(this.x, this.y, 12)
    const sensor = this.physics.bodies.circle(this.x, this.y, 24, { isSensor: true })
    const compoundBody = this.physics.body.create({ parts: [collider, sensor], frictionAir: 0.35 })
    this.setExistingBody(compoundBody)
    this.setFixedRotation()
    this.#keys = this.scene.input.keyboard!.createCursorKeys()
    this.#mousePointer = this.scene.input.mousePointer
    // this.#touchPointer = this.scene.input.pointer1
    this.#pickaxe = new Pickaxe(this.scene, this.x, this.y)
    this.#pickaxeRotation = 0
    this.#touchingResources = <Resource[]>[]
    this.#createPickupCollisions(collider)
    this.#createMiningCollisions(sensor)
  }

  update() {
    const vector = new Phaser.Math.Vector2()
    const { left, right, up, down } = this.#keys
    // const { position, wasTouch } = this.#touchPointer

    const touchingLeft = left.isDown /* || (wasTouch && position.x < this.x) */
    const touchingRight = right.isDown /* || (wasTouch && position.x > this.x) */
    const touchingUp = up.isDown /* || (wasTouch && position.y < this.y) */
    const touchingDown = down.isDown /* || (wasTouch && position.y > this.y) */

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
    const { x, y } = this.velocity

    if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) this.anims.play('player_walk', true)
    else this.anims.play('player_idle', true)

    this.#pickaxe.setPosition(this.x, this.y)
    this.#rotatePickaxe()
  }

  #rotatePickaxe() {
    if (this.#mousePointer.isDown) this.#pickaxeRotation += 6
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
        if (gameObjectB instanceof Drop) gameObjectB.pickup()
      },
    })
  }

  #createMiningCollisions(playerSensor: MatterJS.BodyType) {
    this.scene.matterCollision.addOnCollideStart({
      objectA: playerSensor,
      callback: ({ bodyB, gameObjectB }) => {
        if ((<typeof playerSensor>bodyB).isSensor) return
        if (gameObjectB instanceof Resource) this.#touchingResources.push(gameObjectB)
      },
    })

    this.scene.matterCollision.addOnCollideEnd({
      objectA: playerSensor,
      callback: ({ gameObjectB }) => {
        this.#touchingResources = this.#touchingResources.filter((object) => object !== gameObjectB)
      },
    })
  }

  #whackStuff() {
    this.#touchingResources = this.#touchingResources.filter((resource) => !resource.dead)
    this.#touchingResources.forEach((resource) => resource.hit())
  }
}
