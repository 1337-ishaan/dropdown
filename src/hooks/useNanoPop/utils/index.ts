import type {
  Alignment,
  Direction,
  DirectionPairs,
  Position,
  MetaValues,
} from "../types";

export * from "./isOutside";

export const getDirectionAndAlignment = (
  position: Position
): [Direction, Alignment] => {
  const [direction, alignment = "middle"] = position.split("-");

  return [direction, alignment] as [Direction, Alignment];
};

export const getPositionPair = (vertical: boolean): DirectionPairs => {
  return vertical ? ["top", "left"] : ["left", "top"];
};

export const getPositionAndVariantValues = (
  vertical: boolean,
  options: {
    containerBox: DOMRect;
    popoverBox: DOMRect;
  }
) => {
  const { top, left, bottom, right } = options.containerBox;

  const [positionKey, variantKey] = getPositionPair(vertical);

  const [positionSize, variantSize] = vertical
    ? [options.popoverBox.height, options.popoverBox.width]
    : [options.popoverBox.width, options.popoverBox.height];

  const [positionMaximum, variantMaximum] = vertical
    ? [bottom, right]
    : [right, bottom];

  const [positionMinimum, variantMinimum] = vertical
    ? [top, left]
    : [left, top];

  return {
    position: {
      key: positionKey,
      size: positionSize,
      max: positionMaximum,
      min: positionMinimum,
    } satisfies MetaValues as MetaValues,

    variant: {
      key: variantKey,
      size: variantSize,
      max: variantMaximum,
      min: variantMinimum,
    } satisfies MetaValues as MetaValues,
  };
};
