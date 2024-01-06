import type { Textures, ResourceTypes, EnemyTypes, EntityTypes } from '@/constants'

export type Texture = (typeof Textures)[keyof typeof Textures]
export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes]
export type EnemyType = (typeof EnemyTypes)[keyof typeof EnemyTypes]
export type EntityType = (typeof EntityTypes)[keyof typeof EntityTypes]
export type CollisionHandler = (body: MatterJS.BodyType) => void
export type DropFrames = [number, number]
