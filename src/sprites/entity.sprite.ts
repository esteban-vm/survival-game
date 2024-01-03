import BaseEntity from '@/base-entity'
import Drop from '@/drop'

export default abstract class Entity extends BaseEntity {
  #dropFrames
  #dropItems

  constructor(drops: [number, number], ...params: RestParams) {
    super(...params)
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

type RestParams = ConstructorParameters<typeof BaseEntity>
