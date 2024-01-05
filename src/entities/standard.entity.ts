import type { DropFrames } from '@/types'
import BaseEntity from '@/base'
import Drop from '@/drop'

export default abstract class StandardEntity extends BaseEntity {
  #dropFrames
  #dropItems

  constructor(drops: DropFrames, ...params: BaseEntityParams) {
    super(...params)
    this.x += this.width / 2
    this.y -= this.height / 2
    this.#dropFrames = drops
    this.#dropItems = <Drop[]>[]
  }

  hit() {
    super.hit()
    if (this.dead) {
      this.#dropFrames.forEach((frame) => {
        this.#dropItems.push(new Drop(this.scene, this.x, this.y, frame))
      })
      this.destroy()
    }
  }
}

type BaseEntityParams = ConstructorParameters<typeof BaseEntity>
