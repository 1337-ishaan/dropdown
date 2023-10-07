export interface GlobalEventsProps {
  stop?: boolean;
  prevent?: boolean;

  /* eslint-disable vue/require-default-prop */
  onAnimationCancel?: (event: AnimationEvent) => void;
  onAnimationEnd?: (event: AnimationEvent) => void;
  onAnimationIteration?: (event: AnimationEvent) => void;
  onAnimationStart?: (event: AnimationEvent) => void;

  onBeforeInput?: (event: InputEvent) => void;
  onInput?: (event: Event) => void;
  onChange?: (event: Event) => void;
  onSubmit?: (event: SubmitEvent) => void;

  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onFocusIn?: (event: FocusEvent) => void;
  onFocusOut?: (event: FocusEvent) => void;

  onClick?: (event: MouseEvent) => void;
  onDblClick?: (event: MouseEvent) => void;

  onClose?: (event: Event) => void;
  onContextMenu?: (event: MouseEvent) => void;

  onCopy?: (event: ClipboardEvent) => void;
  onPaste?: (event: ClipboardEvent) => void;

  onDrag?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
  onDragEnter?: (event: DragEvent) => void;
  onDragLeave?: (event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
  onDragStart?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;

  onError?: (event: ErrorEvent) => void;
  onLoad?: (event: Event) => void;

  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyPress?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;

  onMouseDown?: (event: MouseEvent) => void;
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onMouseMove?: (event: MouseEvent) => void;
  onMouseOut?: (event: MouseEvent) => void;
  onMouseOver?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;

  onPointerCancel?: (event: PointerEvent) => void;
  onPointerDown?: (event: PointerEvent) => void;
  onPointerEnter?: (event: PointerEvent) => void;
  onPointerLeave?: (event: PointerEvent) => void;
  onPointerMove?: (event: PointerEvent) => void;
  onPointerOut?: (event: PointerEvent) => void;
  onPointerOver?: (event: PointerEvent) => void;
  onPointerUp?: (event: PointerEvent) => void;

  onTouchCancel?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onTouchStart?: (event: TouchEvent) => void;

  onReset?: (event: UIEvent) => void;
  onResize?: (event: UIEvent) => void;

  onScroll?: (event: Event) => void;
  onScrollEnd?: (event: Event) => void;

  onSelect?: (event: Event) => void;
  onSelectionChange?: (event: Event) => void;
  onSelectStart?: (event: Event) => void;
  /* eslint-enable vue/require-default-prop */
}

/* @vue-ignore */
export type ToEventName<T extends string> = T extends `on${infer E}`
  ? Lowercase<E>
  : never;

export type EventName = ToEventName<keyof GlobalEventsProps>;

export type EventKeys = keyof Omit<GlobalEventsProps, "stop" | "prevent">;
