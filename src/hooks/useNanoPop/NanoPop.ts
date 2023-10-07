import {
  isOutsideContainer,
  isOutsideViewport,
  getDirectionAndAlignment,
  getPositionAndVariantValues,
} from "./utils";

import type {
  NanoPopOptions,
  PositionMatch,
  AvailablePositions,
  AvailableVariants,
} from "./types";

const convertRemToPixels = (rem: number) => {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

/* eslint-disable-next-line complexity */
export const NanoPop = (
  trigger: HTMLElement,
  popover: HTMLElement,
  options: Partial<NanoPopOptions> = {}
): PositionMatch | undefined => {
  const {
    containerBox,
    margin,
    padding,
    position,
    variantFlipOrder,
    positionFlipOrder,
  }: NanoPopOptions = {
    containerBox: document.documentElement.getBoundingClientRect(),

    variantFlipOrder: {
      start: "sme",
      middle: "mse",
      end: "ems",
    },

    positionFlipOrder: {
      top: "tbrl",
      right: "rlbt",
      bottom: "btrl",
      left: "lrbt",
    },

    // position: "bottom-end",
    margin: 0,
    padding: 0,

    /**
     * Make sure explicitly undefined values
     * can't override actual values
     */
    // ...removeUndefinedProperties(options),
    position: options.position!,
  };

  /**
   * Reset position to resolve viewport
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/position#fixed
   */
  const { left: originalLeft, top: originalTop } = popover.style;

  popover.style.left = "0";
  popover.style.top = "0";

  const triggerBox = trigger.getBoundingClientRect();

  const popoverBox = popover.getBoundingClientRect();

  // console.log(popover.style.paddingLeft);
  // console.log(popover.style.paddingRight);

  // popoverBox.width +=
  //   parseInt(popover.style.paddingLeft, 10) +
  //     parseInt(popover.style.paddingRight, 10) ?? 0;

  /**
   * Holds coordinates of top, left, bottom and right alignment
   */
  const positionStore: AvailablePositions = {
    t: triggerBox.top - popoverBox.height - margin,
    b: triggerBox.bottom + margin,
    r: triggerBox.right + margin,
    l: triggerBox.left - popoverBox.width - margin,
  };

  /**
   * Holds corresponding variants (start, middle, end).
   * The values depend on horizontal / vertical orientation
   */
  const variantStore: AvailableVariants = {
    vs: triggerBox.left,
    vm: triggerBox.left + triggerBox.width / 2 - popoverBox.width / 2,
    ve: triggerBox.left + triggerBox.width - popoverBox.width,
    hs: triggerBox.top,
    hm: triggerBox.bottom - triggerBox.height / 2 - popoverBox.height / 2,
    he: triggerBox.bottom - popoverBox.height,
  };

  const [direction, alignment] = getDirectionAndAlignment(position);

  const positions = positionFlipOrder[direction];

  const variants = variantFlipOrder[alignment];

  for (const p of positions) {
    const vertical = p === "t" || p === "b";

    let positionValue = positionStore[p as keyof AvailablePositions];

    const { position, variant } = getPositionAndVariantValues(vertical, {
      containerBox,
      popoverBox,
    });

    if (isOutsideContainer(positionValue, padding, position)) {
      continue;
    }

    if (isOutsideViewport(vertical, positionValue, padding, position)) {
      continue;
    }

    for (const v of variants) {
      let variantValue =
        variantStore[((vertical ? "v" : "h") + v) as keyof AvailableVariants];

      if (isOutsideContainer(variantValue, padding, variant)) {
        continue;
      }

      if (isOutsideViewport(false, variantValue, padding, variant)) {
        continue;
      }

      variantValue -= popoverBox[variant.key];
      positionValue -= popoverBox[position.key];

      popover.style[variant.key] = `${variantValue}px`;
      popover.style[position.key] = `${positionValue}px`;

      return (p + v) as PositionMatch;
    }
  }

  /**
   * Revert style values (won't work with styled-elements or similar systems)
   * @fix @see https://github.com/Simonwep/nanopop/issues/7
   */
  popover.style.left = originalLeft;
  popover.style.top = originalTop;
};
