import type { CollisionHandler } from '@/types'
import nipplejs from 'nipplejs'
import { Textures } from '@/constants'
import { BaseEntity, StandardEntity } from '@/entities'
import Pickaxe from '@/pickaxe'
import Drop from '@/drop'

export default class Player extends BaseEntity {
  #speed
  #pickaxe
  #pickaxeRotation
  #controlKeys
  #collidingEntities
  #touchAvailable

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player', 1, 20, 'player')
    const collider = this.createCircleBody(12)
    const sensor = this.createCircleBody(24, true)
    const compoundBody = this.createCompoundBody(collider, sensor)
    this.setExistingBody(compoundBody)
    this.setFixedRotation()
    this.#speed = 2.5
    this.#pickaxe = new Pickaxe(this.scene, this.x, this.y)
    this.#pickaxeRotation = 0
    this.#controlKeys = <ControlKeys>this.scene.input.keyboard!.addKeys(keyCodes.join(','))
    this.#collidingEntities = <StandardEntity[]>[]
    this.#touchAvailable = this.scene.game.device.input.touch
    this.#createPickupCollisions(collider)
    this.#createMiningCollisions(sensor)
    this.#createJoystick()
  }

  update() {
    if (this.dead) return
    this.#handleControlKeys()
    this.#rotatePickaxe()
  }

  onDeath() {
    this.anims.stop()
    this.setTexture(Textures.Items, 0)
    this.setOrigin(0.5)
    this.#pickaxe.destroy()
  }

  #handleControlKeys() {
    if (this.#touchAvailable) return
    this.toggleAnimation()
    const vector = new Phaser.Math.Vector2()
    const { A, D, W, S, LEFT, RIGHT, UP, DOWN } = this.#controlKeys

    if (A.isDown || LEFT.isDown) {
      vector.x = -1
      this.setFlipX(true)
    } else if (D.isDown || RIGHT.isDown) {
      vector.x = 1
      this.setFlipX(false)
    }

    if (W.isDown || UP.isDown) {
      vector.y = -1
    } else if (S.isDown || DOWN.isDown) {
      vector.y = 1
    }

    vector.normalize()
    vector.scale(this.#speed)
    this.setVelocity(vector.x, vector.y)
  }

  #rotatePickaxe() {
    this.#pickaxe.setPosition(this.x, this.y)
    const { ENTER, SPACE } = this.#controlKeys

    if (ENTER.isDown || SPACE.isDown) {
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

  #whackStuff() {
    this.#collidingEntities = this.#collidingEntities.filter((entity) => !entity.dead)
    this.#collidingEntities.forEach((entity) => entity.hit())
  }

  #createJoystick() {
    if (!this.#touchAvailable) return
    const joystick = nipplejs.create({ color: 'green', size: 80 })
    this.playAnimation('idle')

    joystick.on('move', (_, data) => {
      if (this.dead) return
      this.toggleAnimation()
      const direction = data.direction?.angle

      if (direction === 'left') {
        this.setFlipX(true)
      } else if (direction === 'right') {
        this.setFlipX(false)
      }

      const force = Math.min(data.force, 1)
      const angle = data.angle.radian
      const speed = this.#speed * force
      this.setVelocity(speed * Math.cos(angle), -speed * Math.sin(angle))
    })

    joystick.on('end', () => {
      this.playAnimation('idle')
      this.setVelocity(0, 0)
    })
  }

  #createPickupCollisions: CollisionHandler = (playerCollider) => {
    this.scene.matterCollision.addOnCollideStart({
      objectA: playerCollider,
      callback: ({ gameObjectB }) => {
        if (gameObjectB instanceof Drop) gameObjectB.hit()
      },
    })
  }

  #createMiningCollisions: CollisionHandler = (playerSensor) => {
    this.scene.matterCollision.addOnCollideStart({
      objectA: playerSensor,
      callback: ({ bodyB, gameObjectB }) => {
        if ((<typeof playerSensor>bodyB).isSensor) return
        if (gameObjectB instanceof StandardEntity) this.#collidingEntities.push(gameObjectB)
      },
    })

    this.scene.matterCollision.addOnCollideEnd({
      objectA: playerSensor,
      callback: ({ gameObjectB }) => {
        this.#collidingEntities = this.#collidingEntities.filter((object) => object !== gameObjectB)
      },
    })
  }
}

const keyCodes = <const>['W', 'S', 'A', 'D', 'ENTER', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE']
type ControlKey = (typeof keyCodes)[number]
type ControlKeys = Record<ControlKey, Phaser.Input.Keyboard.Key>
