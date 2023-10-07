export type Direction = "top" | "right" | "bottom" | "left";

export type Alignment = "start" | "middle" | "end";

export type VariantFlipOrder = Record<Alignment, string>;

export type PositionFlipOrder = Record<Direction, string>;

export type Position = `${Direction}-${Alignment}` | Direction;

export type DirectionPairs = [Direction, Direction];

export interface MetaValues {
  key: Direction;
  size: number;
  max: number;
  min: number;
}

export type NanoPopOptions = {
  containerBox: DOMRect;
  position: Position;
  variantFlipOrder: VariantFlipOrder;
  positionFlipOrder: PositionFlipOrder;
  margin: number;
  padding?: number;
};

export type AvailablePositions = {
  t: number;
  b: number;
  l: number;
  r: number;
};

export type AvailableVariants = {
  vs: number;
  vm: number;
  ve: number;
  hs: number;
  hm: number;
  he: number;
};

export type PositionMatch =
  | "ts"
  | "tm"
  | "te"
  | "bs"
  | "bm"
  | "be"
  | "ls"
  | "lm"
  | "le"
  | "rs"
  | "rm"
  | "re";
