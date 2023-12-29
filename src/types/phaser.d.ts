import 'phaser'
import type MatterCollisionPlugin from 'phaser-matter-collision-plugin'

declare module 'phaser' {
  interface Scene {
    matterCollision: MatterCollisionPlugin
  }
}
