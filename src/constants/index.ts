export const Atlases = <const>{
  Player: 'player',
  Enemies: 'enemies',
  Resources: 'resources',
}

export const Textures = <const>{
  ...Atlases,
  Items: 'items',
}

export const Animations = <const>{
  Player: 'player_anim',
  Enemies: 'enemies_anim',
}

export const ResourceTypes = <const>{
  Bush: 'bush',
  Rock: 'rock',
  Tree: 'tree',
}

export const EnemyTypes = <const>{
  Bear: 'bear',
  Wolf: 'wolf',
  Ent: 'ent',
}

export const EntityTypes = <const>{
  ...ResourceTypes,
  ...EnemyTypes,
  Player: 'player',
  Drop: 'drop',
}

export const Layers = <const>{
  Map1: 'Layer 1',
  Map2: 'Layer 2',
  Resources: 'Resources',
  Enemies: 'Enemies',
}

export const Scenes = <const>{
  Main: 'Main Scene',
  Preloader: 'Preloader Scene',
}

export const Stuff = <const>{
  GameMap: 'map',
  Tileset: 'tileset',
  TilesetName: 'rpg_nature_tileset',
}
