import '@/game.css'
import Phaser from 'phaser'
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin'
import { Main } from '@/scenes'

const config: Phaser.Types.Core.GameConfig = {
  width: 512,
  height: 512,
  type: Phaser.AUTO,
  backgroundColor: '#999',
  scene: [Main],
  autoFocus: true,
  pixelArt: true,
  scale: {
    zoom: 2,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { y: 0 },
      debug: import.meta.env.DEV,
    },
  },
  plugins: {
    scene: [
      {
        key: 'matterCollision',
        mapping: 'matterCollision',
        plugin: PhaserMatterCollisionPlugin,
      },
    ],
  },
}

export default new Phaser.Game(config)
