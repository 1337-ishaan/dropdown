import type { MetaValues } from "../types";

export const isOutsideContainer = (
  value: number,
  padding: number,
  meta: MetaValues
) => {
  return value < meta.min || value + meta.size + padding > meta.max;
};

export const isOutsideViewport = (
  vertical: boolean,
  value: number,
  padding: number,
  meta: MetaValues
) => {
  if (vertical) {
    return value + meta.size + padding > document.documentElement.clientHeight;
  }

  return value + meta.size + padding < 0;
};
