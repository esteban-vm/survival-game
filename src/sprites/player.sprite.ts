import nipplejs from 'nipplejs'
import { Textures } from '@/constants'
import { BaseEntity, StandardEntity } from '@/entities'
import Pickaxe from '@/pickaxe'
import Drop from '@/drop'

export default class Player extends BaseEntity {
  #controls
  #speed
  #pickaxe
  #pickaxeRotation
  #touchingEntities
  #runningOnDesktop

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player', 1, 20, 'player')
    const collider = this.physics.bodies.circle(this.x, this.y, 12)
    const sensor = this.physics.bodies.circle(this.x, this.y, 24, { isSensor: true })
    const compoundBody = this.physics.body.create({ parts: [collider, sensor], frictionAir: 0.35 })
    this.setExistingBody(compoundBody)
    this.setFixedRotation()
    const { W, S, A, D, ENTER } = Phaser.Input.Keyboard.KeyCodes
    this.#controls = <ControlKeys>this.scene.input.keyboard!.addKeys({ up: W, down: S, left: A, right: D, hit: ENTER })
    this.#speed = 2.5
    this.#pickaxe = new Pickaxe(this.scene, this.x, this.y)
    this.#pickaxeRotation = 0
    this.#touchingEntities = <StandardEntity[]>[]
    this.#runningOnDesktop = this.scene.game.device.os.desktop
    this.#createPickupCollisions(collider)
    this.#createMiningCollisions(sensor)
    this.#createJoystick()
  }

  update() {
    if (this.dead) return
    this.#handleControlKeys()
    this.toggleAnimation()
    this.#pickaxe.setPosition(this.x, this.y)
    this.#rotatePickaxe()
  }

  onDeath() {
    this.anims.stop()
    this.setTexture(Textures.Items, 0)
    this.setOrigin(0.5)
    this.#pickaxe.destroy()
  }

  #handleControlKeys() {
    const vector = new Phaser.Math.Vector2()
    const { left, right, up, down } = this.#controls

    if (left.isDown) {
      vector.x = -1
      this.setFlipX(true)
    } else if (right.isDown) {
      vector.x = 1
      this.setFlipX(false)
    }

    if (up.isDown) vector.y = -1
    else if (down.isDown) vector.y = 1

    vector.normalize()
    vector.scale(this.#speed)
    this.setVelocity(vector.x, vector.y)
  }

  #rotatePickaxe() {
    if (this.#controls.hit.isDown) {
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
    this.#touchingEntities = this.#touchingEntities.filter((entity) => !entity.dead)
    this.#touchingEntities.forEach((entity) => entity.hit())
  }

  #createJoystick() {
    if (!this.#runningOnDesktop) {
      const joystick = nipplejs.create({ color: 'green' })

      joystick.on('move', (_, data) => {
        if (this.dead) return
        const direction = data.direction?.angle
        if (direction === 'left') this.setFlipX(true)
        else if (direction === 'right') this.setFlipX(false)
        const force = Math.min(data.force, 1)
        const angle = data.angle.radian
        const speed = this.#speed * force
        this.setVelocity(speed * Math.cos(angle), -speed * Math.sin(angle))
      })

      joystick.on('pressure', () => {})
      joystick.on('end', () => this.setVelocity(0, 0))
    }
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
}

interface ControlKeys {
  up: Phaser.Input.Keyboard.Key
  down: Phaser.Input.Keyboard.Key
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
  hit: Phaser.Input.Keyboard.Key
}
