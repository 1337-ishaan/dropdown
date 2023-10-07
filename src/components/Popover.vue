<template>
  <div ref="trigger" class="trigger" @keydown="$emit('keydown', $event)">
    <slot />
  </div>

  <div ref="popover" class="popover" @keydown="$emit('keydown', $event)">
    <slot name="popover" />
  </div>

  <!-- <GlobalEvents prevent @resize="reposition" @scroll="reposition" /> -->
</template>

<script lang="ts" setup>
  import { inject, onMounted, onUpdated, provide, ref } from "vue";
  import { NanoPop } from "~/hooks";

  import type { Position } from "~/hooks";
  // import GlobalEvents from "./GlobalEvents.vue";

  export interface PopoverProps {
    position: Position;
  }

  const props = defineProps<PopoverProps>();

  const emit = defineEmits<{
    keydown: [event: KeyboardEvent];
  }>();

  const trigger = ref<HTMLDivElement>();

  const popover = ref<HTMLDivElement>();

  const childrenPopoverCallbacks: (() => void)[] = [];

  const reposition = () => {
    if (popover.value && trigger.value) {
      NanoPop(trigger.value, popover.value, {
        position: props.position,
      });

      childrenPopoverCallbacks.forEach(cb => cb());
    }
  };

  interface ParentPopover {
    onParentReposition: (cb: () => void) => void;
  }

  const parentPopover = inject<ParentPopover | undefined>(
    "popover-parent",
    undefined
  );

  if (!parentPopover) {
    provide("popover-parent", {
      onParentReposition(cb: () => void) {
        childrenPopoverCallbacks.push(cb);
      },
    });
  } else {
    parentPopover.onParentReposition(reposition);
  }

  onMounted(() => {
    reposition();
  });

  onUpdated(() => {
    reposition();
  });
</script>

<style lang="scss">
  .trigger {
    display: inline-block;
  }

  .popover {
    position: fixed;
  }
</style>
